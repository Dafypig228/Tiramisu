(function () {
  const QUESTIONS = window.SAT_QUESTIONS || [];
  // Cards: only the new (v2) cards are shown. Old card ids are mapped to their replacements,
  // so question links and cards already pinned on a board keep working.
  const ALL_CARDS = window.SAT_FORMULAS || [];
  const CARD_MAP_OLD = window.CARD_MAP_OLD || {};
  const TOPIC_ORDER = ['linear', 'advanced', 'ratios', 'data', 'geometry', 'trig', 'circles', 'desmos', 'strategy'];
  const NEW_CARDS = ALL_CARDS.filter(f => f && f.v === 2);
  const FORMULAS = (NEW_CARDS.length ? NEW_CARDS : ALL_CARDS)
    .map((f, i) => ({ f, i }))
    .sort((a, b) => {
      const ta = TOPIC_ORDER.indexOf(a.f.topic), tb = TOPIC_ORDER.indexOf(b.f.topic);
      if (ta !== tb) return (ta < 0 ? 99 : ta) - (tb < 0 ? 99 : tb);
      const ba = a.f.badge === 'bonus' ? 1 : 0, bb = b.f.badge === 'bonus' ? 1 : 0;
      return ba - bb || a.i - b.i;
    })
    .map(x => x.f);
  const CARD_BY_ID = {};
  FORMULAS.forEach(f => { CARD_BY_ID[f.id] = f; });
  // Old or new id → list of new card ids.
  const resolveCardIds = (id) => CARD_BY_ID[id] ? [id] : (CARD_MAP_OLD[id] || []).filter(n => CARD_BY_ID[n]);
  const cardById = (id) => CARD_BY_ID[id] || CARD_BY_ID[resolveCardIds(id)[0]] || null;
  if (window.FORMULA_OVERRIDES) {
    QUESTIONS.forEach(q => { if (window.FORMULA_OVERRIDES[q.id]) q.formulas = window.FORMULA_OVERRIDES[q.id]; });
  }
  QUESTIONS.forEach(q => {
    let ids = [];
    (q.formulas || []).forEach(id => resolveCardIds(id).forEach(n => { if (!ids.includes(n)) ids.push(n); }));
    if (window.CARD_LINK_FIX) ids = window.CARD_LINK_FIX(q, ids).filter(n => CARD_BY_ID[n]);
    q.formulas = ids;
  });
  const CK = window.CardKit;
  const cardApi = () => ({ renderMath, putInDesmos });

  /* ==================== DEFAULT SETTINGS & PERSISTENCE ==================== */
  const DEFAULT_SETTINGS = {
    smartPass: true,
    panButton: 2, // 2 = right click, 1 = middle click
    wheelMode: 'ctrlZoom',
    zoomSpeed: 22, // 22 => 0.0022 smooth touchpad scaling
    stylusOnly: false,
    defaultTool: 'pen',
    defaultGrid: 'grid-dot',
    snapDelay: 400,
    laserFade: 1300,
    textSize: 19,
    colors: ['#111111', '#dc2626', '#2563eb', '#16a34a', '#eab308'],
    desmosAngles: 'deg',
    zenProj: true,
    pasteTarget: 'desmos',
    sbUrl: '',
    sbKey: '',
    keybinds: {
      cursor: 'Digit1',
      select: 'KeyV',
      pen: 'KeyP',
      highlighter: 'KeyH',
      laser: 'KeyL',
      eraser: 'KeyE',
      text: 'KeyT',
      zen: 'KeyZ',
      formulas: 'KeyF',
      desmos: 'KeyG',
      photos: 'KeyD'
    }
  };

  let settings = loadSettings();
  function loadSettings() {
    try {
      const raw = localStorage.getItem('sat_wb_settings_v1');
      if (!raw) return JSON.parse(JSON.stringify(DEFAULT_SETTINGS));
      const p = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...p, keybinds: { ...DEFAULT_SETTINGS.keybinds, ...(p.keybinds || {}) } };
    } catch { return JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); }
  }
  function saveSettings() {
    try { localStorage.setItem('sat_wb_settings_v1', JSON.stringify(settings)); } catch {}
    syncProfileToSupabase();
  }

  /* ==================== HELPERS ==================== */
  function toast(msg) {
    const t = document.getElementById('toast');
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._id); t._id = setTimeout(() => t.classList.remove('show'), 2200);
  }
  function renderMath(el) {
    if (window.renderMathInElement) {
      window.renderMathInElement(el, {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }],
        throwOnError: false
      });
    }
  }
  let clientId = localStorage.getItem('sat_wb_cid') || (() => {
    const id = 'u_' + Math.random().toString(36).slice(2, 10);
    localStorage.setItem('sat_wb_cid', id);
    return id;
  })();
  const peerId = sessionStorage.getItem('sat_wb_peer_id') || (() => {
    const id = 'p_' + Math.random().toString(36).slice(2, 10);
    sessionStorage.setItem('sat_wb_peer_id', id);
    return id;
  })();

  /* ==================== INDEXEDDB ==================== */
  let dbP = null;
  function openDB() {
    if (dbP) return dbP;
    dbP = new Promise((res) => {
      try {
        const q = indexedDB.open('sat_wb_full_db', 1);
        q.onupgradeneeded = (e) => e.target.result.createObjectStore('assets');
        q.onsuccess = () => res(q.result); q.onerror = () => res(null);
      } catch { res(null); }
    });
    return dbP;
  }
  async function idbSet(k, v) {
    const db = await openDB();
    if (!db) { try { localStorage.setItem('wbf_' + k, JSON.stringify(v)); } catch {} return; }
    return new Promise((res) => {
      const tx = db.transaction('assets', 'readwrite');
      tx.objectStore('assets').put(v, k); tx.oncomplete = () => res(); tx.onerror = () => res();
    });
  }
  async function idbGet(k) {
    const db = await openDB();
    if (!db) { try { return JSON.parse(localStorage.getItem('wbf_' + k)); } catch { return null; } }
    return new Promise((res) => {
      const tx = db.transaction('assets', 'readonly');
      const r = tx.objectStore('assets').get(k); r.onsuccess = () => res(r.result ?? null); r.onerror = () => res(null);
    });
  }

  /* ==================== STATE ==================== */
  let currentIndex = 0;
  const isPhone = () => window.innerWidth <= 640;
  function homeCam() {
    if (isPhone()) { const z = Math.max(0.35, Math.min(1, (window.innerWidth - 14) / 600)); return { x: window.innerWidth / 2, y: 106 + 245 * z, z }; }
    return { x: window.innerWidth * 0.48, y: window.innerHeight * 0.48, z: 1 };
  }
  let cam = homeCam();
  let diagramScale = 1;
  let objects = [];
  let boardWidgets = [];
  let desmosPhotos = [];
  let desmosCalc = null;
  let savedDesmosState = null;
  let customDiagramImg = null;
  let picked = null;

  let activeRoom = (localStorage.getItem('sat_wb_active_room') || 'LOCAL').toUpperCase();
  let savedRooms = (() => {
    try {
      const arr = JSON.parse(localStorage.getItem('sat_wb_saved_rooms') || '["LOCAL"]');
      return Array.isArray(arr) && arr.length ? arr : ['LOCAL'];
    } catch { return ['LOCAL']; }
  })();
  let hasLoadedCurrentQ = false;

  let progress = JSON.parse(localStorage.getItem('sat_wb_progress') || '{}');
  let soloMode = false;
  let soloRevealed = false;
  let zenOn = false;

  let tool = settings.defaultTool || 'pen';
  let shapeType = null;
  let inkColor = settings.colors[0] || '#111111';
  let inkWidth = 3.5;
  let snapOn = true;
  let spaceHeld = false;

  const undoByQ = {};
  const redoByQ = {};
  let selectedId = null;

  let laserTrail = [];
  let laserActive = false;
  const peerLasers = {};
  const imgCache = new Map();

  /* ==================== SUPABASE CLIENT & LIVE MULTIPLAYER ==================== */
  let sb = null;
  let roomChannel = null;
  let roomCode = null;
  let isHost = false;
  let tutorLocked = false;
  let peers = {};
  let lastCursorSend = 0;

  async function initSupabase(silent = false) {
    const url = (settings.sbUrl || (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || '').trim();
    const key = (settings.sbKey || (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || '').trim();
    if (!url || !key || typeof window.supabase === 'undefined') {
      sb = null;
      document.getElementById('sbStatusText').textContent = 'Local mode (IndexedDB)';
      return false;
    }
    try {
      sb = window.supabase.createClient(url, key);
      const { data: sess } = await sb.auth.getSession();
      if (sess && sess.session && sess.session.user) {
        clientId = sess.session.user.id;
      } else {
        const { data: anonData, error: anonErr } = await sb.auth.signInAnonymously().catch((e) => ({ data: null, error: e }));
        if (anonData && anonData.user) clientId = anonData.user.id;
        else {
          console.warn('Anonymous sign-in failed:', anonErr && anonErr.message);
          document.getElementById('sbStatusText').textContent = 'Live sync only — rooms won\'t be saved (enable Anonymous sign-ins in Supabase Auth)';
          if (!silent) toast('Supabase: anonymous sign-in is off');
          return true;
        }
      }
      document.getElementById('sbStatusText').textContent = 'Connected (Auto-Login Ready)';
      if (!silent) toast('Supabase connected');
      return true;
    } catch {
      sb = null;
      document.getElementById('sbStatusText').textContent = 'Invalid Supabase URL/Key';
      return false;
    }
  }

  async function syncProfileToSupabase() {
    if (!sb) return;
    try {
      await sb.from('user_profiles').upsert({
        client_id: clientId,
        display_name: document.getElementById('roomNameInput').value || 'Friend',
        settings, progress, updated_at: new Date().toISOString()
      });
    } catch {}
  }

  function rememberRoom(code) {
    code = (code || 'LOCAL').trim().toUpperCase() || 'LOCAL';
    activeRoom = code;
    if (!savedRooms.includes(code)) savedRooms.push(code);
    localStorage.setItem('sat_wb_active_room', code);
    localStorage.setItem('sat_wb_saved_rooms', JSON.stringify(savedRooms));
    const url = new URL(location.href);
    if (code === 'LOCAL') url.searchParams.delete('room');
    else url.searchParams.set('room', code);
    history.replaceState({}, '', url.pathname + url.search);
    document.getElementById('roomBadgeText').textContent = code === 'LOCAL' ? 'Local' : code;
    renderSavedRooms();
  }

  function renderSavedRooms() {
    const mount = document.getElementById('savedRoomsList');
    if (!mount) return;
    mount.innerHTML = '';
    savedRooms.forEach(code => {
      const wrap = document.createElement('div');
      wrap.style.cssText = 'display:inline-flex;align-items:center;gap:2px;';
      const btn = document.createElement('button');
      btn.className = 'chip-btn' + (code === activeRoom ? ' active' : '');
      btn.textContent = code === 'LOCAL' ? 'Local Board' : code;
      btn.onclick = () => swapRoom(code);
      wrap.appendChild(btn);
      if (code !== 'LOCAL') {
        const del = document.createElement('button');
        del.className = 'chip-btn';
        del.textContent = '×';
        del.title = 'Remove room from list';
        del.onclick = (e) => {
          e.stopPropagation();
          savedRooms = savedRooms.filter(r => r !== code);
          localStorage.setItem('sat_wb_saved_rooms', JSON.stringify(savedRooms));
          if (activeRoom === code) swapRoom('LOCAL');
          else renderSavedRooms();
        };
        wrap.appendChild(del);
      }
      mount.appendChild(wrap);
    });
  }

  async function swapRoom(code) {
    code = (code || 'LOCAL').trim().toUpperCase() || 'LOCAL';
    if (hasLoadedCurrentQ) await saveWorkspace();
    if (code === 'LOCAL') {
      await leaveRoom(true);
      return;
    }
    await joinRoom(code, localStorage.getItem('sat_wb_host_' + code) === clientId);
  }

  let lastLiveStrokeSend = 0;

  function setRoomStatus(msg, bg = '#f8f9fa', color = '#111') {
    const el = document.getElementById('roomSyncStatus');
    if (el) { el.textContent = msg; el.style.background = bg; el.style.color = color; }
  }

  function clearBoardMemory() {
    hasLoadedCurrentQ = false;
    objects = [];
    boardWidgets = [];
    desmosPhotos = [];
    savedDesmosState = null;
    diagramScale = 1;
    selectedId = null;
    document.querySelectorAll('.board-widget').forEach(w => w.remove());
    if (desmosCalc) desmosCalc = null;
  }

  function mergeRemoteObject(obj) {
    if (!obj || !obj.id) return;
    const idx = objects.findIndex(o => o.id === obj.id);
    if (idx !== -1) objects[idx] = obj;
    else objects.push(obj);
  }

  function broadcastObject(obj) {
    if (!roomChannel || !obj) return;
    if (tutorLocked && !isHost) return;
    roomChannel.send({
      type: 'broadcast',
      event: 'obj_upsert',
      payload: { sender: peerId, questionId: currentQ().id, obj }
    });
  }

  function boardPayload() {
    return {
      sender: peerId, questionId: currentQ().id, objects, diagramScale, tutorLocked,
      boardWidgets, desmosState: shareableDesmos(desmosCalc ? desmosCalc.getState() : savedDesmosState)
    };
  }

  /* ---- Desmos live sync ---- */
  let lastDesmosJson = '';
  let desmosSendTimer = null;

  // Desmos state without the camera (pan/zoom) — each person keeps their own view.
  function shareableDesmos(st) {
    if (!st) return st;
    const copy = { ...st, graph: { ...(st.graph || {}) } };
    delete copy.graph.viewport;
    return copy;
  }

  // Put a remote Desmos state into the local calculator without echoing it back. Keeps the local viewport.
  function applyDesmosState(state) {
    if (!desmosCalc || !state) return;
    const cur = desmosCalc.getState();
    if (JSON.stringify(shareableDesmos(cur)) === JSON.stringify(shareableDesmos(state))) return;
    const merged = { ...state, graph: { ...(state.graph || {}) } };
    if (cur.graph && cur.graph.viewport) merged.graph.viewport = cur.graph.viewport;
    else delete merged.graph.viewport;
    desmosCalc.setState(merged, { allowUndo: false });
    lastDesmosJson = JSON.stringify(shareableDesmos(desmosCalc.getState()));
  }

  // Called by Desmos on every local edit; debounced, then sent to the room.
  function onLocalDesmosChange() {
    clearTimeout(desmosSendTimer);
    desmosSendTimer = setTimeout(() => {
      if (!desmosCalc) return;
      const st = desmosCalc.getState();
      savedDesmosState = st;
      saveWorkspace();
      const shared = shareableDesmos(st);
      const json = JSON.stringify(shared);
      if (json === lastDesmosJson) return; // only pan/zoom changed, or the change came from a remote setState
      lastDesmosJson = json;
      if (!roomCode || (tutorLocked && !isHost)) return;
      if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'desmos_state', payload: { sender: peerId, questionId: currentQ().id, state: shared } });
      if (sb) sb.from('rooms').update({ desmos_state: st, board_widgets: boardWidgets, updated_at: new Date().toISOString() })
        .eq('room_code', roomCode).then(({ error }) => { if (error) console.warn('Room DB update:', error.message); });
    }, 350);
  }

  // Replace on-board widgets with the room's version. A live Desmos is kept (only moved/updated) so it doesn't flicker.
  function applyRemoteWidgets(widgets, desmosState) {
    widgets = Array.isArray(widgets) ? widgets.map(w => ({ ...w })) : [];
    savedDesmosState = desmosState || null;
    const remoteDesmos = widgets.find(w => w.kind === 'desmos');
    const desmosEl = document.getElementById('desmosBoardWidget');
    const keep = {};
    document.querySelectorAll('.board-widget').forEach(el => {
      if (el === desmosEl) return;
      const w = el._wd, r = w && widgets.find(x => x.id === w.id);
      if (r && el._sync && el._qid === currentQ().id && r.kind === w.kind && (w.kind !== 'formula' || r.formulaId === w.formulaId)) keep[w.id] = el;
      else el.remove();
    });
    const keepDesmos = !!(desmosEl && remoteDesmos && desmosCalc && desmosEl._wd);
    if (desmosEl && !keepDesmos) { desmosEl.remove(); desmosCalc = null; }
    boardWidgets = widgets;
    widgets.forEach((wd, i) => {
      if (wd.kind === 'desmos' && keepDesmos) {
        const local = Object.assign(desmosEl._wd, wd);
        boardWidgets[i] = local;
        desmosEl.style.left = local.x + 'px'; desmosEl.style.top = local.y + 'px';
        desmosEl.style.width = local.w + 'px'; desmosEl.style.height = local.h + 'px';
        desmosCalc.resize();
        applyDesmosState(savedDesmosState);
      } else if (keep[wd.id]) {
        keep[wd.id]._sync(wd);
        boardWidgets[i] = keep[wd.id]._wd;
      } else {
        renderBoardWidget(wd);
      }
    });
  }

  async function joinRoom(code, hostFlag = false) {
    code = (code || '').trim().toUpperCase();
    if (!code) return;

    // 1. Save OLD room first, then wipe in-memory canvas BEFORE switching activeRoom!
    if (hasLoadedCurrentQ && activeRoom !== code) await saveWorkspace();
    clearBoardMemory();

    if (roomChannel && sb) { await sb.removeChannel(roomChannel); roomChannel = null; }

    if (hostFlag) localStorage.setItem('sat_wb_host_' + code, clientId);
    isHost = hostFlag || (localStorage.getItem('sat_wb_host_' + code) === clientId);
    roomCode = code;
    rememberRoom(code);

    const hasSb = sb || await initSupabase(true);
    if (!hasSb) {
      document.getElementById('roomLiveControls').style.display = 'none';
      document.getElementById('leaveRoomBtn').style.display = 'inline-flex';
      setRoomStatus(`⚠️ Local only (${code}) — add Supabase URL & Key in Settings to sync devices`, '#fef3c7', '#92400e');
      await switchQuestion(currentIndex, false, true);
      toast(`Room ${code} (local only — no Supabase key)`);
      return;
    }

    document.getElementById('roomLiveControls').style.display = 'flex';
    document.getElementById('leaveRoomBtn').style.display = 'inline-flex';
    setRoomStatus(`⏳ Connecting to live room ${code}...`, '#f8f9fa', '#111');

    const { data: existing, error: fetchErr } = await sb.from('rooms').select('*').eq('room_code', code).maybeSingle();
    if (fetchErr) {
      console.warn('Room fetch:', fetchErr.message);
      setRoomStatus(`⚠️ DB warning: ${fetchErr.message} (live broadcast still connecting)`, '#fef3c7', '#92400e');
    }

    if (existing) {
      if (existing.host_id === clientId) {
        isHost = true;
        localStorage.setItem('sat_wb_host_' + code, clientId);
      }
      await applyRoomSnapshot(existing);
    } else {
      isHost = true;
      localStorage.setItem('sat_wb_host_' + code, clientId);
      await switchQuestion(currentIndex, false, true);
      const { error: upErr } = await sb.from('rooms').upsert({
        room_code: code, host_id: clientId, tutor_locked: tutorLocked,
        current_question_id: currentQ().id, diagram_scale: diagramScale,
        board_objects: objects, board_widgets: boardWidgets,
        desmos_state: desmosCalc ? desmosCalc.getState() : savedDesmosState,
        updated_at: new Date().toISOString()
      }, { onConflict: 'room_code' });
      if (upErr) console.warn('Room create:', upErr.message);
    }
    document.getElementById('tutorLockToggle').disabled = !isHost;

    const myName = document.getElementById('roomNameInput').value || 'Friend';
    roomChannel = sb.channel(`room:${code}`, { config: { presence: { key: peerId } } });

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const st = roomChannel.presenceState();
        const names = Object.values(st).flat().map(u => u.name || 'Friend');
        document.getElementById('roomPeersList').textContent = `Online (${names.length}): ${names.join(', ')}`;
        document.getElementById('roomBadgeText').textContent = `${code} (${names.length})`;
        setRoomStatus(`🟢 Live in ${code} · ${names.length} online (${names.join(', ')})`, '#dcfce7', '#166534');
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === peerId) return;
        if (isHost || objects.length || boardWidgets.length) {
          roomChannel.send({
            type: 'broadcast', event: 'board_sync',
            payload: boardPayload()
          });
        }
      })
      .on('broadcast', { event: 'request_sync' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        if (isHost || objects.length || boardWidgets.length) {
          roomChannel.send({
            type: 'broadcast', event: 'board_sync',
            payload: boardPayload()
          });
        }
      })
      .on('broadcast', { event: 'obj_upsert' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        if (payload.questionId !== currentQ().id) return;
        mergeRemoteObject(payload.obj);
        renderBoard();
        saveWorkspace();
      })
      .on('broadcast', { event: 'board_sync' }, async ({ payload }) => {
        if (payload.sender === peerId) return;
        if (payload.questionId && payload.questionId !== currentQ().id) {
          const idx = QUESTIONS.findIndex(q => q.id === payload.questionId);
          if (idx !== -1) await switchQuestion(idx, true);
        }
        objects = payload.objects || [];
        diagramScale = payload.diagramScale || 1;
        tutorLocked = !!payload.tutorLocked;
        if (Array.isArray(payload.boardWidgets)) applyRemoteWidgets(payload.boardWidgets, payload.desmosState);
        document.getElementById('tutorLockToggle').checked = tutorLocked;
        applyDiagramScaleUI();
        renderBoard();
        await saveWorkspace();
      })
      .on('broadcast', { event: 'answer_check' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        const sameQ = payload.questionId === currentQ().id;
        toast(`${payload.name} answered ${payload.shown}${sameQ ? '' : ' (other question)'} — ${payload.correct ? 'correct ✓' : 'wrong ✗'}`);
      })
      .on('broadcast', { event: 'desmos_state' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        if (payload.questionId !== currentQ().id) return;
        savedDesmosState = payload.state || null;
        applyDesmosState(savedDesmosState);
        saveWorkspace();
      })
      .on('broadcast', { event: 'cursor' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        peers[payload.sender] = payload;
        if (payload.tool === 'laser') {
          if (!peerLasers[payload.sender]) peerLasers[payload.sender] = { points: [] };
          if (payload.laserActive) {
            peerLasers[payload.sender].points.push({ x: payload.wx, y: payload.wy, t: Date.now() });
          }
          peerLasers[payload.sender].wx = payload.wx;
          peerLasers[payload.sender].wy = payload.wy;
          peerLasers[payload.sender].t = Date.now();
          renderBoard();
        }
        renderPeerCursors();
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await roomChannel.track({ id: peerId, name: myName });
          await roomChannel.send({ type: 'broadcast', event: 'request_sync', payload: { sender: peerId } });
          toast(`Connected live to room ${code}`);
        } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setRoomStatus(`🔴 Realtime connection error (${status})`, '#fee2e2', '#991b1b');
        }
      });
  }

  async function leaveRoom(reloadBoard = true) {
    if (hasLoadedCurrentQ) await saveWorkspace();
    clearBoardMemory();
    if (roomChannel && sb) await sb.removeChannel(roomChannel);
    roomChannel = null; roomCode = null; isHost = false; peers = {};
    Object.keys(peerLasers).forEach(k => delete peerLasers[k]);
    document.getElementById('cursorsLayer').innerHTML = '';
    document.getElementById('roomLiveControls').style.display = 'none';
    document.getElementById('leaveRoomBtn').style.display = 'none';
    setRoomStatus('Local Board (offline)', '#f8f9fa', '#111');
    rememberRoom('LOCAL');
    if (reloadBoard) {
      await switchQuestion(currentIndex, false, true);
      toast('Switched to Local Board');
    }
  }

  async function applyRoomSnapshot(r) {
    if (r.current_question_id) {
      const idx = QUESTIONS.findIndex(q => q.id === r.current_question_id);
      if (idx !== -1) await switchQuestion(idx, true);
    }
    const remoteObjs = r.board_objects || [];
    const remoteWidgets = Array.isArray(r.board_widgets) ? r.board_widgets : [];
    if (remoteObjs.length || remoteWidgets.length || r.desmos_state) {
      objects = remoteObjs;
      diagramScale = Number(r.diagram_scale) || 1;
      applyRemoteWidgets(remoteWidgets, r.desmos_state || null);
      await saveWorkspace();
    } else {
      await loadWorkspace();
    }
    tutorLocked = !!r.tutor_locked;
    document.getElementById('tutorLockToggle').checked = tutorLocked;
    applyDiagramScaleUI();
    renderBoard();
  }

  function broadcastBoard() {
    if (!roomCode) return;
    if (tutorLocked && !isHost) return;
    if (roomChannel) {
      roomChannel.send({
        type: 'broadcast', event: 'board_sync',
        payload: boardPayload()
      });
    }
    if (sb && (!tutorLocked || isHost)) {
      sb.from('rooms').update({
        tutor_locked: tutorLocked,
        current_question_id: currentQ().id,
        diagram_scale: diagramScale,
        board_objects: objects,
        board_widgets: boardWidgets,
        desmos_state: desmosCalc ? desmosCalc.getState() : savedDesmosState,
        updated_at: new Date().toISOString()
      }).eq('room_code', roomCode).then(({ error }) => {
        if (error) console.warn('Room DB update:', error.message);
      });
    }
  }

  function renderPeerCursors() {
    const layer = document.getElementById('cursorsLayer');
    layer.innerHTML = '';
    const now = Date.now();
    Object.values(peers).forEach(p => {
      if (now - p.t > 5000) return;
      const sx = p.wx * cam.z + cam.x;
      const sy = p.wy * cam.z + cam.y;
      const d = document.createElement('div');
      d.className = 'peer-cursor';
      d.style.left = sx + 'px'; d.style.top = sy + 'px';
      const icon = p.tool === 'laser' ? '🔴' : '➤';
      d.innerHTML = `<span style="font-size:13px;">${icon}</span><span class="peer-tag">${p.name}</span>`;
      layer.appendChild(d);
    });
  }

  /* ==================== QUESTION LOADING & SWITCHING ==================== */
  function currentQ() { return QUESTIONS[currentIndex] || { id: 'empty', topic: 'Empty', num: '', difficulty: '', prompt: 'No questions loaded.', diagramHtml: '', type: 'mcq', choices: {}, answer: '', formulas: [] }; }

  async function switchQuestion(idx, fromRemote = false, forceReload = false) {
    commitText();
    if (hasLoadedCurrentQ && QUESTIONS.length && currentQ().id !== 'empty') {
      await saveWorkspace();
    }
    hasLoadedCurrentQ = false;
    currentIndex = QUESTIONS.length ? (idx + QUESTIONS.length) % QUESTIONS.length : 0;
    const q = currentQ();
    picked = null;
    customDiagramImg = null;
    soloRevealed = false;

    document.getElementById('qMetaLabel').textContent = `${q.topic} · ${q.num} (${q.difficulty})`;
    missedThisVisit = false;
    updateNavText();
    document.getElementById('qPrompt').innerHTML = q.prompt;

    const diagWrap = document.getElementById('qDiagramWrap');
    const diagBox = document.getElementById('diagramBox');
    if (q.diagramHtml) {
      diagWrap.style.display = 'flex';
      diagBox.innerHTML = q.diagramHtml;
    } else {
      diagWrap.style.display = 'none';
      diagBox.innerHTML = '';
    }

    const choicesEl = document.getElementById('qChoices');
    const gridEl = document.getElementById('qGridIn');
    if (q.type === 'mcq') {
      choicesEl.style.display = 'grid';
      gridEl.style.display = 'none';
      choicesEl.innerHTML = Object.entries(q.choices).map(([k, v]) => `
        <div class="choice-chip" data-choice="${k}">
          <span class="choice-letter-hit" data-pick="${k}">${k}</span>
          <span>${v}</span>
        </div>
      `).join('');
      choicesEl.querySelectorAll('.choice-letter-hit').forEach(btn => {
        btn.onclick = (e) => {
          e.stopPropagation();
          choicesEl.querySelectorAll('.choice-chip').forEach(c => c.classList.remove('selected', 'correct', 'wrong'));
          choicesEl.querySelector(`.choice-chip[data-choice="${btn.dataset.pick}"]`).classList.add('selected');
          picked = btn.dataset.pick;
        };
      });
    } else {
      choicesEl.style.display = 'none';
      gridEl.style.display = 'flex';
      document.getElementById('gridInField').value = '';
    }

    updateStarUI();
    renderMath(document.getElementById('questionCard'));
    renderFormulas();
    renderQuestionBrowser();

    document.querySelectorAll('.board-widget').forEach(w => w.remove());
    if (desmosCalc) desmosCalc = null;
    objects = []; boardWidgets = []; desmosPhotos = []; savedDesmosState = null; diagramScale = 1;
    selectedId = null;

    if (!fromRemote || forceReload) await loadWorkspace();
    hasLoadedCurrentQ = true;
    applyDiagramScaleUI();
    renderPhotos();
    renderBoard();
    if (!fromRemote && !forceReload) broadcastBoard();
  }

  function updateStarUI() {
    const st = progress[currentQ().id] || {};
    document.getElementById('starQuestionBtn').textContent = st.starred ? '★' : '☆';
  }
  document.getElementById('starQuestionBtn').onclick = () => {
    const id = currentQ().id;
    progress[id] = { ...(progress[id] || {}), starred: !(progress[id] && progress[id].starred) };
    localStorage.setItem('sat_wb_progress', JSON.stringify(progress));
    updateStarUI(); renderQuestionBrowser(); updateNavText(); syncProfileToSupabase();
  };

  // Wrong list: a wrong answer puts the question on it. It comes off only when the question
  // is answered correctly on the FIRST try of a later visit (so A-B-C-D guessing doesn't clear it).
  let missedThisVisit = false;
  function recordAnswer(q, correct, shown) {
    const st = { ...(progress[q.id] || {}) };
    if (correct) {
      st.solved = true;
      if (!missedThisVisit && st.wrong) { st.wrong = false; toast('Correct — removed from Wrong list'); }
      else toast('Correct');
    } else {
      if (!missedThisVisit) st.wrongCount = (st.wrongCount || 0) + 1;
      st.wrong = true; missedThisVisit = true;
      toast('Wrong — added to Wrong list');
    }
    progress[q.id] = st;
    localStorage.setItem('sat_wb_progress', JSON.stringify(progress));
    renderQuestionBrowser(); updateNavText(); syncProfileToSupabase();
    if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'answer_check', payload: {
      sender: peerId, name: document.getElementById('roomNameInput').value || 'Friend', questionId: q.id, shown, correct } });
  }
  document.getElementById('checkStatusChip').onclick = () => {
    const q = currentQ();
    if (q.type === 'mcq') {
      if (!picked) { toast('Tap letter A/B/C/D first'); return; }
      document.querySelectorAll('.choice-chip').forEach(b => b.classList.remove('correct', 'wrong'));
      const chip = document.querySelector(`.choice-chip[data-choice="${picked}"]`);
      const ok = picked === q.answer;
      chip.classList.add(ok ? 'correct' : 'wrong');
      recordAnswer(q, ok, picked);
    } else {
      const val = document.getElementById('gridInField').value.trim();
      if (!val) return;
      const evalNum = (s) => s.includes('/') ? (Number(s.split('/')[0]) / Number(s.split('/')[1])) : Number(s);
      const ok = Math.abs(evalNum(val) - evalNum(String(q.answer))) < 0.001;
      recordAnswer(q, ok, val);
    }
  };

  document.getElementById('prevQBtn').onclick = () => stepCollection(-1);
  document.getElementById('nextQBtn').onclick = () => stepCollection(1);

  /* ==================== CAMERA, PAN & SMART CLICK-THROUGH ==================== */
  const boardStage = document.getElementById('boardStage');
  const worldLayer = document.getElementById('worldLayer');
  const boardCanvas = document.getElementById('boardCanvas');
  const ctx = boardCanvas.getContext('2d');

  function applyCamera() {
    worldLayer.style.transform = `translate(${cam.x}px, ${cam.y}px) scale(${cam.z})`;
    document.getElementById('boardZoomReset').textContent = Math.round(cam.z * 100) + '%';
    boardStage.style.backgroundPosition = `${cam.x}px ${cam.y}px`;
    renderBoard();
    renderPeerCursors();
    if (window.__satTextLayout) window.__satTextLayout();
    const cw = document.getElementById('cardsBoardWidget'); if (cw && cw._localZoom) cw._localZoom();
  }
  function screenToWorld(sx, sy) { return { x: (sx - cam.x) / cam.z, y: (sy - cam.y) / cam.z }; }
  function zoomAt(sx, sy, factor) {
    const nz = Math.min(3, Math.max(0.35, cam.z * factor));
    const wx = (sx - cam.x) / cam.z, wy = (sy - cam.y) / cam.z;
    cam.z = nz; cam.x = sx - wx * nz; cam.y = sy - wy * nz;
    applyCamera();
  }

  const PASSTHROUGH_SEL = '.bw-head, .bw-resize, .desmos-embed, .q-diagram-bar, .choice-letter-hit, #checkStatusChip, #starQuestionBtn, .gridin-row, .k-interactive, .board-widget button, .board-widget input, .cw-top, .cw-view';
  function updateSmartPassThrough(clientX, clientY) {
    if (touchUI || pState || rightPan || spaceHeld) return;
    if (tool === 'cursor') { boardCanvas.classList.add('pass-through'); return; }
    if (!settings.smartPass) { boardCanvas.classList.remove('pass-through'); return; }
    const els = document.elementsFromPoint(clientX, clientY);
    const sel = tool === 'laser' ? '.bw-head, .bw-resize' : PASSTHROUGH_SEL;
    const overInteractive = els.some(el => el.matches && el.matches(sel));
    boardCanvas.classList.toggle('pass-through', overInteractive);
  }

  boardStage.addEventListener('pointermove', (e) => {
    updateSmartPassThrough(e.clientX, e.clientY);
    if (roomChannel && Date.now() - lastCursorSend > 28) {
      lastCursorSend = Date.now();
      const w = screenToWorld(e.clientX, e.clientY);
      roomChannel.send({
        type: 'broadcast', event: 'cursor',
        payload: {
          sender: clientId,
          name: document.getElementById('roomNameInput').value || 'Friend',
          wx: w.x, wy: w.y,
          tool, laserActive,
          t: Date.now()
        }
      });
    }
  }, true);

  boardStage.addEventListener('contextmenu', (e) => e.preventDefault());
  let rightPan = null;
  boardStage.addEventListener('pointerdown', (e) => {
    if (e.button === Number(settings.panButton)) {
      e.preventDefault(); e.stopPropagation();
      rightPan = { sx: e.clientX - cam.x, sy: e.clientY - cam.y };
      boardStage.style.cursor = 'grabbing';
    }
  }, true);
  // Laser works on top of Desmos / formula windows too: grab the pointer before the window sees it.
  let laserPtr = null;
  boardStage.addEventListener('pointerdown', (e) => {
    if (tool !== 'laser' || e.button === Number(settings.panButton) || e.button === 1) return;
    const t = e.target;
    if (!t.closest || !t.closest('.board-widget') || t.closest('.bw-head, .bw-resize')) return;
    if (touchUI && e.pointerType === 'touch' && !touchesDraw()) return;
    e.preventDefault(); e.stopPropagation();
    laserPtr = e.pointerId;
    try { boardStage.setPointerCapture(e.pointerId); } catch {}
    onBoardDown(e);
  }, true);
  boardStage.addEventListener('pointermove', (e) => { if (laserPtr === e.pointerId && !touchUI) onBoardMove(e); }, true);
  const endLaserPtr = (e) => { if (laserPtr !== e.pointerId) return; laserPtr = null; if (!touchUI) onBoardUp(e); };
  boardStage.addEventListener('pointerup', endLaserPtr, true);
  boardStage.addEventListener('pointercancel', endLaserPtr, true);
  window.addEventListener('pointermove', (e) => {
    if (!rightPan) return;
    cam.x = e.clientX - rightPan.sx; cam.y = e.clientY - rightPan.sy; applyCamera();
  });
  window.addEventListener('pointerup', () => {
    if (rightPan) { rightPan = null; boardStage.style.cursor = ''; setTool(tool, shapeType); }
  });

  boardStage.addEventListener('wheel', (e) => {
    if (e.target.closest('.side-drawer') || e.target.closest('.peek-window') || e.target.closest('.desmos-embed') || e.target.closest('.modal') || e.target.closest('.board-widget .bw-body')) return;
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    if (settings.wheelMode === 'alwaysZoom' || e.ctrlKey || e.metaKey) {
      const clamped = Math.max(-45, Math.min(45, dy));
      const speed = (Number(settings.zoomSpeed) || 22) / 10000;
      zoomAt(e.clientX, e.clientY, Math.exp(-clamped * speed));
    } else {
      cam.x -= e.deltaX; cam.y -= e.deltaY; applyCamera();
    }
  }, { passive: false });

  document.getElementById('boardZoomOut').onclick = () => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 0.86);
  document.getElementById('boardZoomIn').onclick = () => zoomAt(window.innerWidth / 2, window.innerHeight / 2, 1.16);
  document.getElementById('boardZoomReset').onclick = () => { cam = homeCam(); applyCamera(); };

  /* ==================== DIAGRAM SCALE + LINKED INK ==================== */
  function getDiagramWorldRect() {
    const r = document.getElementById('diagramBox').getBoundingClientRect();
    return { x: (r.left - cam.x) / cam.z, y: (r.top - cam.y) / cam.z, w: r.width / cam.z, h: r.height / cam.z, cx: (r.left + r.width / 2 - cam.x) / cam.z, cy: (r.top - cam.y) / cam.z };
  }
  function applyDiagramScaleUI() {
    const box = document.getElementById('diagramBox');
    box.style.transform = `scale(${diagramScale})`;
    const baseH = box.scrollHeight || 220;
    box.style.marginBottom = `${Math.max(0, (diagramScale - 1) * baseH)}px`;
    document.getElementById('diagScaleText').textContent = Math.round(diagramScale * 100) + '%';
  }
  function setDiagramScale(next) {
    const prev = diagramScale;
    diagramScale = Math.min(2.3, Math.max(0.7, Math.round(next * 100) / 100));
    const ratio = diagramScale / prev;
    const rect = getDiagramWorldRect();
    for (const o of objects) {
      if (!o.onDiagram) continue;
      if (o.type === 'stroke') o.points = o.points.map(p => ({ x: rect.cx + (p.x - rect.cx) * ratio, y: rect.cy + (p.y - rect.cy) * ratio }));
      else {
        o.x = rect.cx + (o.x - rect.cx) * ratio; o.y = rect.cy + (o.y - rect.cy) * ratio;
        if (o.w !== undefined) o.w *= ratio; if (o.h !== undefined) o.h *= ratio;
      }
    }
    applyDiagramScaleUI(); renderBoard(); saveWorkspace(); broadcastBoard();
  }
  document.getElementById('diagMinusBtn').onclick = () => setDiagramScale(diagramScale - 0.15);
  document.getElementById('diagPlusBtn').onclick = () => setDiagramScale(diagramScale + 0.15);
  document.getElementById('diagResetBtn').onclick = () => setDiagramScale(1);

  /* ==================== DRAWING ENGINE ==================== */
  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    boardCanvas.width = Math.floor(window.innerWidth * dpr);
    boardCanvas.height = Math.floor(window.innerHeight * dpr);
    applyCamera();
  }
  window.addEventListener('resize', resizeCanvas);

  function pushUndo() {
    const id = currentQ().id;
    if (!undoByQ[id]) undoByQ[id] = [];
    undoByQ[id].push(JSON.stringify(objects));
    if (undoByQ[id].length > 60) undoByQ[id].shift();
    redoByQ[id] = [];
  }
  function undo() {
    const id = currentQ().id;
    const u = undoByQ[id];
    if (!u || !u.length) return;
    if (!redoByQ[id]) redoByQ[id] = [];
    redoByQ[id].push(JSON.stringify(objects));
    objects = JSON.parse(u.pop());
    selectedId = null; renderBoard(); saveWorkspace(); broadcastBoard();
  }
  function redo() {
    const id = currentQ().id;
    const r = redoByQ[id];
    if (!r || !r.length) return;
    if (!undoByQ[id]) undoByQ[id] = [];
    undoByQ[id].push(JSON.stringify(objects));
    objects = JSON.parse(r.pop());
    selectedId = null; renderBoard(); saveWorkspace(); broadcastBoard();
  }
  document.getElementById('undoBtn').onclick = undo;
  document.getElementById('redoBtn').onclick = redo;

  function setTool(nextTool, nextShape = null) {
    if (nextTool !== 'text') commitText();
    tool = nextTool; shapeType = nextShape;
    document.querySelectorAll('.toolbar-top .tbtn[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === nextTool));
    document.getElementById('shapesBtn').classList.toggle('active', nextTool === 'shape');
    boardCanvas.classList.toggle('pass-through', nextTool === 'cursor' && !spaceHeld);
    boardCanvas.style.cursor = spaceHeld ? 'grab' : nextTool === 'select' ? 'default' : nextTool === 'text' ? 'text' : nextTool === 'eraser' ? 'cell' : 'crosshair';
    if (nextTool !== 'select') { selectedId = null; renderBoard(); }
  }
  document.querySelectorAll('.toolbar-top .tbtn[data-tool]').forEach(b => { b.onclick = () => setTool(b.dataset.tool); });

  function renderColorPalette() {
    const mount = document.getElementById('colorPaletteMount');
    mount.innerHTML = settings.colors.map(c => `<span class="cdot ${inkColor === c ? 'active' : ''}" data-color="${c}" style="background:${c};"></span>`).join('');
    mount.querySelectorAll('.cdot').forEach(dot => {
      dot.onclick = () => { inkColor = dot.dataset.color; renderColorPalette(); };
    });
  }
  document.querySelectorAll('#inkStyleBar .tbtn[data-width]').forEach(b => {
    b.onclick = () => {
      document.querySelectorAll('#inkStyleBar .tbtn[data-width]').forEach(x => x.classList.remove('active'));
      b.classList.add('active'); inkWidth = parseFloat(b.dataset.width);
    };
  });
  document.getElementById('snapBtn').onclick = () => { snapOn = !snapOn; document.getElementById('snapBtn').classList.toggle('active', snapOn); };

  const grids = ['grid-dot', 'grid-square', 'grid-none'];
  function applyGrid(g) { grids.forEach(x => boardStage.classList.remove(x)); if (g !== 'grid-none') boardStage.classList.add(g); }
  document.getElementById('gridBtn').onclick = () => {
    const cur = grids.findIndex(g => boardStage.classList.contains(g));
    const nxt = grids[(cur + 1) % grids.length];
    applyGrid(nxt); settings.defaultGrid = nxt; saveSettings();
  };

  const shapesBtn = document.getElementById('shapesBtn');
  const shapesMenu = document.getElementById('shapesMenu');
  shapesBtn.onclick = (e) => { e.stopPropagation(); shapesMenu.classList.toggle('show'); };
  window.addEventListener('click', () => shapesMenu.classList.remove('show'));
  shapesMenu.querySelectorAll('button[data-shape]').forEach(b => { b.onclick = () => { setTool('shape', b.dataset.shape); shapesMenu.classList.remove('show'); }; });
  shapesMenu.querySelectorAll('button[data-stamp]').forEach(b => {
    b.onclick = () => {
      shapesMenu.classList.remove('show'); pushUndo();
      const id = 'o_' + Date.now();
      const c = screenToWorld(window.innerWidth * 0.65, window.innerHeight * 0.5);
      objects.push({ id, type: 'stamp', kind: b.dataset.stamp, x: c.x - 85, y: c.y - 70, w: 170, h: 140, color: inkColor });
      selectedId = id; setTool('select'); renderBoard(); saveWorkspace(); broadcastBoard();
    };
  });

  function getBounds(o) {
    if (o.type === 'stroke') {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of o.points) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); }
      return { x: minX - 5, y: minY - 5, w: Math.max(14, maxX - minX + 10), h: Math.max(14, maxY - minY + 10) };
    }
    if (o.type === 'text') {
      const fs = o.fontSize || 19, lines = (o.text || '').split('\n');
      const mc = getBounds._mc || (getBounds._mc = document.createElement('canvas').getContext('2d'));
      mc.font = `600 ${fs}px Inter, sans-serif`;
      const w = Math.max(...lines.map(l => mc.measureText(l).width), fs * 0.6);
      return { x: o.x, y: o.y, w: w + 8, h: lines.length * fs * 1.32 + 6 };
    }
    return { x: Math.min(o.x, o.x + o.w), y: Math.min(o.y, o.y + o.h), w: Math.abs(o.w), h: Math.abs(o.h) };
  }

  function hitTest(pt) {
    const tol = 11 / cam.z;
    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i];
      if (o.type === 'stroke') { if (o.points.some(p => Math.hypot(p.x - pt.x, p.y - pt.y) < tol)) return o; }
      else { const b = getBounds(o); if (pt.x >= b.x - tol && pt.x <= b.x + b.w + tol && pt.y >= b.y - tol && pt.y <= b.y + b.h + tol) return o; }
    }
    return null;
  }

  function isInsideDiagram(pt) {
    if (!currentQ().diagramHtml && !customDiagramImg) return false;
    const r = getDiagramWorldRect();
    return pt.x >= r.x && pt.x <= r.x + r.w && pt.y >= r.y && pt.y <= r.y + r.h;
  }

  function trySnap(stroke) {
    const pts = stroke.points; if (pts.length < 6) return null;
    const f = pts[0], l = pts[pts.length - 1];
    let len = 0, minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      minX = Math.min(minX, pts[i].x); minY = Math.min(minY, pts[i].y); maxX = Math.max(maxX, pts[i].x); maxY = Math.max(maxY, pts[i].y);
    }
    const direct = Math.hypot(l.x - f.x, l.y - f.y);
    if (direct > 25 && len / direct < 1.12) return { id: stroke.id, type: 'line', onDiagram: stroke.onDiagram, x: f.x, y: f.y, w: l.x - f.x, h: l.y - f.y, color: stroke.color, width: stroke.width, dashed: false };
    const bw = maxX - minX, bh = maxY - minY;
    if (bw > 24 && bh > 24 && direct < Math.max(bw, bh) * 0.38) {
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, r = (bw + bh) / 4;
      let err = 0; for (const p of pts) err += Math.abs(Math.hypot(p.x - cx, p.y - cy) - r);
      if (err / pts.length < r * 0.2 && Math.abs(bw - bh) < Math.max(bw, bh) * 0.32) return { id: stroke.id, type: 'circle', onDiagram: stroke.onDiagram, x: cx - r, y: cy - r, w: r * 2, h: r * 2, color: stroke.color, width: stroke.width };
      return { id: stroke.id, type: 'isoTriangle', onDiagram: stroke.onDiagram, x: minX, y: minY, w: bw, h: bh, color: stroke.color, width: stroke.width };
    }
    return null;
  }

  function renderBoard(targetCtx = ctx, skipCam = false) {
    if (!skipCam) {
      const dpr = window.devicePixelRatio || 1;
      targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      targetCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      targetCtx.save();
      targetCtx.translate(cam.x, cam.y);
      targetCtx.scale(cam.z, cam.z);
    }

    for (const o of objects) {
      if (o === window.__satEditingText) continue; // being edited in the text box
      targetCtx.save();
      if (o.type === 'stroke') {
        if (o.points.length >= 2) {
          targetCtx.strokeStyle = o.color; targetCtx.lineWidth = o.width; targetCtx.lineCap = 'round'; targetCtx.lineJoin = 'round'; targetCtx.globalAlpha = o.alpha || 1;
          targetCtx.beginPath(); targetCtx.moveTo(o.points[0].x, o.points[0].y);
          for (let i = 1; i < o.points.length - 1; i++) targetCtx.quadraticCurveTo(o.points[i].x, o.points[i].y, (o.points[i].x + o.points[i + 1].x) / 2, (o.points[i].y + o.points[i + 1].y) / 2);
          targetCtx.lineTo(o.points[o.points.length - 1].x, o.points[o.points.length - 1].y); targetCtx.stroke();
        }
      } else if (o.type === 'line') {
        targetCtx.strokeStyle = o.color; targetCtx.lineWidth = o.width || 2.5; targetCtx.lineCap = 'round';
        if (o.dashed) targetCtx.setLineDash([7, 5]);
        targetCtx.beginPath(); targetCtx.moveTo(o.x, o.y); targetCtx.lineTo(o.x + o.w, o.y + o.h); targetCtx.stroke();
      } else if (o.type === 'circle') {
        const b = getBounds(o);
        targetCtx.strokeStyle = o.color; targetCtx.lineWidth = o.width || 2.5;
        targetCtx.beginPath(); targetCtx.ellipse(b.x + b.w / 2, b.y + b.h / 2, b.w / 2, b.h / 2, 0, 0, Math.PI * 2); targetCtx.stroke();
        targetCtx.fillStyle = o.color; targetCtx.beginPath(); targetCtx.arc(b.x + b.w / 2, b.y + b.h / 2, 3, 0, Math.PI * 2); targetCtx.fill();
      } else if (o.type === 'rightTriangle') {
        const b = getBounds(o);
        targetCtx.strokeStyle = o.color; targetCtx.lineWidth = o.width || 2.5; targetCtx.lineJoin = 'round';
        targetCtx.beginPath(); targetCtx.moveTo(b.x, b.y); targetCtx.lineTo(b.x, b.y + b.h); targetCtx.lineTo(b.x + b.w, b.y + b.h); targetCtx.closePath(); targetCtx.stroke();
        const sq = Math.min(16, b.w * 0.22, b.h * 0.22); targetCtx.strokeRect(b.x, b.y + b.h - sq, sq, sq);
      } else if (o.type === 'isoTriangle') {
        const b = getBounds(o);
        targetCtx.strokeStyle = o.color; targetCtx.lineWidth = o.width || 2.5; targetCtx.lineJoin = 'round';
        targetCtx.beginPath(); targetCtx.moveTo(b.x + b.w / 2, b.y); targetCtx.lineTo(b.x, b.y + b.h); targetCtx.lineTo(b.x + b.w, b.y + b.h); targetCtx.closePath(); targetCtx.stroke();
      } else if (o.type === 'stamp') {
        drawStamp(o, targetCtx);
      } else if (o.type === 'text') {
        targetCtx.fillStyle = o.color || '#111111';
        targetCtx.font = `600 ${o.fontSize || 19}px Inter, sans-serif`; targetCtx.textBaseline = 'top';
        (o.text || '').split('\n').forEach((ln, i) => targetCtx.fillText(ln, o.x + 3, o.y + 3 + i * (o.fontSize || 19) * 1.32));
      } else if (o.type === 'image') {
        let im = imgCache.get(o.src);
        if (!im) { im = new Image(); im.onload = () => renderBoard(); im.src = o.src; imgCache.set(o.src, im); }
        if (im.complete) { targetCtx.drawImage(im, o.x, o.y, o.w, o.h); targetCtx.strokeStyle = '#111'; targetCtx.lineWidth = 1; targetCtx.strokeRect(o.x, o.y, o.w, o.h); }
      }
      targetCtx.restore();
    }

    if (!skipCam && selectedId) {
      const sel = objects.find(o => o.id === selectedId);
      if (sel) {
        const b = getBounds(sel);
        targetCtx.save(); targetCtx.strokeStyle = '#111'; targetCtx.lineWidth = 1.2 / cam.z; targetCtx.setLineDash([4 / cam.z, 3 / cam.z]);
        targetCtx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8); targetCtx.setLineDash([]);
        if (sel.type !== 'stroke') { targetCtx.fillStyle = '#111'; const hs = 9 / cam.z; targetCtx.fillRect(b.x + b.w + 4 - hs / 2, b.y + b.h + 4 - hs / 2, hs, hs); }
        targetCtx.restore();
      }
    }

    if (!skipCam) {
      const nowTs = Date.now();
      const fadeMs = Number(settings.laserFade) || 1300;
      let anyLaser = false;

      if (laserTrail.length > 1) {
        laserTrail = laserTrail.filter(p => nowTs - p.t < fadeMs);
        if (laserTrail.length > 1) anyLaser = true;
        for (let i = 1; i < laserTrail.length; i++) {
          const age = (nowTs - laserTrail[i].t) / fadeMs;
          targetCtx.save();
          targetCtx.strokeStyle = `rgba(220, 38, 38, ${Math.max(0, 1 - age)})`;
          targetCtx.lineWidth = (4.5 / cam.z) * (1 - age * 0.5);
          targetCtx.lineCap = 'round';
          targetCtx.beginPath(); targetCtx.moveTo(laserTrail[i - 1].x, laserTrail[i - 1].y); targetCtx.lineTo(laserTrail[i].x, laserTrail[i].y); targetCtx.stroke();
          targetCtx.restore();
        }
      }

      Object.values(peerLasers).forEach(pl => {
        pl.points = pl.points.filter(p => nowTs - p.t < fadeMs);
        if (pl.points.length > 1) {
          anyLaser = true;
          for (let i = 1; i < pl.points.length; i++) {
            const age = (nowTs - pl.points[i].t) / fadeMs;
            targetCtx.save();
            targetCtx.strokeStyle = `rgba(220, 38, 38, ${Math.max(0, 1 - age)})`;
            targetCtx.lineWidth = (4.5 / cam.z) * (1 - age * 0.5);
            targetCtx.lineCap = 'round';
            targetCtx.beginPath(); targetCtx.moveTo(pl.points[i - 1].x, pl.points[i - 1].y); targetCtx.lineTo(pl.points[i].x, pl.points[i].y); targetCtx.stroke();
            targetCtx.restore();
          }
        }
        if (nowTs - pl.t < 1500) {
          anyLaser = true;
          targetCtx.save();
          targetCtx.fillStyle = '#dc2626';
          targetCtx.beginPath(); targetCtx.arc(pl.wx, pl.wy, 5 / cam.z, 0, Math.PI * 2); targetCtx.fill();
          targetCtx.restore();
        }
      });

      if (anyLaser) requestAnimationFrame(() => renderBoard());
      targetCtx.restore();
    }
  }

  function drawStamp(o, c = ctx) {
    const b = getBounds(o);
    c.strokeStyle = o.color || '#111'; c.fillStyle = o.color || '#111'; c.lineWidth = 2.2; c.lineJoin = 'round'; c.font = 'bold 13px Inter, sans-serif';
    if (o.kind === '306090') {
      c.beginPath(); c.moveTo(b.x + 16, b.y + 8); c.lineTo(b.x + 16, b.y + b.h - 18); c.lineTo(b.x + b.w - 12, b.y + b.h - 18); c.closePath(); c.stroke();
      c.strokeRect(b.x + 16, b.y + b.h - 30, 12, 12);
      c.fillText('x√3', b.x - 10, b.y + b.h / 2); c.fillText('x', b.x + b.w / 2 - 4, b.y + b.h - 4); c.fillText('2x', b.x + b.w / 2 + 12, b.y + b.h / 2 - 12);
    } else if (o.kind === '454590') {
      c.beginPath(); c.moveTo(b.x + 18, b.y + 10); c.lineTo(b.x + 18, b.y + b.h - 18); c.lineTo(b.x + b.w - 18, b.y + b.h - 18); c.closePath(); c.stroke();
      c.strokeRect(b.x + 18, b.y + b.h - 30, 12, 12);
      c.fillText('x', b.x + 4, b.y + b.h / 2); c.fillText('x', b.x + b.w / 2 - 4, b.y + b.h - 4); c.fillText('x√2', b.x + b.w / 2 + 8, b.y + b.h / 2 - 10);
    } else if (o.kind === 'axes') {
      const mx = b.x + b.w / 2, my = b.y + b.h / 2;
      c.beginPath(); c.moveTo(b.x, my); c.lineTo(b.x + b.w, my); c.moveTo(mx, b.y); c.lineTo(mx, b.y + b.h); c.stroke();
      c.fillText('x', b.x + b.w - 10, my - 8); c.fillText('y', mx + 7, b.y + 12);
    }
  }

  /* ==================== POINTER EVENTS ==================== */
  let pState = null;
  // iPad / touch screens: the canvas ignores pointers and the stage listens instead (see TOUCH / IPAD INPUT)
  const touchUI = window.matchMedia('(pointer: coarse)').matches || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  function capturePtr(e) { try { (touchUI ? boardStage : boardCanvas).setPointerCapture(e.pointerId); } catch {} }
  function onBoardDown(e) {
    if (e.button === Number(settings.panButton)) return;
    if (settings.stylusOnly && e.pointerType === 'touch') {
      pState = { mode: 'pan', sx: e.clientX - cam.x, sy: e.clientY - cam.y };
      capturePtr(e);
      return;
    }
    if (tutorLocked && !isHost && roomChannel) { toast('Board locked by Tutor'); return; }

    const pt = screenToWorld(e.clientX, e.clientY);
    if (spaceHeld || e.button === 1) { pState = { mode: 'pan', sx: e.clientX - cam.x, sy: e.clientY - cam.y }; capturePtr(e); return; }

    if (tool === 'text') {
      if (textOpen()) { commitText(); return; }
      const hit = hitTest(pt);
      pState = { mode: 'textTap', sx: e.clientX, sy: e.clientY, hit: hit && hit.type === 'text' ? hit : null };
      return;
    }
    if (tool === 'laser') {
      laserActive = true;
      laserTrail.push({ x: pt.x, y: pt.y, t: Date.now() });
      if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'cursor', payload: { sender: clientId, name: document.getElementById('roomNameInput').value || 'Friend', wx: pt.x, wy: pt.y, tool: 'laser', laserActive: true, t: Date.now() } });
      renderBoard(); return;
    }
    if (tool === 'eraser') {
      const hit = hitTest(pt);
      if (hit) { pushUndo(); objects = objects.filter(o => o.id !== hit.id); renderBoard(); saveWorkspace(); broadcastBoard(); }
      pState = { mode: 'erase' }; return;
    }
    if (tool === 'select') {
      if (selectedId) {
        const sel = objects.find(o => o.id === selectedId);
        if (sel && sel.type !== 'stroke') {
          const b = getBounds(sel);
          if (Math.hypot(pt.x - (b.x + b.w + 4), pt.y - (b.y + b.h + 4)) < 14 / cam.z) {
            pushUndo(); pState = { mode: 'resize', obj: sel, sx: pt.x, sy: pt.y, ow: sel.w || b.w, oh: sel.h || b.h, ofs: sel.fontSize };
            capturePtr(e); return;
          }
        }
      }
      const hit = hitTest(pt); selectedId = hit ? hit.id : null; renderBoard();
      if (hit) {
        pushUndo(); pState = { mode: 'move', obj: hit, sx: pt.x, sy: pt.y, ox: hit.x, oy: hit.y, opts: hit.points ? hit.points.map(p => ({ ...p })) : null };
        capturePtr(e);
      }
      return;
    }
    if (tool === 'shape') {
      pushUndo();
      const obj = { id: 'o_' + Date.now(), type: shapeType === 'dashed' ? 'line' : shapeType, dashed: shapeType === 'dashed', onDiagram: isInsideDiagram(pt), x: pt.x, y: pt.y, w: 1, h: 1, color: inkColor, width: inkWidth };
      objects.push(obj); pState = { mode: 'shape', obj }; capturePtr(e); return;
    }

    pushUndo();
    const s = { id: 'o_' + Date.now() + Math.random(), type: 'stroke', onDiagram: isInsideDiagram(pt), color: inkColor, width: tool === 'highlighter' ? inkWidth * 3.8 : inkWidth, alpha: tool === 'highlighter' ? 0.28 : 1, points: [pt] };
    objects.push(s); pState = { mode: 'stroke', obj: s, t: Date.now() }; capturePtr(e);
    if (snapOn && tool === 'pen') {
      const delay = Number(settings.snapDelay) || 400;
      pState.timer = setTimeout(() => {
        if (pState && pState.mode === 'stroke' && Date.now() - pState.t >= delay - 60) {
          const sn = trySnap(pState.obj);
          if (sn) { const idx = objects.findIndex(o => o.id === pState.obj.id); if (idx !== -1) objects[idx] = sn; pState.snapped = true; renderBoard(); }
        }
      }, delay);
    }
  }

  function onBoardMove(e) {
    const pt = screenToWorld(e.clientX, e.clientY);
    if (tool === 'laser' && laserActive) {
      laserTrail.push({ x: pt.x, y: pt.y, t: Date.now() });
      renderBoard(); return;
    }
    if (!pState) return;
    if (pState.mode === 'textTap') {
      // dragging in text mode moves the board instead
      if (Math.hypot(e.clientX - pState.sx, e.clientY - pState.sy) > 10) pState = { mode: 'pan', sx: pState.sx - cam.x, sy: pState.sy - cam.y, pointerType: pState.pointerType, pointerId: pState.pointerId };
      return;
    }
    if (pState.mode === 'pan') { cam.x = e.clientX - pState.sx; cam.y = e.clientY - pState.sy; applyCamera(); }
    else if (pState.mode === 'erase') { const hit = hitTest(pt); if (hit) { objects = objects.filter(o => o.id !== hit.id); renderBoard(); } }
    else if (pState.mode === 'stroke' && !pState.snapped) {
      pState.obj.points.push(pt); pState.t = Date.now(); clearTimeout(pState.timer);
      if (roomChannel && Date.now() - lastLiveStrokeSend > 65) {
        lastLiveStrokeSend = Date.now();
        broadcastObject(pState.obj);
      }
      if (snapOn && tool === 'pen') {
        const delay = Number(settings.snapDelay) || 400;
        pState.timer = setTimeout(() => {
          if (pState && pState.mode === 'stroke' && Date.now() - pState.t >= delay - 60) {
            const sn = trySnap(pState.obj);
            if (sn) {
              const idx = objects.findIndex(o => o.id === pState.obj.id);
              if (idx !== -1) objects[idx] = sn;
              pState.obj = sn; pState.snapped = true;
              renderBoard(); broadcastObject(sn);
            }
          }
        }, delay);
      }
      renderBoard();
    } else if (pState.mode === 'shape') {
      pState.obj.w = pt.x - pState.obj.x; pState.obj.h = pt.y - pState.obj.y;
      if (roomChannel && Date.now() - lastLiveStrokeSend > 65) {
        lastLiveStrokeSend = Date.now();
        broadcastObject(pState.obj);
      }
      renderBoard();
    } else if (pState.mode === 'move') {
      const dx = pt.x - pState.sx, dy = pt.y - pState.sy;
      if (pState.obj.type === 'stroke') pState.obj.points = pState.opts.map(p => ({ x: p.x + dx, y: p.y + dy }));
      else { pState.obj.x = pState.ox + dx; pState.obj.y = pState.oy + dy; }
      if (roomChannel && Date.now() - lastLiveStrokeSend > 65) {
        lastLiveStrokeSend = Date.now();
        broadcastObject(pState.obj);
      }
      renderBoard();
    } else if (pState.mode === 'resize') {
      const dx = pt.x - pState.sx, dy = pt.y - pState.sy;
      if (pState.obj.type === 'text') pState.obj.fontSize = Math.round(Math.max(6, Math.min(240, (pState.ofs || 19) * Math.max(0.2, (pState.oh + dy) / pState.oh))));
      else { pState.obj.w = Math.max(20, pState.ow + dx); pState.obj.h = Math.max(20, pState.oh + dy); }
      if (roomChannel && Date.now() - lastLiveStrokeSend > 65) {
        lastLiveStrokeSend = Date.now();
        broadcastObject(pState.obj);
      }
      renderBoard();
    }
  }

  function onBoardUp() {
    laserActive = false;
    if (pState && pState.mode === 'textTap') { const p = pState; pState = null; openText(p.sx, p.sy, p.hit); return; }
    if (pState) {
      clearTimeout(pState.timer);
      const finishedObj = pState.obj;
      const wasErase = pState.mode === 'erase';
      pState = null;
      saveWorkspace();
      if (finishedObj && !wasErase) {
        broadcastObject(finishedObj);
        if (sb && roomCode && (!tutorLocked || isHost)) {
          sb.from('rooms').update({
            current_question_id: currentQ().id,
            diagram_scale: diagramScale,
            board_objects: objects,
            board_widgets: boardWidgets,
            desmos_state: desmosCalc ? desmosCalc.getState() : savedDesmosState,
            updated_at: new Date().toISOString()
          }).eq('room_code', roomCode).then(({ error }) => {
            if (error) console.warn('Room DB update:', error.message);
          });
        }
      } else {
        broadcastBoard();
      }
    }
  }
  function onBoardDblClick(e) {
    const pt = screenToWorld(e.clientX, e.clientY);
    const hit = hitTest(pt);
    if (hit && hit.type === 'text' && !textOpen()) openText(e.clientX, e.clientY, hit);
  }

  /* ==================== TOUCH / IPAD INPUT ==================== */
  // Rules: Apple Pencil draws. Before a Pencil is seen, one finger draws (with the current tool).
  // Two fingers always pan + pinch-zoom (and cancel a stroke the first finger just started).
  // After a Pencil is seen (or "Stylus Mode" is on), one finger pans and touches never draw.
  // Touches right after/while the Pencil is down are ignored (palm).
  const touchPts = new Map();
  let pinch = null;
  let penSeen = false;
  let lastPenUp = 0;
  const UI_TARGETS = '.board-widget, .choice-letter-hit, #checkStatusChip, #starQuestionBtn, .q-diagram-bar, .gridin-row, button, input, textarea, select, a';

  function touchesDraw() { return !(settings.stylusOnly || penSeen); }
  function setPanHint() {
    const el = document.getElementById('panHintText');
    if (!el) return;
    if (touchUI) el.textContent = touchesDraw() ? '✌️ move / zoom' : '☝️ move · ✏️ draw';
    else el.textContent = Number(settings.panButton) === 2 ? 'Right-drag: Pan' : 'Mid-drag: Pan';
  }
  function startPinch() {
    const [a, b] = [...touchPts.values()];
    pinch = { d0: Math.hypot(a.x - b.x, a.y - b.y) || 1, mx0: (a.x + b.x) / 2, my0: (a.y + b.y) / 2, z0: cam.z, cx0: cam.x, cy0: cam.y };
  }
  function updatePinch() {
    const [a, b] = [...touchPts.values()];
    const d = Math.hypot(a.x - b.x, a.y - b.y) || 1;
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
    const nz = Math.min(3, Math.max(0.35, pinch.z0 * d / pinch.d0));
    const wx = (pinch.mx0 - pinch.cx0) / pinch.z0, wy = (pinch.my0 - pinch.cy0) / pinch.z0;
    cam.z = nz; cam.x = mx - wx * nz; cam.y = my - wy * nz;
    applyCamera();
  }
  function cancelActiveStroke() {
    if (!pState) return;
    clearTimeout(pState.timer);
    if ((pState.mode === 'stroke' || pState.mode === 'shape') && pState.obj) {
      const dead = pState.obj;
      objects = objects.filter(o => o !== dead && o.id !== dead.id);
      const u = undoByQ[currentQ().id]; if (u && u.length) u.pop();
      if (roomChannel) broadcastBoard(); // peers may have received part of it
    }
    pState = null; laserActive = false; renderBoard();
  }
  function stageDown(e) {
    if (e.pointerType === 'pen' && !penSeen) {
      penSeen = true; setPanHint();
      if (!settings.stylusOnly) toast('Apple Pencil detected — fingers now move the board');
    }
    if (e.pointerType === 'touch') {
      if (Date.now() - lastPenUp < 400 || (pState && pState.pointerType === 'pen')) return; // palm
      touchPts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (touchPts.size === 2) { cancelActiveStroke(); startPinch(); return; }
      if (touchPts.size > 2 || pinch) return;
      if (!touchesDraw() || tool === 'cursor') {
        pState = { mode: 'pan', sx: e.clientX - cam.x, sy: e.clientY - cam.y, pointerType: 'touch', pointerId: e.pointerId };
        return;
      }
    } else if (tool === 'cursor') return;
    if (pState) return; // already busy with another pointer
    onBoardDown(e);
    if (pState) { pState.pointerType = e.pointerType; pState.pointerId = e.pointerId; }
  }
  function stageMove(e) {
    if (e.pointerType === 'touch' && touchPts.has(e.pointerId)) {
      touchPts.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pinch) { if (touchPts.size >= 2) updatePinch(); return; }
    }
    if (pState && pState.pointerId !== undefined && pState.pointerId !== e.pointerId) return;
    if (pState && pState.mode === 'stroke' && !pState.snapped && e.getCoalescedEvents) {
      // Pencil reports many more points than move events — keep them for smooth ink
      const list = e.getCoalescedEvents();
      const pts = pState.obj.points;
      for (let i = 0; i < list.length - 1; i++) {
        const p = screenToWorld(list[i].clientX, list[i].clientY);
        const last = pts[pts.length - 1];
        if (!last || Math.hypot(p.x - last.x, p.y - last.y) > 1.2 / cam.z) pts.push(p);
      }
    }
    onBoardMove(e);
  }
  function stageUp(e) {
    if (e.pointerType === 'pen') lastPenUp = Date.now();
    if (e.pointerType === 'touch' && touchPts.has(e.pointerId)) {
      touchPts.delete(e.pointerId);
      if (pinch) { if (touchPts.size < 2) pinch = null; return; }
    }
    if (pState && pState.pointerId !== undefined && pState.pointerId !== e.pointerId) return;
    onBoardUp(e);
  }

  if (touchUI) {
    document.body.classList.add('touch-ui');
    boardStage.addEventListener('pointerdown', (e) => { if (e.target.closest && e.target.closest(UI_TARGETS)) return; stageDown(e); });
    boardStage.addEventListener('pointermove', stageMove);
    boardStage.addEventListener('pointerup', stageUp);
    boardStage.addEventListener('pointercancel', stageUp);
    boardStage.addEventListener('dblclick', (e) => { if (!(e.target.closest && e.target.closest(UI_TARGETS))) onBoardDblClick(e); });
  } else {
    boardCanvas.addEventListener('pointerdown', onBoardDown);
    boardCanvas.addEventListener('pointermove', onBoardMove);
    boardCanvas.addEventListener('pointerup', onBoardUp);
    boardCanvas.addEventListener('pointercancel', onBoardUp);
    boardCanvas.addEventListener('dblclick', onBoardDblClick);
  }

  // Safari (iPad + Mac trackpads) sends pinch as "gesture" events; use them for board zoom, block page zoom.
  let gestureScale = 1;
  const gestureOverUi = (e) => e.target && e.target.closest && e.target.closest('.desmos-embed, .side-drawer, .modal, .peek-window');
  document.addEventListener('gesturestart', (e) => { e.preventDefault(); gestureScale = 1; }, { passive: false });
  document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
    const f = e.scale / gestureScale; gestureScale = e.scale;
    if (touchPts.size >= 2 || gestureOverUi(e)) return; // finger pinch is handled above
    const x = Number.isFinite(e.clientX) ? e.clientX : window.innerWidth / 2;
    const y = Number.isFinite(e.clientY) ? e.clientY : window.innerHeight / 2;
    zoomAt(x, y, f);
  }, { passive: false });
  document.addEventListener('gestureend', (e) => e.preventDefault(), { passive: false });

  /* ==================== TEXT TOOL ==================== */
  // The box sits exactly where the text will be drawn and at the same on-screen size,
  // so what you type is what lands on the board (at any zoom).
  const textBox = document.getElementById('textEditorBox');
  const symBar = document.getElementById('symBar');
  const measureCtx = document.createElement('canvas').getContext('2d');
  let textTargetWorld = null, editingObj = null, textFont = 19, textColor = '#111111';
  const textOpen = () => textBox.style.display === 'block';
  function textWidth(str, fs) {
    measureCtx.font = `600 ${fs}px Inter, sans-serif`;
    return Math.max(0, ...String(str).split('\n').map(l => measureCtx.measureText(l).width));
  }
  function layoutText() {
    if (!textOpen()) return;
    const z = cam.z, fsS = textFont * z, pad = 2, bw = 1.5;
    const sx = cam.x + textTargetWorld.x * z, sy = cam.y + textTargetWorld.y * z;
    textBox.style.fontSize = fsS + 'px';
    textBox.style.color = textColor;
    const lines = Math.max(1, textBox.value.split('\n').length);
    textBox.style.width = Math.ceil(Math.max(textWidth(textBox.value || 'Type…', fsS) + fsS * 0.7, 30)) + 'px';
    textBox.style.height = Math.ceil(lines * fsS * 1.32) + 'px';
    textBox.style.left = (sx + 3 * z - pad - bw) + 'px';
    textBox.style.top = (sy + 3 * z - 0.16 * fsS - pad - bw) + 'px';
    const vv = window.visualViewport;
    const vTop = vv ? vv.offsetTop : 0, vH = vv ? vv.height : window.innerHeight, vLeft = vv ? vv.offsetLeft : 0;
    const r = textBox.getBoundingClientRect(), bh = symBar.offsetHeight || 44;
    if (isPhone()) { symBar.style.left = (vLeft + 6) + 'px'; symBar.style.top = (vTop + 6) + 'px'; }
    else {
      symBar.style.left = Math.max(6, Math.min(r.left, window.innerWidth - symBar.offsetWidth - 6)) + 'px';
      const above = r.top - bh - 8;
      symBar.style.top = (above > vTop + 6 ? above : Math.min(r.bottom + 8, vTop + vH - bh - 6)) + 'px';
    }
  }
  window.__satTextLayout = layoutText;
  // Keep the text you're typing above the on-screen keyboard (moves the board, not the page).
  function keepTextVisible() {
    if (!textOpen()) return;
    const vv = window.visualViewport;
    const r = textBox.getBoundingClientRect();
    const bottom = (vv ? vv.offsetTop + vv.height : window.innerHeight) - 14;
    const top = (vv ? vv.offsetTop : 0) + (isPhone() ? 62 : 14);
    let dy = 0;
    if (r.bottom > bottom) dy = bottom - r.bottom; else if (r.top < top) dy = top - r.top;
    if (dy) { cam.y += dy; applyCamera(); } else layoutText();
  }
  if (window.visualViewport) {
    window.visualViewport.addEventListener('resize', keepTextVisible);
    window.visualViewport.addEventListener('scroll', layoutText);
  }
  function openText(sx, sy, existing = null) {
    editingObj = existing || null;
    window.__satEditingText = editingObj;
    if (editingObj) {
      textTargetWorld = { x: editingObj.x, y: editingObj.y };
      textFont = editingObj.fontSize || 19; textColor = editingObj.color || '#111111'; textBox.value = editingObj.text || '';
    } else {
      textFont = Math.round(Math.max(8, Math.min(160, (Number(settings.textSize) || 19) / cam.z)));
      const p = screenToWorld(sx, sy);
      textTargetWorld = { x: p.x - 3, y: p.y - textFont * 0.75 }; // the tap lands in the middle of the first line
      textColor = inkColor; textBox.value = '';
    }
    textBox.style.display = 'block'; symBar.classList.add('show');
    layoutText(); renderBoard();
    try { textBox.focus({ preventScroll: true }); } catch { textBox.focus(); }
    const n = textBox.value.length; textBox.setSelectionRange(n, n);
    setTimeout(keepTextVisible, 350);
  }
  function closeText() {
    textBox.style.display = 'none'; symBar.classList.remove('show');
    window.__satEditingText = null; editingObj = null;
    if (document.activeElement === textBox) textBox.blur();
  }
  function commitText() {
    if (!textOpen()) return;
    const val = textBox.value.replace(/\s+$/, '');
    const ed = editingObj;
    closeText();
    if (ed) {
      if (!val.trim()) { pushUndo(); objects = objects.filter(o => o !== ed); }
      else if (val !== ed.text || textFont !== ed.fontSize) { pushUndo(); ed.text = val; ed.fontSize = textFont; }
      else { renderBoard(); return; }
    } else {
      if (!val.trim()) { renderBoard(); return; }
      pushUndo();
      objects.push({ id: 'o_' + Date.now(), type: 'text', x: textTargetWorld.x, y: textTargetWorld.y, text: val, fontSize: textFont, color: textColor });
    }
    renderBoard(); saveWorkspace(); broadcastBoard();
  }
  function cancelText() { closeText(); renderBoard(); }
  textBox.addEventListener('input', layoutText);
  textBox.addEventListener('keydown', (e) => {
    e.stopPropagation(); // no tool shortcuts while typing
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); commitText(); }
    else if (e.key === 'Escape') { e.preventDefault(); commitText(); }
  });
  textBox.addEventListener('keyup', (e) => e.stopPropagation());
  function insertAtCaret(str) {
    const a = textBox.selectionStart ?? textBox.value.length, b = textBox.selectionEnd ?? a;
    textBox.value = textBox.value.slice(0, a) + str + textBox.value.slice(b);
    textBox.setSelectionRange(a + str.length, a + str.length);
    layoutText();
  }
  symBar.querySelectorAll('button').forEach(b => {
    b.addEventListener('pointerdown', (e) => e.preventDefault()); // keep the keyboard / caret in the text box
    b.addEventListener('mousedown', (e) => e.preventDefault());
    b.addEventListener('click', (e) => {
      e.preventDefault(); e.stopPropagation();
      if (b.id === 'doneTextBtn') return commitText();
      if (b.id === 'cancelTextBtn') return cancelText();
      if (b.dataset.size) { textFont = Math.round(Math.max(8, Math.min(240, textFont * (b.dataset.size === '1' ? 1.2 : 1 / 1.2)))); layoutText(); }
      else if (b.dataset.sym) insertAtCaret(b.dataset.sym);
      if (document.activeElement !== textBox) { try { textBox.focus({ preventScroll: true }); } catch { textBox.focus(); } }
    });
  });

  document.getElementById('clearAllBtn').onclick = () => {
    if (!objects.length) return;
    pushUndo(); objects = []; selectedId = null; renderBoard(); saveWorkspace(); broadcastBoard();
  };

  /* ==================== DESMOS COMPOSITE SNAPSHOT (EQUATIONS + GRAPH!) ==================== */
  function formatDesmosLatex(expr) {
    if (expr.type === 'table' && expr.columns) {
      return 'Table: ' + expr.columns.map(c => c.latex + (c.values && c.values.length ? `=[${c.values.slice(0, 3).join(',')}]` : '')).join(' | ');
    }
    let s = (expr.latex || '')
      .replace(/\\left|\\right/g, '')
      .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1)/($2)')
      .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
      .replace(/\\pi/g, 'π')
      .replace(/\\cdot/g, '·')
      .replace(/\\times/g, '×')
      .replace(/\\le/g, '≤')
      .replace(/\\ge/g, '≥')
      .replace(/\\sim/g, '~')
      .replace(/\\theta/g, 'θ')
      .replace(/\^2/g, '²')
      .replace(/\^3/g, '³')
      .replace(/\\text\{([^}]+)\}/g, '$1')
      .replace(/[{}]/g, '');
    if (desmosCalc && desmosCalc.expressionAnalysis && desmosCalc.expressionAnalysis[expr.id]) {
      const ev = desmosCalc.expressionAnalysis[expr.id].evaluation;
      if (ev && typeof ev.value === 'number' && !s.includes('=')) {
        const rounded = Math.round(ev.value * 10000) / 10000;
        s += `  = ${rounded}`;
      }
    }
    return s;
  }

  // Draws [expression list | graph] into a canvas. Resolves null if Desmos isn't live.
  function buildDesmosComposite(totalW = 700, H = 360, pixelRatio = 1) {
    return new Promise((resolve) => {
      if (!desmosCalc) return resolve(null);
      const exprs = desmosCalc.getExpressions().filter(e => (e.latex && e.latex.trim()) || e.type === 'table');
      const exprW = totalW >= 560 ? 240 : Math.round(totalW * 0.4);
      const graphW = Math.max(120, Math.round(totalW - exprW));
      const maxChars = Math.max(10, Math.floor((exprW - 32) / 7));
      desmosCalc.asyncScreenshot({ width: graphW, height: H, showLabels: true, targetPixelRatio: pixelRatio }, (graphUrl) => {
        const gImg = new Image();
        gImg.onload = () => {
          const c = document.createElement('canvas');
          c.width = Math.round((exprW + graphW) * pixelRatio); c.height = Math.round(H * pixelRatio);
          const g = c.getContext('2d');
          g.scale(pixelRatio, pixelRatio);
          g.fillStyle = '#ffffff'; g.fillRect(0, 0, exprW + graphW, H);
          g.fillStyle = '#f8f9fa'; g.fillRect(0, 0, exprW, 28);
          g.strokeStyle = '#e5e7eb'; g.lineWidth = 1;
          g.beginPath(); g.moveTo(0, 28); g.lineTo(exprW, 28); g.moveTo(exprW, 0); g.lineTo(exprW, H); g.stroke();
          g.fillStyle = '#111111'; g.font = 'bold 11px Inter, sans-serif';
          g.fillText('DESMOS EXPRESSIONS', 10, 18);
          let y = 46;
          for (let i = 0; i < exprs.length && y < H - 8; i++) {
            const ex = exprs[i];
            g.fillStyle = ex.color || '#111111';
            g.beginPath(); g.arc(14, y - 4, 5, 0, Math.PI * 2); g.fill();
            g.fillStyle = '#111111';
            g.font = '600 12px Inter, sans-serif';
            const txt = `${i + 1}. ${formatDesmosLatex(ex)}`;
            g.fillText(txt.slice(0, maxChars), 26, y);
            if (txt.length > maxChars) { y += 15; g.fillText(txt.slice(maxChars, maxChars * 2), 26, y); }
            g.strokeStyle = '#f1f5f9'; g.beginPath(); g.moveTo(6, y + 8); g.lineTo(exprW - 6, y + 8); g.stroke();
            y += 26;
          }
          g.drawImage(gImg, exprW, 0, graphW, H);
          resolve(c);
        };
        gImg.onerror = () => resolve(null);
        gImg.src = graphUrl;
      });
    });
  }

  async function snapshotDesmosComposite() {
    if (!desmosCalc) { toast('Put Desmos on board first'); return; }
    const c = await buildDesmosComposite(700, 360, 1);
    if (c) pinImageToBoard(c.toDataURL('image/png'));
  }

  /* ==================== ON-BOARD WIDGETS ==================== */
  function makeWidgetInteractive(el, wd, onResize) {
    const head = el.querySelector('.bw-head');
    const res = el.querySelector('.bw-resize');
    let drag = null;
    head.addEventListener('pointerdown', (e) => {
      if (e.button === Number(settings.panButton) || e.target.tagName === 'BUTTON') return;
      e.stopPropagation(); drag = { mode: 'move', sx: e.clientX, sy: e.clientY, ox: wd.x, oy: wd.y }; head.setPointerCapture(e.pointerId);
    });
    res.addEventListener('pointerdown', (e) => {
      if (e.button === Number(settings.panButton)) return;
      e.stopPropagation(); drag = { mode: 'resize', sx: e.clientX, sy: e.clientY, ow: wd.w, oh: wd.h }; res.setPointerCapture(e.pointerId);
    });
    const onMove = (e) => {
      if (!drag) return;
      const dx = (e.clientX - drag.sx) / cam.z, dy = (e.clientY - drag.sy) / cam.z;
      if (drag.mode === 'move') { wd.x = drag.ox + dx; wd.y = drag.oy + dy; el.style.left = wd.x + 'px'; el.style.top = wd.y + 'px'; }
      else { wd.w = Math.max(220, drag.ow + dx); wd.h = Math.max(110, drag.oh + dy); el.style.width = wd.w + 'px'; el.style.height = wd.h + 'px'; if (onResize) onResize(); }
    };
    const onUp = () => { if (drag) { drag = null; saveWorkspace(); broadcastBoard(); } };
    [head, res].forEach(h => { h.addEventListener('pointermove', onMove); h.addEventListener('pointerup', onUp); h.addEventListener('pointercancel', onUp); });
  }

  function spawnFormulaOnBoard(formulaId) {
    const f = cardById(formulaId); if (!f) return; formulaId = f.id;
    const pos = screenToWorld(window.innerWidth * 0.14, window.innerHeight * 0.24);
    const v2 = CK && CK.isV2(f);
    const wd = { id: 'bw_' + Date.now(), kind: 'formula', formulaId, x: pos.x, y: pos.y, w: v2 ? 400 : 350, h: v2 ? 560 : 185, scaleMode: true, baseW: v2 ? 400 : 350, contentScale: 1 };
    boardWidgets.push(wd); renderBoardWidget(wd); saveWorkspace(); broadcastBoard();
    toast('Formula placed on board');
  }

  // Load a card's Desmos lines into the board calculator (ids card0..card7 are reused, so pressing again replaces them).
  function putInDesmos(lines, opts = {}) {
    if (!document.getElementById('desmosBoardWidget')) spawnDesmosOnBoard();
    if (!desmosCalc) { toast('Desmos is not loaded (offline?)'); return; }
    if (opts.degreeMode !== undefined) {
      desmosCalc.updateSettings({ degreeMode: opts.degreeMode });
      toast(opts.degreeMode ? 'Desmos switched to Degrees' : 'Desmos switched to Radians');
    } else toast('Put in Desmos');
    lines.forEach((l, i) => desmosCalc.setExpression(typeof l === 'string' ? { id: 'card' + i, latex: l } : Object.assign({}, l, { id: 'card' + i })));
    for (let i = lines.length; i < 8; i++) desmosCalc.removeExpression({ id: 'card' + i });
  }

  function spawnDesmosOnBoard(existing = null) {
    if (document.getElementById('desmosBoardWidget')) { toast('Desmos already on board'); return; }
    const pos = isPhone() ? screenToWorld(8, 112) : screenToWorld(window.innerWidth * 0.56, window.innerHeight * 0.16);
    const wd = existing || { id: 'bw_desmos', kind: 'desmos', x: pos.x, y: pos.y, w: isPhone() ? (window.innerWidth - 16) / cam.z : 460, h: isPhone() ? Math.min(460, window.innerHeight * 0.5) / cam.z : 390 };
    if (!existing) boardWidgets.push(wd);
    renderBoardWidget(wd); saveWorkspace();
    if (!existing) broadcastBoard();
  }

  // Shared "Formulas" window: what one person opens (topic, card, scroll, unit-circle angle) shows for everyone in the room.
  const TOPIC_NAMES = { linear: 'Linear', advanced: 'Advanced', ratios: 'Ratios & %', data: 'Data & Prob', geometry: 'Geometry', trig: 'Trig', circles: 'Circles', desmos: 'Desmos', strategy: 'Strategy' };
  function spawnCardsOnBoard() {
    if (document.getElementById('cardsBoardWidget')) { toast('Formulas window already on board'); return; }
    const pos = isPhone() ? screenToWorld(8, 112) : screenToWorld(window.innerWidth * 0.03, window.innerHeight * 0.14);
    const wd = { id: 'bw_cards', kind: 'cards', x: pos.x, y: pos.y,
      w: isPhone() ? (window.innerWidth - 16) / cam.z : 420, h: isPhone() ? (window.innerHeight - 240) / cam.z : 600,
      topic: 'task', q: '', cardId: null, scroll: 0, uc: null };
    boardWidgets = boardWidgets.filter(w => w.id !== 'bw_cards');
    boardWidgets.push(wd); renderBoardWidget(wd); saveWorkspace(); broadcastBoard();
  }
  function renderCardsWidget(el, wd) {
    el.id = 'cardsBoardWidget';
    el.innerHTML = `
      <div class="bw-head"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📐 Formulas · shared</span><div style="display:flex;gap:3px;"><button class="bw-close" title="Close">✕</button></div></div>
      <div class="bw-body cw">
        <div class="cw-top">
          <div class="cw-row1"><button class="cw-btn" data-cw="list" title="Back to the list">☰</button><button class="cw-btn" data-cw="prev" title="Previous card">‹</button><span class="cw-pos"></span><button class="cw-btn" data-cw="next" title="Next card">›</button><input class="cw-search" type="text" placeholder="Search cards…" /></div>
          <div class="cw-chips">${document.getElementById('topicChips').innerHTML}</div>
        </div>
        <div class="cw-view"><div class="cw-zoom"></div></div>
      </div>
      <div class="bw-resize"></div>`;
    const box = el.querySelector('.cw-zoom');
    // Phones see the board zoomed out: enlarge this window's text locally so it stays readable (not shared).
    el._localZoom = () => {
      const z = isPhone() ? Math.max(1, Math.min(2.2, 0.9 / cam.z)) : 1;
      box.style.zoom = z; el.querySelector('.cw-top').style.zoom = z; el.querySelector('.bw-head').style.zoom = z;
    };
    const view = el.querySelector('.cw-view'), search = el.querySelector('.cw-search'), posEl = el.querySelector('.cw-pos');
    let applyingScroll = false, sendTimer = null;
    const share = (delay = 0) => { clearTimeout(sendTimer); sendTimer = setTimeout(() => { saveWorkspace(); broadcastBoard(); }, delay); };
    const items = () => filterCards(wd.topic || 'task', wd.q || '');
    const setScroll = () => {
      applyingScroll = true;
      const max = view.scrollHeight - view.clientHeight;
      view.scrollTop = max > 0 ? (wd.scroll || 0) * max : 0;
      setTimeout(() => { applyingScroll = false; }, 80);
    };
    const open = (id) => { wd.cardId = id; wd.scroll = 0; wd.uc = null; draw(); share(); };
    function draw() {
      const list = items();
      el.querySelectorAll('.cw-chips .chip-btn').forEach(b => b.classList.toggle('active', !wd.q && b.dataset.topic === (wd.topic || 'task')));
      if (document.activeElement !== search) search.value = wd.q || '';
      const f = wd.cardId ? cardById(wd.cardId) : null;
      const idx = f ? list.findIndex(x => x.id === f.id) : -1;
      el.querySelector('[data-cw="list"]').disabled = !f;
      el.querySelector('[data-cw="prev"]').disabled = !list.length || idx <= 0;
      el.querySelector('[data-cw="next"]').disabled = !list.length || (f ? idx === list.length - 1 || idx < 0 : false);
      posEl.textContent = f ? (idx >= 0 ? `${idx + 1} / ${list.length}` : '') : `${list.length} cards`;
      if (f && CK && CK.isV2(f)) {
        box.innerHTML = CK.render(f, 'board');
        CK.hydrate(view.querySelector('.k-card'), f, { renderMath, putInDesmos, widgetState: wd.uc, onWidgetState: (st) => { wd.uc = st; share(); } });
      } else {
        box.innerHTML = list.length
          ? list.map(x => `<button class="cw-item" data-id="${x.id}"><span>${x.title}</span><small>${TOPIC_NAMES[x.topic] || x.topic || ''}</small></button>`).join('')
          : `<div class="cw-empty">${wd.topic === 'task' && !wd.q ? 'No cards linked to this question. Try All or search.' : 'No match.'}</div>`;
        view.querySelectorAll('.cw-item').forEach(b => { b.onclick = (e) => { e.stopPropagation(); open(b.dataset.id); }; });
        renderMath(view);
      }
      setScroll(); requestAnimationFrame(setScroll);
    }
    el.querySelectorAll('.cw-chips .chip-btn').forEach(b => {
      b.onclick = (e) => { e.stopPropagation(); wd.topic = b.dataset.topic; wd.q = ''; wd.cardId = null; wd.scroll = 0; wd.uc = null; draw(); share(); };
    });
    search.addEventListener('input', () => { wd.q = search.value; wd.cardId = null; wd.scroll = 0; wd.uc = null; draw(); share(450); });
    search.addEventListener('keydown', (e) => e.stopPropagation());
    search.addEventListener('keyup', (e) => e.stopPropagation());
    el.querySelector('[data-cw="list"]').onclick = (e) => { e.stopPropagation(); wd.cardId = null; wd.scroll = 0; wd.uc = null; draw(); share(); };
    const step = (d) => {
      const list = items(); if (!list.length) return;
      let i = list.findIndex(x => x.id === wd.cardId);
      i = i < 0 ? (d > 0 ? 0 : list.length - 1) : Math.max(0, Math.min(list.length - 1, i + d));
      open(list[i].id);
    };
    el.querySelector('[data-cw="prev"]').onclick = (e) => { e.stopPropagation(); step(-1); };
    el.querySelector('[data-cw="next"]').onclick = (e) => { e.stopPropagation(); step(1); };
    view.addEventListener('scroll', () => {
      if (applyingScroll) return;
      const max = view.scrollHeight - view.clientHeight;
      wd.scroll = max > 0 ? Math.round(view.scrollTop / max * 1000) / 1000 : 0;
      share(250);
    }, { passive: true });
    el.querySelector('.bw-close').onclick = () => { el.remove(); boardWidgets = boardWidgets.filter(x => x.id !== wd.id); saveWorkspace(); broadcastBoard(); };
    worldLayer.appendChild(el);
    el._localZoom();
    draw();
    makeWidgetInteractive(el, wd, () => setScroll());
    el._sync = (nw) => {
      const key = JSON.stringify([wd.topic, wd.q, wd.cardId]), ucKey = JSON.stringify(wd.uc || null), sc = wd.scroll;
      Object.assign(wd, nw);
      el.style.left = wd.x + 'px'; el.style.top = wd.y + 'px'; el.style.width = wd.w + 'px'; el.style.height = wd.h + 'px';
      if (JSON.stringify([wd.topic, wd.q, wd.cardId]) !== key) { draw(); return; }
      if (JSON.stringify(wd.uc || null) !== ucKey) { const m = view.querySelector('.k-widget'); if (m && m._setState) m._setState(wd.uc); }
      if (wd.scroll !== sc) setScroll();
    };
  }

  function renderBoardWidget(wd) {
    const el = document.createElement('div');
    el.className = 'board-widget';
    el._wd = wd;
    el._qid = currentQ().id;
    if (wd.kind === 'cards') {
      el.style.left = wd.x + 'px'; el.style.top = wd.y + 'px'; el.style.width = wd.w + 'px'; el.style.height = wd.h + 'px';
      renderCardsWidget(el, wd);
      return;
    }
    el.style.left = wd.x + 'px'; el.style.top = wd.y + 'px'; el.style.width = wd.w + 'px'; el.style.height = wd.h + 'px';
    if (wd.kind === 'formula') {
      const f = cardById(wd.formulaId) || FORMULAS[0];
      if (f.id !== wd.formulaId && CK && CK.isV2(f)) {
        // An old card pinned before the new cards existed: show its replacement at the new card size.
        wd.formulaId = f.id; wd.w = Math.max(wd.w || 0, 400); wd.h = Math.max(wd.h || 0, 560);
        wd.baseW = 400; wd.contentScale = 1; wd.scaleMode = true;
        el.style.width = wd.w + 'px'; el.style.height = wd.h + 'px';
      }
      el.innerHTML = `
        <div class="bw-head">
          <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">📐 ${f.title}</span>
          <div style="display:flex;gap:3px;align-items:center;flex-shrink:0;">
            <button class="bw-scale-toggle" title="Toggle scaling text & diagram with the box"></button>
            <button class="bw-scale-reset" title="Reset text & diagram to 100%">1:1</button>
            <button class="bw-close">✕</button>
          </div>
        </div>
        <div class="bw-body" style="overflow-y:auto;overflow-x:hidden;">
          ${CK && CK.isV2(f) ? `<div class="bw-scale-inner" style="padding:8px;transform-origin:0 0;">${CK.render(f, 'board')}</div>` : `
          <div class="bw-scale-inner" style="padding:8px;display:grid;grid-template-columns:80px minmax(0,1fr);gap:8px;align-items:center;transform-origin:0 0;">
            <div class="f-card-vis" style="width:80px;height:68px;">${f.svg}</div>
            <div style="min-width:0;"><div class="f-card-math">${f.math}</div><div class="f-card-note">${f.note}</div>${f.trap ? `<div class="f-card-trap">Trap: ${f.trap}</div>` : ''}</div>
          </div>`}
        </div>
        <div class="bw-resize"></div>`;

      const inner = el.querySelector('.bw-scale-inner');
      const toggleBtn = el.querySelector('.bw-scale-toggle');

      const applyWidgetScale = () => {
        if (wd.scaleMode === undefined) wd.scaleMode = true;
        if (!wd.baseW) wd.baseW = wd.w || 350;
        if (!wd.contentScale) wd.contentScale = 1;
        if (wd.scaleMode) {
          wd.contentScale = Math.max(0.6, Math.min(3, wd.w / wd.baseW));
        }
        const s = wd.contentScale;
        inner.style.transform = `scale(${s})`;
        inner.style.width = `${100 / s}%`;
        toggleBtn.textContent = wd.scaleMode ? 'Aa: Scale' : 'Aa: Lock';
        toggleBtn.style.background = wd.scaleMode ? '#111' : 'transparent';
        toggleBtn.style.color = wd.scaleMode ? '#fff' : '#111';
      };

      toggleBtn.onclick = (e) => {
        e.stopPropagation();
        wd.scaleMode = !wd.scaleMode;
        if (wd.scaleMode) wd.baseW = wd.w / (wd.contentScale || 1);
        applyWidgetScale();
        saveWorkspace(); broadcastBoard();
      };
      el.querySelector('.bw-scale-reset').onclick = (e) => {
        e.stopPropagation();
        wd.contentScale = 1;
        wd.baseW = wd.w;
        applyWidgetScale();
        saveWorkspace(); broadcastBoard();
      };
      el.querySelector('.bw-close').onclick = () => { el.remove(); boardWidgets = boardWidgets.filter(x => x.id !== wd.id); saveWorkspace(); broadcastBoard(); };

      worldLayer.appendChild(el);
      if (CK && CK.isV2(f)) CK.hydrate(el.querySelector('.k-card'), f, Object.assign(cardApi(), { widgetState: wd.uc, onWidgetState: (st) => { wd.uc = st; saveWorkspace(); broadcastBoard(); } }));
      renderMath(el);
      applyWidgetScale();
      makeWidgetInteractive(el, wd, applyWidgetScale);
      el._sync = (nw) => {
        const ucKey = JSON.stringify(wd.uc || null);
        Object.assign(wd, nw);
        el.style.left = wd.x + 'px'; el.style.top = wd.y + 'px'; el.style.width = wd.w + 'px'; el.style.height = wd.h + 'px';
        applyWidgetScale();
        if (JSON.stringify(wd.uc || null) !== ucKey) { const m = el.querySelector('.k-widget'); if (m && m._setState) m._setState(wd.uc); }
      };
    } else if (wd.kind === 'desmos') {
      el.id = 'desmosBoardWidget';
      el.innerHTML = `
        <div class="bw-head">
          <span>📈 Desmos (${settings.desmosAngles === 'deg' ? 'Deg' : 'Rad'})</span>
          <div><button id="bwSnapDesmos" title="Pin equations + graph snapshot to board">📸</button><button id="bwSaveDesmos" title="Save graph">💾</button><button class="bw-close">✕</button></div>
        </div>
        <div class="bw-body desmos-embed"><div id="desmosMount" style="width:100%;height:100%;"></div></div><div class="bw-resize"></div>`;
      el.querySelector('.bw-close').onclick = () => {
        if (desmosCalc) savedDesmosState = desmosCalc.getState();
        desmosCalc = null; el.remove(); boardWidgets = boardWidgets.filter(x => x.id !== wd.id); saveWorkspace(); broadcastBoard();
      };
      worldLayer.appendChild(el);
      const mount = el.querySelector('#desmosMount');
      if (typeof window.Desmos !== 'undefined') {
        desmosCalc = Desmos.GraphingCalculator(mount, {
          degreeMode: settings.desmosAngles === 'deg',
          clearIntoDegreeMode: settings.desmosAngles === 'deg',
          projectorMode: zenOn && settings.zenProj
        });
        if (savedDesmosState) desmosCalc.setState(savedDesmosState, { allowUndo: false });
        lastDesmosJson = JSON.stringify(shareableDesmos(desmosCalc.getState()));
        desmosCalc.observeEvent('change', onLocalDesmosChange);
      } else mount.innerHTML = '<div style="padding:18px;font-size:12px;color:#6b7280;">Offline — paste Desmos photo with Ctrl+V.</div>';
      el.querySelector('#bwSaveDesmos').onclick = () => { if (!desmosCalc) return; savedDesmosState = desmosCalc.getState(); saveWorkspace(); toast('Desmos saved'); };
      el.querySelector('#bwSnapDesmos').onclick = snapshotDesmosComposite;
      makeWidgetInteractive(el, wd, () => { if (desmosCalc) desmosCalc.resize(); });
    }
  }

  /* ==================== DRAWER ==================== */
  const sideDrawer = document.getElementById('sideDrawer');
  const views = { questions: document.getElementById('viewQuestions'), formulas: document.getElementById('viewFormulas'), desmos: document.getElementById('viewDesmos'), photos: document.getElementById('viewPhotos') };
  const subBtns = { questions: document.getElementById('subTabQuestions'), formulas: document.getElementById('subTabFormulas'), desmos: document.getElementById('subTabDesmos'), photos: document.getElementById('subTabPhotos') };
  let activeDrawerTab = null;

  function openDrawerTab(tab) {
    if (sideDrawer.classList.contains('show') && activeDrawerTab === tab) { closeDrawer(); return; }
    activeDrawerTab = tab; sideDrawer.classList.add('show');
    Object.keys(views).forEach(k => { views[k].style.display = k === tab ? 'flex' : 'none'; subBtns[k].classList.toggle('active', k === tab); });
    document.getElementById('tabFormulasBtn').classList.toggle('active', tab === 'formulas');
    document.getElementById('tabDesmosBtn').classList.toggle('active', tab === 'desmos');
    document.getElementById('tabPhotosBtn').classList.toggle('active', tab === 'photos');
  }
  function closeDrawer() {
    sideDrawer.classList.remove('show'); activeDrawerTab = null;
    ['tabFormulasBtn', 'tabDesmosBtn', 'tabPhotosBtn'].forEach(id => document.getElementById(id).classList.remove('active'));
  }
  document.getElementById('openQuestionsBtn').onclick = () => openDrawerTab('questions');
  document.getElementById('tabFormulasBtn').onclick = () => { if (!document.getElementById('cardsBoardWidget')) spawnCardsOnBoard(); else openDrawerTab('formulas'); };
  document.getElementById('tabDesmosBtn').onclick = () => { if (!document.getElementById('desmosBoardWidget')) spawnDesmosOnBoard(); else openDrawerTab('desmos'); };
  document.getElementById('tabPhotosBtn').onclick = () => openDrawerTab('photos');
  Object.keys(subBtns).forEach(k => { subBtns[k].onclick = () => openDrawerTab(k); });
  document.getElementById('closeDrawerBtn').onclick = closeDrawer;

  let filterTopic = 'ALL', filterDiff = 'all';
  // The "collection" = whatever the question browser filters currently show.
  function inCollection(q) {
    const st = progress[q.id] || {};
    if (filterTopic !== 'ALL' && q.topic !== filterTopic) return false;
    if (filterDiff === 'starred') return !!st.starred;
    if (filterDiff === 'wrong') return !!st.wrong;
    if (filterDiff !== 'all' && q.difficulty !== filterDiff) return false;
    return true;
  }
  function collectionIdx() { return QUESTIONS.map((q, i) => i).filter(i => inCollection(QUESTIONS[i])); }
  function updateNavText() {
    const col = collectionIdx();
    const pos = col.indexOf(currentIndex);
    document.getElementById('qNavText').textContent = `${pos === -1 ? '–' : pos + 1} / ${col.length}`;
  }
  function stepCollection(dir) {
    const col = collectionIdx();
    if (!col.length) { toast('This collection is empty'); return; }
    let next;
    if (dir > 0) next = col.find(i => i > currentIndex); else next = [...col].reverse().find(i => i < currentIndex);
    if (next === undefined) next = dir > 0 ? col[0] : col[col.length - 1];
    switchQuestion(next);
  }
  function initTopicDropdown() {
    const topics = ['ALL', ...new Set(QUESTIONS.map(q => q.topic))];
    const sel = document.getElementById('topicSelect');
    sel.innerHTML = topics.map(t => `<option value="${t}">${t === 'ALL' ? 'All Loaded Topics (' + QUESTIONS.length + ')' : t + ' (' + QUESTIONS.filter(q => q.topic === t).length + ')'}</option>`).join('');
    sel.onchange = (e) => { filterTopic = e.target.value; renderQuestionBrowser(); updateNavText(); };
  }
  document.getElementById('diffChips').querySelectorAll('.chip-btn').forEach(b => {
    b.onclick = () => {
      document.getElementById('diffChips').querySelectorAll('.chip-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active'); filterDiff = b.dataset.diff; renderQuestionBrowser(); updateNavText();
    };
  });
  function renderQuestionBrowser() {
    const list = document.getElementById('questionList');
    const items = QUESTIONS.map((q, idx) => ({ q, idx })).filter(({ q }) => inCollection(q));
    const wrongN = QUESTIONS.filter(q => progress[q.id] && progress[q.id].wrong).length;
    const wrongChip = document.querySelector('#diffChips .chip-btn[data-diff="wrong"]');
    if (wrongChip) wrongChip.textContent = `✗ Wrong (${wrongN})`;
    list.innerHTML = items.map(({ q, idx }) => {
      const st = progress[q.id] || {};
      return `<div class="q-list-item ${idx === currentIndex ? 'active' : ''}" data-qidx="${idx}"><span><strong>${q.topic}</strong> · ${q.num}</span><span>${st.wrong ? `<span style="color:#dc2626;">✗${st.wrongCount > 1 ? st.wrongCount : ''}</span> ` : ''}${st.starred ? '★ ' : ''}${st.solved ? '✓' : ''}</span></div>`;
    }).join('') || '<div style="font-size:12px;color:#6b7280;">No matching questions.</div>';
    list.querySelectorAll('.q-list-item').forEach(el => { el.onclick = () => switchQuestion(parseInt(el.dataset.qidx, 10)); });
  }

  let formulaTopic = 'task';
  function filterCards(topic, query) {
    const q = (query || '').trim().toLowerCase();
    const matchedIds = currentQ().formulas || [];
    const items = FORMULAS.filter(f => {
      if (q) return CK && CK.isV2(f) ? CK.searchText(f).includes(q) : (f.title + f.note + f.math + f.topic).toLowerCase().includes(q);
      if (topic === 'task') return matchedIds.includes(f.id);
      if (topic === 'all') return true;
      return f.topic === topic;
    });
    if (!q && topic === 'task') items.sort((a, b) => matchedIds.indexOf(a.id) - matchedIds.indexOf(b.id));
    return items;
  }
  function renderFormulas() {
    const list = document.getElementById('formulaList');
    const items = filterCards(formulaTopic, document.getElementById('formulaSearch').value);

    list.innerHTML = '';
    if (!items.length) {
      list.innerHTML = '<div style="font-size:12px;color:#6b7280;">No match. Try "All".</div>';
      return;
    }

    items.forEach(f => {
      if (CK && CK.isV2(f)) {
        const wrap = document.createElement('div');
        wrap.innerHTML = CK.render(f, 'drawer');
        const el = wrap.firstElementChild;
        list.appendChild(el);
        el.querySelector('.k-pin').onclick = (e) => { e.stopPropagation(); spawnFormulaOnBoard(f.id); };
        CK.hydrate(el, f, cardApi());
        return;
      }
      const card = document.createElement('div');
      card.className = 'f-card';

      const vis = document.createElement('div');
      vis.className = 'f-card-vis';
      vis.innerHTML = f.svg || '';

      const body = document.createElement('div');

      const titleRow = document.createElement('div');
      titleRow.className = 'f-card-title';
      const titleSpan = document.createElement('span');
      titleSpan.textContent = f.title;
      const pinBtn = document.createElement('button');
      pinBtn.className = 'pin-mini-btn';
      pinBtn.textContent = '+ Board';
      pinBtn.onclick = () => spawnFormulaOnBoard(f.id);
      titleRow.append(titleSpan, pinBtn);

      const mathEl = document.createElement('div');
      mathEl.className = 'f-card-math';
      mathEl.textContent = f.math;

      const noteEl = document.createElement('div');
      noteEl.className = 'f-card-note';
      noteEl.textContent = f.note;

      body.append(titleRow, mathEl, noteEl);

      if (f.trap) {
        const trapEl = document.createElement('div');
        trapEl.className = 'f-card-trap';
        trapEl.textContent = 'Trap: ' + f.trap;
        body.appendChild(trapEl);
      }

      card.append(vis, body);
      list.appendChild(card);
    });

    renderMath(list);
  }
  document.getElementById('topicChips').querySelectorAll('.chip-btn').forEach(b => {
    b.onclick = () => {
      document.getElementById('topicChips').querySelectorAll('.chip-btn').forEach(x => x.classList.remove('active'));
      b.classList.add('active'); formulaTopic = b.dataset.topic; renderFormulas();
    };
  });
  document.getElementById('formulaSearch').oninput = renderFormulas;

  document.getElementById('spawnDesmosOnBoardBtn').onclick = () => spawnDesmosOnBoard();
  document.getElementById('desmosRegPresetBtn').onclick = () => {
    if (!desmosCalc) spawnDesmosOnBoard();
    setTimeout(() => {
      if (!desmosCalc) return;
      desmosCalc.setExpressions([
        { id: 'tbl', type: 'table', columns: [{ latex: 'x_1', values: [] }, { latex: 'y_1', values: [] }] },
        { id: 'reg', latex: 'y_1 \\sim m x_1 + b' }
      ]);
      toast('Empty regression table added');
    }, 80);
  };
  document.getElementById('saveDesmosBtn').onclick = () => { if (!desmosCalc) return; savedDesmosState = desmosCalc.getState(); saveWorkspace(); toast('Desmos saved'); };
  document.getElementById('snapDesmosBtn').onclick = snapshotDesmosComposite;

  function pinImageToBoard(src) {
    pushUndo();
    const im = new Image();
    im.onload = () => {
      const ratio = im.height / im.width || 0.55; const w = Math.min(460, im.width || 420);
      const pos = screenToWorld(window.innerWidth * 0.54, window.innerHeight * 0.28);
      const id = 'o_' + Date.now();
      objects.push({ id, type: 'image', src, x: pos.x, y: pos.y, w, h: w * ratio });
      selectedId = id; setTool('select'); renderBoard(); saveWorkspace(); broadcastBoard();
    };
    im.src = src;
  }

  /* ==================== PHOTOS + PEEK + SOLO MODE ==================== */
  function renderPhotos() {
    document.getElementById('photoCount').textContent = desmosPhotos.length;
    const list = document.getElementById('photoList');
    const revBtn = document.getElementById('revealSoloPhotosBtn');
    const hidden = soloMode && !soloRevealed && desmosPhotos.length > 0;
    revBtn.style.display = hidden ? 'inline-flex' : 'none';
    if (hidden) { list.innerHTML = '<div style="font-size:12px;color:#6b7280;">Hidden in Solo Mode.</div>'; return; }
    if (!desmosPhotos.length) { list.innerHTML = '<div style="font-size:12px;color:#6b7280;">No photos yet. Press Ctrl+V anywhere.</div>'; return; }
    list.innerHTML = '';
    desmosPhotos.forEach((p, idx) => {
      const row = document.createElement('div');
      row.style.cssText = 'border:1px solid #e5e7eb;border-radius:8px;padding:6px;display:flex;flex-direction:column;gap:6px;';
      row.innerHTML = `<img src="${p.src}" style="width:100%;max-height:130px;object-fit:contain;background:#fff;cursor:pointer;" />
        <div style="display:flex;gap:4px;"><button class="tbtn active" data-act="pin" style="flex:1;">+ Board</button><button class="tbtn" data-act="peek" style="flex:1;border:1px solid #e5e7eb;">Peek</button><button class="tbtn" data-act="del" style="border:1px solid #e5e7eb;">✕</button></div>`;
      row.querySelector('img').onclick = () => openPeek(idx);
      row.querySelector('[data-act="pin"]').onclick = () => pinImageToBoard(p.src);
      row.querySelector('[data-act="peek"]').onclick = () => openPeek(idx);
      row.querySelector('[data-act="del"]').onclick = () => { desmosPhotos = desmosPhotos.filter(x => x.id !== p.id); renderPhotos(); saveWorkspace(); };
      list.appendChild(row);
    });
  }

  document.getElementById('soloModeBtn').onclick = () => {
    soloMode = !soloMode; soloRevealed = false;
    document.getElementById('soloState').textContent = soloMode ? 'ON' : 'OFF';
    document.getElementById('soloModeBtn').classList.toggle('active', soloMode);
    renderPhotos();
  };
  document.getElementById('revealSoloPhotosBtn').onclick = () => { soloRevealed = true; renderPhotos(); };

  function handlePastedFile(file) {
    const r = new FileReader();
    r.onload = async (ev) => {
      let src = ev.target.result;
      if (sb) {
        try {
          const fname = `${currentQ().id}_${Date.now()}.png`;
          const { error } = await sb.storage.from('desmos-images').upload(fname, file, { upsert: true });
          if (!error) {
            const { data } = sb.storage.from('desmos-images').getPublicUrl(fname);
            if (data && data.publicUrl) src = data.publicUrl;
          }
        } catch {}
      }
      if (settings.pasteTarget === 'question') {
        customDiagramImg = src;
        document.getElementById('qDiagramWrap').style.display = 'flex';
        document.getElementById('diagramBox').innerHTML = `<img src="${src}" style="max-width:460px;max-height:260px;display:block;border:1px solid #e5e7eb;" />`;
        toast('Custom question image placed');
      } else {
        desmosPhotos.push({ id: 'p_' + Date.now(), src });
        soloRevealed = true; renderPhotos(); pinImageToBoard(src);
      }
      saveWorkspace();
    };
    r.readAsDataURL(file);
  }
  document.getElementById('uploadPhotoBtn').onclick = () => document.getElementById('uploadPhotoInput').click();
  document.getElementById('uploadPhotoInput').onchange = (e) => { Array.from(e.target.files).forEach(handlePastedFile); e.target.value = ''; };
  window.addEventListener('paste', (e) => {
    if (document.activeElement === textBox || document.activeElement.tagName === 'INPUT') return;
    const items = e.clipboardData && e.clipboardData.items; if (!items) return;
    for (const it of items) { if (it.type.startsWith('image/')) { e.preventDefault(); const f = it.getAsFile(); if (f) handlePastedFile(f); return; } }
  });

  const peekWin = document.getElementById('peekWindow'), peekImg = document.getElementById('peekImg'), peekView = document.getElementById('peekViewport');
  let peekIdx = 0, pZoom = 1, pX = 0, pY = 0;
  function applyPeek() { peekImg.style.transform = `translate(${pX}px,${pY}px) scale(${pZoom})`; }
  function fitPeek() { const vw = peekView.clientWidth || 450, iw = peekImg.naturalWidth || vw; pZoom = Math.min(1, vw / iw); pX = 0; pY = 0; applyPeek(); }
  function openPeek(idx = 0) {
    if (!desmosPhotos.length) { toast('Paste Desmos photo with Ctrl+V first'); return; }
    peekIdx = (idx + desmosPhotos.length) % desmosPhotos.length;
    peekImg.src = desmosPhotos[peekIdx].src;
    document.getElementById('peekIdxText').textContent = `${peekIdx + 1}/${desmosPhotos.length}`;
    peekWin.classList.add('show'); peekImg.onload = fitPeek; if (peekImg.complete) fitPeek();
  }
  document.getElementById('peekClose').onclick = () => peekWin.classList.remove('show');
  document.getElementById('peekReset').onclick = fitPeek;
  document.getElementById('peekOpacity').oninput = (e) => { peekWin.style.opacity = e.target.value / 100; };
  document.getElementById('peekPin').onclick = () => { if (desmosPhotos[peekIdx]) pinImageToBoard(desmosPhotos[peekIdx].src); };
  document.getElementById('peekFocusExpr').onclick = () => { const vw = peekView.clientWidth, iw = peekImg.naturalWidth || 1000; pZoom = Math.max(1, (vw * 2.1) / iw); pX = 0; pY = 0; applyPeek(); };
  document.getElementById('peekFocusGraph').onclick = () => { const vw = peekView.clientWidth, iw = peekImg.naturalWidth || 1000; pZoom = Math.max(1, (vw * 1.45) / iw); pX = -(iw * 0.34) * pZoom; pY = 0; applyPeek(); };
  let pDrag = null;
  peekView.addEventListener('pointerdown', (e) => { if (e.button === 2) return; pDrag = { x: e.clientX - pX, y: e.clientY - pY }; peekView.setPointerCapture(e.pointerId); });
  peekView.addEventListener('pointermove', (e) => { if (!pDrag) return; pX = e.clientX - pDrag.x; pY = e.clientY - pDrag.y; applyPeek(); });
  peekView.addEventListener('pointerup', () => { pDrag = null; });
  peekView.addEventListener('wheel', (e) => {
    e.preventDefault();
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    const clamped = Math.max(-45, Math.min(45, dy));
    const speed = (Number(settings.zoomSpeed) || 22) / 10000;
    pZoom = Math.min(4.5, Math.max(0.25, pZoom * Math.exp(-clamped * speed)));
    applyPeek();
  }, { passive: false });
  (function dragPeekWin() {
    const h = document.getElementById('peekDrag'); let d = null;
    h.addEventListener('pointerdown', (e) => { if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT') return; const r = peekWin.getBoundingClientRect(); d = { ox: e.clientX - r.left, oy: e.clientY - r.top }; h.setPointerCapture(e.pointerId); });
    h.addEventListener('pointermove', (e) => { if (!d) return; peekWin.style.left = Math.max(0, e.clientX - d.ox) + 'px'; peekWin.style.top = Math.max(0, e.clientY - d.oy) + 'px'; });
    h.addEventListener('pointerup', () => { d = null; });
  })();

  /* ==================== EXPORT PNG ==================== */
  document.getElementById('exportPngBtn').onclick = async () => {
    const q = currentQ();
    // Default page is 1400x950 with world (0,0) at (700,460). Grow it if strokes/widgets sit outside.
    let minX = 0, minY = 0, maxX = 1400, maxY = 950;
    const grow = (x, y, w, h) => {
      if (![x, y, w, h].every(Number.isFinite)) return;
      minX = Math.min(minX, 700 + x - 30); minY = Math.min(minY, 460 + y - 30);
      maxX = Math.max(maxX, 700 + x + w + 30); maxY = Math.max(maxY, 460 + y + h + 30);
    };
    boardWidgets.forEach(wd => { if (wd.kind === 'desmos') grow(wd.x, wd.y, wd.w, wd.h); });
    objects.forEach(o => { try { const b = getBounds(o); grow(b.x, b.y, b.w, b.h); } catch {} });

    const dw = boardWidgets.find(w => w.kind === 'desmos');
    const headH = 26;
    const desmosImg = (dw && desmosCalc) ? await buildDesmosComposite(dw.w, Math.max(80, dw.h - headH), 2) : null;

    const c = document.createElement('canvas'); c.width = Math.ceil(maxX - minX); c.height = Math.ceil(maxY - minY);
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height);
    g.translate(-minX, -minY);
    g.strokeStyle = '#111'; g.lineWidth = 2; g.strokeRect(410, 140, 580, 340);
    g.fillStyle = '#111'; g.font = 'bold 13px Inter, sans-serif'; g.fillText(`${q.topic.toUpperCase()} · ${q.num}`, 430, 165);
    g.font = '15px Inter, sans-serif';
    const plain = q.prompt.replace(/\$/g, '').replace(/\\overline\{([^}]+)\}/g, '$1').replace(/\\widehat\{([^}]+)\}/g, 'arc $1').replace(/\\angle/g, '∠').replace(/\\circ/g, '°').replace(/<br>/g, ' ');
    wrapText(g, plain, 430, 200, 540, 22);
    g.save(); g.translate(700, 460);
    if (dw && desmosImg) {
      // Desmos sits under the ink, same as on screen
      g.fillStyle = '#fff'; g.fillRect(dw.x, dw.y, dw.w, dw.h);
      g.drawImage(desmosImg, dw.x, dw.y + headH, dw.w, dw.h - headH);
      g.fillStyle = '#f8f9fa'; g.fillRect(dw.x, dw.y, dw.w, headH);
      g.fillStyle = '#111'; g.font = '800 11px Inter, sans-serif'; g.fillText('📈 Desmos', dw.x + 8, dw.y + 17);
      g.strokeStyle = '#111'; g.lineWidth = 1.5; g.strokeRect(dw.x, dw.y, dw.w, dw.h);
    }
    renderBoard(g, true);
    g.restore();
    const a = document.createElement('a'); a.href = c.toDataURL('image/png'); a.download = `sat-${q.id}.png`; a.click();
    toast('Exported PNG');
  };
  function wrapText(g, text, x, y, maxW, lh) {
    const words = text.split(' '); let line = '';
    for (const w of words) { const test = line + w + ' '; if (g.measureText(test).width > maxW && line) { g.fillText(line, x, y); line = w + ' '; y += lh; } else line = test; }
    g.fillText(line, x, y);
  }

  /* ==================== ZEN MODE ==================== */
  function toggleZen() {
    zenOn = !zenOn;
    document.body.classList.toggle('zen-active', zenOn);
    if (desmosCalc && settings.zenProj) desmosCalc.updateSettings({ projectorMode: zenOn });
  }
  document.getElementById('zenBtn').onclick = toggleZen;
  document.getElementById('exitZenBtn').onclick = toggleZen;

  /* ==================== SAVE / LOAD / PACK ==================== */
  function workspaceKey(qId) {
    return `room_${activeRoom || 'LOCAL'}_q_${qId}`;
  }
  async function saveWorkspace() {
    if (!QUESTIONS.length || currentQ().id === 'empty') return;
    await idbSet(workspaceKey(currentQ().id), {
      objects, diagramScale, desmosPhotos, boardWidgets, customDiagramImg,
      savedDesmosState: desmosCalc ? desmosCalc.getState() : savedDesmosState
    });
  }
  async function loadWorkspace() {
    let d = await idbGet(workspaceKey(currentQ().id));
    if (!d && activeRoom === 'LOCAL') {
      d = await idbGet('q_' + currentQ().id); // keep any legacy local drawings
    }
    if (d) {
      objects = d.objects || []; desmosPhotos = d.desmosPhotos || []; savedDesmosState = d.savedDesmosState || null;
      diagramScale = d.diagramScale || 1; boardWidgets = d.boardWidgets || [];
      boardWidgets.forEach(wd => { if (wd.kind === 'desmos') spawnDesmosOnBoard(wd); else renderBoardWidget(wd); });
      if (d.customDiagramImg) {
        customDiagramImg = d.customDiagramImg;
        document.getElementById('qDiagramWrap').style.display = 'flex';
        document.getElementById('diagramBox').innerHTML = `<img src="${customDiagramImg}" style="max-width:460px;max-height:260px;display:block;" />`;
      }
    }
  }

  document.getElementById('exportBtn').onclick = () => {
    const pack = { v: 3, questionId: currentQ().id, objects, diagramScale, desmosPhotos, boardWidgets, savedDesmosState: desmosCalc ? desmosCalc.getState() : savedDesmosState };
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([JSON.stringify(pack)], { type: 'application/json' })); a.download = `sat-pack-${currentQ().id}.json`; a.click(); toast('Pack exported');
  };
  document.getElementById('importBtn').onclick = () => document.getElementById('importInput').click();
  document.getElementById('importInput').onchange = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = async (ev) => {
      try {
        const d = JSON.parse(ev.target.result);
        document.querySelectorAll('.board-widget').forEach(w => w.remove());
        objects = d.objects || []; desmosPhotos = d.desmosPhotos || []; savedDesmosState = d.savedDesmosState || null; boardWidgets = d.boardWidgets || [];
        boardWidgets.forEach(wd => { if (wd.kind === 'desmos') spawnDesmosOnBoard(wd); else renderBoardWidget(wd); });
        renderPhotos(); renderBoard(); await saveWorkspace(); toast('Pack imported');
      } catch { toast('Bad pack file'); }
    };
    r.readAsText(f); e.target.value = '';
  };

  /* ==================== SETTINGS MODAL ==================== */
  const settingsBackdrop = document.getElementById('settingsBackdrop');
  let listeningKeybind = null;

  function populateSettingsUI() {
    document.getElementById('setSmartPass').checked = !!settings.smartPass;
    document.getElementById('setPanButton').value = String(settings.panButton);
    document.getElementById('setWheelMode').value = settings.wheelMode;
    document.getElementById('setZoomSpeed').value = settings.zoomSpeed;
    document.getElementById('zoomSpeedLabel').textContent = settings.zoomSpeed;
    document.getElementById('setStylusOnly').checked = !!settings.stylusOnly;
    document.getElementById('setDefaultTool').value = settings.defaultTool;
    document.getElementById('setDefaultGrid').value = settings.defaultGrid;
    document.getElementById('setSnapDelay').value = settings.snapDelay;
    document.getElementById('snapDelayLabel').textContent = settings.snapDelay;
    document.getElementById('setLaserFade').value = settings.laserFade;
    document.getElementById('laserFadeLabel').textContent = settings.laserFade;
    document.getElementById('setTextSize').value = settings.textSize;
    document.getElementById('textSizeLabel').textContent = settings.textSize;
    document.getElementById('setDesmosAngles').value = settings.desmosAngles;
    document.getElementById('setZenProj').checked = !!settings.zenProj;
    document.getElementById('setPasteTarget').value = settings.pasteTarget;
    document.getElementById('setSbUrl').value = settings.sbUrl || '';
    document.getElementById('setSbKey').value = settings.sbKey || '';

    const cm = document.getElementById('setColorsMount');
    cm.innerHTML = settings.colors.map((c, i) => `<input type="color" value="${c}" data-cidx="${i}" style="width:28px;height:24px;border:none;padding:0;cursor:pointer;" />`).join('');
    cm.querySelectorAll('input').forEach(inp => {
      inp.onchange = (e) => { settings.colors[Number(inp.dataset.cidx)] = e.target.value; inkColor = e.target.value; renderColorPalette(); saveSettings(); };
    });

    const km = document.getElementById('keybindsMount');
    km.innerHTML = Object.entries(settings.keybinds).map(([act, code]) => `
      <div class="set-row" style="font-size:12px;"><span style="text-transform:capitalize;">${act}</span><button class="keybind-btn" data-act="${act}">${code.replace('Key', '').replace('Digit', '')}</button></div>
    `).join('');
    km.querySelectorAll('.keybind-btn').forEach(b => {
      b.onclick = () => { km.querySelectorAll('.keybind-btn').forEach(x => x.classList.remove('listening')); b.classList.add('listening'); b.textContent = 'Press key...'; listeningKeybind = b.dataset.act; };
    });
  }

  document.getElementById('openSettingsBtn').onclick = () => { populateSettingsUI(); settingsBackdrop.classList.add('show'); };
  document.getElementById('closeSettingsBtn').onclick = () => { listeningKeybind = null; settingsBackdrop.classList.remove('show'); };
  settingsBackdrop.onclick = (e) => { if (e.target === settingsBackdrop) { listeningKeybind = null; settingsBackdrop.classList.remove('show'); } };

  ['setSmartPass', 'setStylusOnly', 'setZenProj'].forEach(id => {
    document.getElementById(id).onchange = () => {
      settings.smartPass = document.getElementById('setSmartPass').checked;
      settings.stylusOnly = document.getElementById('setStylusOnly').checked;
      setPanHint();
      settings.zenProj = document.getElementById('setZenProj').checked;
      saveSettings();
    };
  });
  document.getElementById('setPanButton').onchange = (e) => { settings.panButton = Number(e.target.value); setPanHint(); saveSettings(); };
  document.getElementById('setWheelMode').onchange = (e) => { settings.wheelMode = e.target.value; saveSettings(); };
  document.getElementById('setZoomSpeed').oninput = (e) => { settings.zoomSpeed = Number(e.target.value); document.getElementById('zoomSpeedLabel').textContent = e.target.value; saveSettings(); };
  document.getElementById('setDefaultTool').onchange = (e) => { settings.defaultTool = e.target.value; setTool(e.target.value); saveSettings(); };
  document.getElementById('setDefaultGrid').onchange = (e) => { settings.defaultGrid = e.target.value; applyGrid(e.target.value); saveSettings(); };
  document.getElementById('setSnapDelay').oninput = (e) => { settings.snapDelay = Number(e.target.value); document.getElementById('snapDelayLabel').textContent = e.target.value; saveSettings(); };
  document.getElementById('setLaserFade').oninput = (e) => { settings.laserFade = Number(e.target.value); document.getElementById('laserFadeLabel').textContent = e.target.value; saveSettings(); };
  document.getElementById('setTextSize').oninput = (e) => { settings.textSize = Number(e.target.value); document.getElementById('textSizeLabel').textContent = e.target.value; saveSettings(); };
  document.getElementById('setDesmosAngles').onchange = (e) => { settings.desmosAngles = e.target.value; if (desmosCalc) desmosCalc.updateSettings({ degreeMode: e.target.value === 'deg' }); saveSettings(); };
  document.getElementById('setPasteTarget').onchange = (e) => { settings.pasteTarget = e.target.value; saveSettings(); };
  document.getElementById('testSbBtn').onclick = () => { settings.sbUrl = document.getElementById('setSbUrl').value; settings.sbKey = document.getElementById('setSbKey').value; saveSettings(); initSupabase(false); };
  document.getElementById('resetSettingsBtn').onclick = () => { settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); saveSettings(); populateSettingsUI(); renderColorPalette(); applyGrid(settings.defaultGrid); toast('Settings reset'); };

  /* ==================== ROOM MODAL ==================== */
  const roomBackdrop = document.getElementById('roomBackdrop');
  document.getElementById('openRoomBtn').onclick = () => roomBackdrop.classList.add('show');
  document.getElementById('closeRoomBtn').onclick = () => roomBackdrop.classList.remove('show');
  roomBackdrop.onclick = (e) => { if (e.target === roomBackdrop) roomBackdrop.classList.remove('show'); };
  document.getElementById('joinRoomBtn').onclick = () => joinRoom(document.getElementById('roomCodeInput').value, false);
  document.getElementById('createRoomBtn').onclick = () => {
    const code = 'SAT' + Math.floor(100 + Math.random() * 899);
    document.getElementById('roomCodeInput').value = code;
    const sbU = (settings.sbUrl || (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || '').trim();
    const sbK = (settings.sbKey || (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_ANON_KEY) || '').trim();
    const cfgPart = (sbU && sbK && !(window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL))
      ? `&cfg=${btoa(JSON.stringify({ u: sbU, k: sbK }))}` : '';
    const url = `${location.origin}${location.pathname}?room=${code}${cfgPart}`;
    navigator.clipboard && navigator.clipboard.writeText(url).catch(() => {});
    joinRoom(code, true);
    toast(`Room ${code} created & invite link copied`);
  };
  document.getElementById('leaveRoomBtn').onclick = () => leaveRoom(true);
  document.getElementById('tutorLockToggle').onchange = (e) => { tutorLocked = e.target.checked; broadcastBoard(); };

  /* ==================== SHORTCUTS (e.code) ==================== */
  window.addEventListener('keydown', (e) => {
    if (listeningKeybind) {
      e.preventDefault(); settings.keybinds[listeningKeybind] = e.code; listeningKeybind = null; saveSettings(); populateSettingsUI(); toast('Shortcut updated'); return;
    }
    if (document.activeElement === textBox) {
      if (e.code === 'Escape' || (e.code === 'Enter' && (e.ctrlKey || e.metaKey))) { e.preventDefault(); commitText(); }
      return;
    }
    if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'SELECT') return;

    if (e.code === 'Space' && !spaceHeld) { spaceHeld = true; boardCanvas.classList.remove('pass-through'); boardCanvas.style.cursor = 'grab'; return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') { e.preventDefault(); redo(); return; }
    if (e.code === 'Delete' || e.code === 'Backspace') {
      if (selectedId) { pushUndo(); objects = objects.filter(o => o.id !== selectedId); selectedId = null; renderBoard(); saveWorkspace(); broadcastBoard(); }
      return;
    }
    if (!e.ctrlKey && !e.metaKey && !e.altKey) {
      const kb = settings.keybinds;
      if (e.code === kb.cursor) setTool('cursor');
      else if (e.code === kb.select) setTool('select');
      else if (e.code === kb.pen) setTool('pen');
      else if (e.code === kb.highlighter) setTool('highlighter');
      else if (e.code === kb.laser) setTool('laser');
      else if (e.code === kb.eraser) setTool('eraser');
      else if (e.code === kb.text) setTool('text');
      else if (e.code === kb.zen) toggleZen();
      else if (e.code === kb.formulas) document.getElementById('tabFormulasBtn').click();
      else if (e.code === kb.desmos) document.getElementById('tabDesmosBtn').click();
      else if (e.code === kb.photos) openPeek(peekIdx);
    }
  });
  window.addEventListener('keyup', (e) => { if (e.code === 'Space') { spaceHeld = false; setTool(tool, shapeType); } });

  /* ==================== BOOT ==================== */
  window.addEventListener('DOMContentLoaded', async () => {
    const params = new URLSearchParams(location.search);
    const cfgParam = params.get('cfg');
    if (cfgParam) {
      try {
        const dec = JSON.parse(atob(cfgParam));
        if (dec.u && dec.k) {
          settings.sbUrl = dec.u; settings.sbKey = dec.k; saveSettings();
          const cleanUrl = location.pathname + (params.get('room') ? `?room=${params.get('room')}` : '');
          history.replaceState({}, '', cleanUrl);
        }
      } catch {}
    }

    const savedName = localStorage.getItem('sat_wb_name') || ('Friend-' + clientId.slice(-3));
    document.getElementById('roomNameInput').value = savedName;
    document.getElementById('roomNameInput').onchange = (e) => localStorage.setItem('sat_wb_name', e.target.value);

    const startRoom = (params.get('room') || localStorage.getItem('sat_wb_active_room') || 'LOCAL').toUpperCase();
    rememberRoom(startRoom);
    if (startRoom !== 'LOCAL') document.getElementById('roomCodeInput').value = startRoom;

    renderColorPalette();
    applyGrid(settings.defaultGrid);
    setPanHint();
    initTopicDropdown();
    resizeCanvas();
    await initSupabase(true);
    setTool(settings.defaultTool || 'pen');
    await switchQuestion(0);

    if (startRoom !== 'LOCAL') {
      await joinRoom(startRoom, localStorage.getItem('sat_wb_host_' + startRoom) === clientId);
    }
  });
  })();
