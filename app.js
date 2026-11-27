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
    colors: ['#2A1D16', '#D93A3A', '#1C9AA0', '#5A8F2E'],
    myColor: null,
    holdReact: true,
    tapUndo: true,
    scribbleErase: true,
    cursorStyle: 'arrow',
    timerSound: true,
    quick: ['🤯', '🔥', '👏', '😂', '🤔', '😭', '💀', '❤️'],
    stickers: [],
    stickerPacks: [],
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
      photos: 'KeyD',
      timer: 'KeyK',
      react: 'Tab'
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
    closeUndo();
    objects = [];
    boardWidgets = [];
    desmosPhotos = [];
    savedDesmosState = null;
    diagramScale = 1;
    selectedId = null;
    document.querySelectorAll('.board-widget').forEach(w => w.remove());
    if (desmosCalc) desmosCalc = null;
  }

  const peerTexts = {}; // sender -> text they are typing right now
  window.__dbgObjects = () => objects; window.__dbgPeerTexts = () => peerTexts; window.__dbgDesmos = () => desmosCalc; // for tests / console
  function mergeRemoteObject(obj) {
    if (!obj || !obj.id) return;
    const idx = objects.findIndex(o => o.id === obj.id);
    noteRemote(obj.id);
    if (idx !== -1) objects[idx] = obj;
    else objects.push(obj);
    syncedObjs.set(obj.id, JSON.stringify(obj));
  }

  // What the room last agreed on (id -> JSON). Local changes are sent as a diff against it,
  // so two people drawing at once never overwrite each other's strokes.
  let syncedObjs = new Map(), syncedWidgets = new Map();
  function snapshotSynced() {
    syncedObjs = new Map(objects.filter(o => o && o.id).map(o => [o.id, JSON.stringify(o)]));
    syncedWidgets = new Map(boardWidgets.filter(w => w && w.id).map(w => [w.id, JSON.stringify(w)]));
  }
  function diffAgainst(list, synced) {
    const up = [], seen = new Set();
    list.forEach(o => {
      if (!o || !o.id) return;
      seen.add(o.id);
      const j = JSON.stringify(o);
      if (synced.get(o.id) !== j) { up.push(o); synced.set(o.id, j); }
    });
    const del = [];
    synced.forEach((_, id) => { if (!seen.has(id)) del.push(id); });
    del.forEach(id => synced.delete(id));
    return { up, del };
  }
  function applyBoardOps(p) {
    (p.objDel || []).forEach(id => { noteRemote(id); objects = objects.filter(o => o.id !== id); syncedObjs.delete(id); if (selectedId === id) selectedId = null; });
    (p.objUp || []).forEach(o => mergeRemoteObject(o));
    if ((p.wUp && p.wUp.length) || (p.wDel && p.wDel.length)) {
      let list = boardWidgets.filter(w => !(p.wDel || []).includes(w.id)).map(w => ({ ...w }));
      (p.wUp || []).forEach(w => { const i = list.findIndex(x => x.id === w.id); if (i >= 0) list[i] = w; else list.push(w); });
      applyRemoteWidgets(list);
      (p.wDel || []).forEach(id => syncedWidgets.delete(id));
      (p.wUp || []).forEach(w => syncedWidgets.set(w.id, JSON.stringify(w)));
    }
  }

  function broadcastObject(obj) {
    if (!roomChannel || !obj) return;
    if (tutorLocked && !isHost) return;
    syncedObjs.set(obj.id, JSON.stringify(obj)); // peers now have this version
    roomChannel.send({
      type: 'broadcast',
      event: 'obj_upsert',
      payload: { sender: peerId, questionId: currentQ().id, obj }
    });
  }

  function boardPayload() {
    return {
      sender: peerId, questionId: currentQ().id, objects, diagramScale, tutorLocked,
      answer: answerState,
      boardWidgets, desmosState: shareableDesmos(desmosCalc ? desmosCalc.getState() : savedDesmosState)
    };
  }

  /* ---- Desmos live sync ---- */
  let lastDesmosJson = '';
  let desmosSendTimer = null;

  // Desmos state without the camera (pan/zoom) — each person keeps their own view.
  // What's shared about a Desmos graph: everything except each person's own view.
  // Desmos also keeps internal "__…" fields (e.g. __v12ViewportLatexStash, a copy of the viewport) that differ
  // per screen. If those were shared, two devices kept "correcting" each other forever and typing broke.
  function shareableDesmos(st) {
    if (!st) return st;
    const copy = { ...st, graph: { ...(st.graph || {}) } };
    Object.keys(copy.graph).forEach(k => { if (k === 'viewport' || k.startsWith('__')) delete copy.graph[k]; });
    return copy;
  }
  // JSON with sorted keys, so the same graph always gives the same text no matter how Desmos orders fields
  function canon(x) {
    if (Array.isArray(x)) return '[' + x.map(canon).join(',') + ']';
    if (x && typeof x === 'object') return '{' + Object.keys(x).sort().filter(k => x[k] !== undefined).map(k => JSON.stringify(k) + ':' + canon(x[k])).join(',') + '}';
    return JSON.stringify(x);
  }

  // Put a remote Desmos state into the local calculator without echoing it back. Keeps the local viewport.
  // Remote Desmos edits are merged line by line. A line is only replaced if I haven't changed it since we last agreed,
  // and never while I'm typing in it — so two people can work in the same graph at once.
  const desmosBase = new Map(); // id -> JSON of the last version both sides had
  let desmosPending = null;     // { id, remote, localAtDefer }
  const desmosList = (st) => (st && st.expressions && st.expressions.list) || [];
  function rememberDesmosIds(st) { desmosList(st).forEach(e => desmosBase.set(e.id, canon(e))); }
  let desmosPendingFull = null; // a whole-graph update that arrived while I was typing
  function applyDesmosState(state) {
    if (!desmosCalc || !state) return;
    const cur = desmosCalc.getState();
    state = shareableDesmos(state);
    if (canon(shareableDesmos(cur)) === canon(state)) { rememberDesmosIds(state); lastDesmosJson = canon(state); return; }
    const g1 = shareableDesmos(cur).graph, g2 = state.graph;
    const remote = desmosList(state), local = desmosList(cur);
    const simple = (l) => l.every(e => e.type === 'expression' || e.type === 'table');
    if (canon(g1) !== canon(g2) || !simple(remote) || !simple(local)) {
      // graph settings / folders / notes changed: take the whole state, keep my own pan & zoom.
      // Not while I'm typing in a line though: that would throw my caret out. Do it when I leave the line.
      if (desmosCalc.selectedExpressionId) { desmosPendingFull = state; return; }
      desmosPendingFull = null;
      const merged = { ...state, graph: { ...(state.graph || {}) } };
      if (cur.graph && cur.graph.viewport) merged.graph.viewport = cur.graph.viewport; else delete merged.graph.viewport;
      desmosCalc.setState(merged, { allowUndo: false });
      desmosBase.clear(); rememberDesmosIds(state);
    } else {
      const busy = desmosCalc.selectedExpressionId;
      const localById = new Map(local.map(e => [e.id, e]));
      const remoteIds = new Set(remote.map(e => e.id));
      const untouched = (e) => desmosBase.get(e.id) === canon(e); // not edited by me since we last agreed
      const gone = local.filter(e => !remoteIds.has(e.id) && desmosBase.has(e.id) && untouched(e) && e.id !== busy).map(e => ({ id: e.id }));
      if (gone.length) { desmosCalc.removeExpressions(gone); gone.forEach(e => desmosBase.delete(e.id)); }
      remote.forEach(e => {
        const j = canon(e), l = localById.get(e.id);
        if (l && canon(l) === j) { desmosBase.set(e.id, j); return; }
        if (l && !untouched(l)) return;      // I changed this line and haven't sent it yet: mine wins
        if (e.id === busy) { desmosPending = { id: e.id, remote: e, localAtDefer: canon(l || null) }; return; }
        if (l && l.type !== e.type) desmosCalc.removeExpression({ id: e.id });
        desmosCalc.setExpression(e);
        desmosBase.set(e.id, j);
      });
    }
    // what the room has = the remote state; if I still have unsent lines, the next change check sends them
    lastDesmosJson = canon(state);
  }
  // When you leave a line that changed remotely while you had it selected, take the remote version
  // unless you edited it yourself in the meantime.
  function onDesmosSelectionChange() {
    if (desmosPendingFull && desmosCalc && !desmosCalc.selectedExpressionId) { const s = desmosPendingFull; desmosPendingFull = null; applyDesmosState(s); }
    const p = desmosPending;
    if (!p || !desmosCalc || desmosCalc.selectedExpressionId === p.id) return;
    desmosPending = null;
    const l = desmosList(desmosCalc.getState()).find(e => e.id === p.id);
    if (canon(l || null) === p.localAtDefer) {
      desmosCalc.setExpression(p.remote);
      desmosBase.set(p.id, canon(p.remote));
    }
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
      const json = canon(shared);
      if (json === lastDesmosJson) return; // only pan/zoom changed, or the change came from a remote setState
      lastDesmosJson = json;
      rememberDesmosIds(shared);
      if (!roomCode || (tutorLocked && !isHost)) return;
      if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'desmos_state', payload: { sender: peerId, questionId: currentQ().id, state: shared } });
      if (sb) sb.from('rooms').update({ desmos_state: st, board_widgets: boardWidgets, updated_at: new Date().toISOString() })
        .eq('room_code', roomCode).then(({ error }) => { if (error) console.warn('Room DB update:', error.message); });
    }, 350);
  }

  // Replace on-board widgets with the room's version. A live Desmos is kept (only moved/updated) so it doesn't flicker.
  function applyRemoteWidgets(widgets, desmosState) {
    widgets = Array.isArray(widgets) ? widgets.map(w => ({ ...w })) : [];
    if (desmosState !== undefined) savedDesmosState = desmosState || null; // undefined = leave Desmos alone
    const remoteDesmos = widgets.find(w => w.kind === 'desmos');
    const desmosEl = document.getElementById('desmosBoardWidget');
    const keep = {};
    document.querySelectorAll('.board-widget').forEach(el => {
      if (el === desmosEl) return;
      const w = el._wd, r = w && widgets.find(x => x.id === w.id);
      if (r && el._sync && el._qid === currentQ().id && r.kind === w.kind && (w.kind !== 'formula' || r.formulaId === w.formulaId)) keep[w.id] = el;
      else el.remove();
    });
    const keepDesmos = !!(desmosEl && remoteDesmos && desmosEl._wd); // keep it even while its iframe is still loading
    if (desmosEl && !keepDesmos) { desmosEl.remove(); desmosCalc = null; }
    boardWidgets = widgets;
    widgets.forEach((wd, i) => {
      if (wd.kind === 'desmos' && keepDesmos) {
        const local = Object.assign(desmosEl._wd, wd);
        boardWidgets[i] = local;
        desmosEl.style.left = local.x + 'px'; desmosEl.style.top = local.y + 'px';
        desmosEl.style.width = local.w + 'px'; desmosEl.style.height = local.h + 'px';
        if (desmosCalc) desmosCalc.resize();
        if (desmosState !== undefined) applyDesmosState(savedDesmosState);
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
    wireTiramisuRoom(roomChannel);

    roomChannel
      .on('presence', { event: 'sync' }, () => {
        const st = roomChannel.presenceState();
        const names = Object.values(st).flat().map(u => u.name || 'Friend');
        document.getElementById('roomPeersList').textContent = `Online (${names.length}): ${names.join(', ')}`;
        document.getElementById('roomBadgeText').textContent = `${code} (${names.length})`;
        setRoomStatus(`🟢 Live in ${code} · ${names.length} online (${names.join(', ')})`, '#dcfce7', '#166534');
        onPresenceSync(st);
      })
      .on('presence', { event: 'join' }, ({ key }) => {
        if (key === peerId) return;
        if (isHost || objects.length || boardWidgets.length) {
          roomChannel.send({ type: 'broadcast', event: 'board_sync', payload: { ...boardPayload(), to: key } });
        }
      })
      .on('broadcast', { event: 'request_sync' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        if (isHost || objects.length || boardWidgets.length) {
          roomChannel.send({ type: 'broadcast', event: 'board_sync', payload: { ...boardPayload(), to: payload.sender } });
        }
      })
      .on('broadcast', { event: 'board_ops' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        if (payload.questionId !== currentQ().id) {
          // we're on another question: ask for the full board (that also switches us)
          roomChannel.send({ type: 'broadcast', event: 'request_sync', payload: { sender: peerId } });
          return;
        }
        applyBoardOps(payload);
        if (payload.diagramScale && payload.diagramScale !== diagramScale) { diagramScale = payload.diagramScale; applyDiagramScaleUI(); }
        if (typeof payload.tutorLocked === 'boolean') { tutorLocked = payload.tutorLocked; document.getElementById('tutorLockToggle').checked = tutorLocked; }
        renderBoard();
        saveWorkspace();
      })
      .on('broadcast', { event: 'react' }, ({ payload }) => {
        if (payload.sender === peerId || payload.questionId !== currentQ().id) return;
        if (payload.sticker) { floatSticker(payload.wx, payload.wy, payload.sticker, payload.name); return; }
        floatEmoji(payload.wx, payload.wy, payload.emoji, payload.name);
        if (payload.emoji === '❓') toast(`❓ ${payload.name} is lost here`);
      })
      .on('broadcast', { event: 'replay_start' }, ({ payload }) => {
        if (payload.sender === peerId || payload.questionId !== currentQ().id) return;
        toast(`▶ ${payload.name} is replaying the explanation`);
        startReplay(false, payload.speed);
      })
      .on('broadcast', { event: 'text_live' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        if (payload.done || payload.questionId !== currentQ().id) delete peerTexts[payload.sender];
        else peerTexts[payload.sender] = { ...payload, t: Date.now() };
        renderBoard();
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
        if (payload.to && payload.to !== peerId) return; // a reply meant for someone who just joined
        if (payload.questionId && payload.questionId !== currentQ().id) {
          const idx = QUESTIONS.findIndex(q => q.id === payload.questionId);
          if (idx !== -1) await switchQuestion(idx, true);
        }
        closeUndo();
        objects = payload.objects || [];
        // keep what I'm drawing right now
        if (pState && pState.obj && pState.obj.id && !objects.some(o => o.id === pState.obj.id)) objects.push(pState.obj);
        diagramScale = payload.diagramScale || 1;
        tutorLocked = !!payload.tutorLocked;
        if (Array.isArray(payload.boardWidgets)) applyRemoteWidgets(payload.boardWidgets, payload.desmosState);
        if (payload.answer && payload.answer.qid === currentQ().id) { answerState = payload.answer; paintAnswer(); }
        snapshotSynced();
        document.getElementById('tutorLockToggle').checked = tutorLocked;
        applyDiagramScaleUI();
        renderBoard();
        await saveWorkspace();
      })
      .on('broadcast', { event: 'answer_state' }, ({ payload }) => {
        if (payload.sender === peerId || !payload.state || payload.state.qid !== currentQ().id) return;
        answerState = payload.state; paintAnswer();
      })
      .on('broadcast', { event: 'answer_check' }, ({ payload }) => {
        if (payload.sender === peerId) return;
        const sameQ = payload.questionId === currentQ().id;
        if (payload.correct && payload.kind && sameQ) celebrate(payload.kind, payload.name, payload.streak);
        else toast(`${payload.name} answered ${payload.shown}${sameQ ? '' : ' (other question)'} — ${payload.correct ? 'correct ✓' : 'not yet'}`);
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
        peers[payload.sender] = { ...payload, t: Date.now() }; // our clock: phones and laptops disagree on time
        seePerson({ cid: payload.sender, pid: payload.pid, name: payload.name, color: payload.color });
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
          await roomChannel.track({ id: peerId, cid: clientId, name: myName, color: settings.myColor });
          onRoomJoined();
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
    onRoomLeft();
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
      closeUndo();
      objects = remoteObjs;
      diagramScale = Number(r.diagram_scale) || 1;
      applyRemoteWidgets(remoteWidgets, r.desmos_state || null);
      await saveWorkspace();
    } else {
      await loadWorkspace();
    }
    tutorLocked = !!r.tutor_locked;
    document.getElementById('tutorLockToggle').checked = tutorLocked;
    snapshotSynced();
    applyDiagramScaleUI();
    renderBoard();
  }

  // full = whole board (question switch). Otherwise only what changed since the last send.
  let dbWriteTimer = null, lastMeta = '';
  function broadcastBoard(full = false, forceDb = false) {
    if (!roomCode) return;
    if (tutorLocked && !isHost) return;
    if (full) {
      snapshotSynced();
      if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'board_sync', payload: boardPayload() });
    } else {
      const o = diffAgainst(objects, syncedObjs), w = diffAgainst(boardWidgets, syncedWidgets);
      const meta = JSON.stringify([diagramScale, tutorLocked]);
      const changed = o.up.length || o.del.length || w.up.length || w.del.length || meta !== lastMeta;
      lastMeta = meta;
      if (changed && roomChannel) roomChannel.send({ type: 'broadcast', event: 'board_ops', payload: {
        sender: peerId, questionId: currentQ().id, objUp: o.up, objDel: o.del, wUp: w.up, wDel: w.del, diagramScale, tutorLocked } });
      if (!changed && !forceDb) return;
    }
    // the room's saved copy (for people who join later) — at most about once a second
    clearTimeout(dbWriteTimer);
    dbWriteTimer = setTimeout(writeRoomDb, full ? 0 : 900);
  }
  function writeRoomDb() {
    if (!roomCode) return;
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

  function renderPeerCursors() { renderPeerCursorsNew(); }

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
    if (typeof stopReplay === 'function' && replay) stopReplay();
    customDiagramImg = null;
    soloRevealed = false;

    document.getElementById('qMetaLabel').innerHTML = `<span class="topic">${escHtml(q.topic)}</span>${escHtml(q.num)}`;
    document.getElementById('qNavTopic').textContent = q.topic;
    if (window.__tiramisuFeel) animateCard();
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
        btn.onclick = (e) => { e.stopPropagation(); setAnswer({ pick: btn.dataset.pick, result: null }); };
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
    closeUndo();
    objects = []; boardWidgets = []; desmosPhotos = []; savedDesmosState = null; diagramScale = 1;
    clearSel();

    if (!fromRemote || forceReload) await loadWorkspace();
    hasLoadedCurrentQ = true;
    applyDiagramScaleUI();
    renderPhotos();
    renderBoard();
    if (!fromRemote && !forceReload) broadcastBoard(true);
    else snapshotSynced();
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

  // Shared answer: a picked letter (gray), and after Check green/red, show on everyone's question card.
  let answerState = null; // { qid, pick, val, result: 'correct' | 'wrong' | null, by, byPeer }
  const escHtml = (t) => String(t || '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  function paintAnswer() {
    const q = currentQ();
    const st = answerState && answerState.qid === q.id ? answerState : null;
    document.querySelectorAll('#qChoices .choice-chip').forEach(c => { c.classList.remove('selected', 'correct', 'wrong'); const t = c.querySelector('.pick-by'); if (t) t.remove(); });
    const field = document.getElementById('gridInField');
    field.classList.remove('correct', 'wrong');
    if (!st) { if (window.__tiramisuFeel) animateAnswer(); return; }
    const who = st.byPeer !== peerId && st.by ? `<span class="pick-by" title="${escHtml(st.by)}" style="background:${escHtml(st.color || '#6E5A4C')}">${escHtml(initial(st.by))}</span>` : '';
    if (q.type === 'mcq') {
      picked = st.pick || null;
      const chip = st.pick && document.querySelector(`#qChoices .choice-chip[data-choice="${st.pick}"]`);
      if (chip) { chip.classList.add(st.result || 'selected'); if (who) chip.insertAdjacentHTML('beforeend', who); }
    } else {
      if (st.byPeer !== peerId || document.activeElement !== field) field.value = st.val || '';
      if (st.result) field.classList.add(st.result);
    }
    if (window.__tiramisuFeel) animateAnswer();
  }
  function setAnswer(patch) {
    answerState = { qid: currentQ().id, byPeer: peerId, by: document.getElementById('roomNameInput').value || 'Friend', color: settings.myColor, ...patch };
    paintAnswer();
    if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'answer_state', payload: { sender: peerId, state: answerState } });
  }
  let gridSendTimer = null;
  document.getElementById('gridInField').addEventListener('input', (e) => {
    clearTimeout(gridSendTimer);
    const val = e.target.value;
    gridSendTimer = setTimeout(() => setAnswer({ val, result: null }), 300);
  });

  // Wrong list: a wrong answer puts the question on it. It comes off only when the question
  // is answered correctly on the FIRST try of a later visit (so A-B-C-D guessing doesn't clear it).
  let missedThisVisit = false;
  function recordAnswer(q, correct, shown) {
    const st = { ...(progress[q.id] || {}) };
    let kind = null;
    if (correct) {
      st.solved = true;
      if (!missedThisVisit) {
        streak++;
        kind = st.wrong ? 'comeback' : streak >= 3 ? 'streak' : 'correct';
        if (st.wrong) st.wrong = false; // first try on a later visit: off the Wrong list
      } else { streak = 0; kind = 'gotthere'; }
    } else {
      streak = 0;
      if (!missedThisVisit) st.wrongCount = (st.wrongCount || 0) + 1;
      st.wrong = true; missedThisVisit = true;
      toast('Not yet — added to the Wrong list. Let\'s look at it together.');
    }
    if (kind) celebrate(kind, null, streak);
    progress[q.id] = st;
    localStorage.setItem('sat_wb_progress', JSON.stringify(progress));
    renderQuestionBrowser(); updateNavText(); syncProfileToSupabase();
    if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'answer_check', payload: {
      sender: peerId, name: document.getElementById('roomNameInput').value || 'Friend', questionId: q.id, shown, correct, kind, streak } });
  }
  document.getElementById('checkStatusChip').onclick = () => {
    const q = currentQ();
    if (q.type === 'mcq') {
      if (!picked) { toast('Tap letter A/B/C/D first'); return; }
      const ok = picked === q.answer;
      setAnswer({ pick: picked, result: ok ? 'correct' : 'wrong' });
      recordAnswer(q, ok, picked);
    } else {
      const val = document.getElementById('gridInField').value.trim();
      if (!val) return;
      const evalNum = (s) => s.includes('/') ? (Number(s.split('/')[0]) / Number(s.split('/')[1])) : Number(s);
      const ok = Math.abs(evalNum(val) - evalNum(String(q.answer))) < 0.001;
      clearTimeout(gridSendTimer);
      setAnswer({ val, result: ok ? 'correct' : 'wrong' });
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
    if (window.__tiramisu) onCameraMoved();
    const cw = document.getElementById('cardsBoardWidget'); if (cw && cw._localZoom) cw._localZoom();
  }
  window.__w2s = (x, y) => [cam.x + x * cam.z, cam.y + y * cam.z];
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
    const sel = drawsOverWindows() ? '.board-widget, .q-diagram-bar, .choice-letter-hit, #checkStatusChip, #starQuestionBtn, .gridin-row' : PASSTHROUGH_SEL;
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
        payload: curPayload({ wx: w.x, wy: w.y, tool, laserActive })
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
  // Windows (Desmos, formula cards) with a drawing tool: DRAG across a window = draw on top of it,
  // TAP a window = open it for use (blue outline). Tap the board outside it (or Esc) to close it again.
  // Cursor and Select always use windows directly.
  const drawsOverWindows = () => tool !== 'cursor' && tool !== 'select' && !spaceHeld;
  let activeWin = null, winPending = null, winTipShown = false;
  function refreshShields() {
    if (activeWin && !activeWin.isConnected) activeWin = null;
    const on = drawsOverWindows();
    document.querySelectorAll('#worldLayer > .board-widget').forEach(w => {
      let sh = w.querySelector(':scope > .bw-shield');
      if (!sh) { sh = document.createElement('div'); sh.className = 'bw-shield'; w.appendChild(sh); }
      const head = w.querySelector(':scope > .bw-head');
      sh.style.top = (head ? head.offsetHeight : 0) + 'px';
      w.classList.toggle('bw-shielded', on && w !== activeWin);
    });
  }
  new MutationObserver(() => refreshShields()).observe(worldLayer, { childList: true });
  function setActiveWin(el) {
    el = el || null;
    if (activeWin === el) return;
    if (activeWin) activeWin.classList.remove('bw-active');
    activeWin = el;
    if (activeWin) activeWin.classList.add('bw-active');
    else if (document.activeElement && document.activeElement.tagName === 'IFRAME') document.activeElement.blur();
    refreshShields();
  }
  function openWindowByTap(el, x, y) {
    setActiveWin(el);
    if (!winTipShown) { winTipShown = true; toast('Window open — tap the board outside it to draw again'); }
    if (el.id === 'desmosBoardWidget') { const f = el.querySelector('iframe'); if (f) try { f.focus(); } catch {} return; }
    // pass the tap on to what's under it (a button, a chip, a unit-circle point…)
    requestAnimationFrame(() => {
      const t = document.elementFromPoint(x, y);
      if (!t || !el.contains(t)) return;
      const hit = (t.closest && t.closest('button, input, select, a, .cw-item, .chip-btn, [data-d]')) || t;
      if (hit.tagName === 'INPUT' || hit.tagName === 'SELECT') hit.focus();
      else hit.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, clientX: x, clientY: y, view: window }));
    });
  }
  function startPendingWin() {
    const p = winPending; if (!p || p.started) return;
    p.started = true;
    if (touchUI) stageDown(p.ev); else onBoardDown(p.ev);
  }
  boardStage.addEventListener('pointerdown', (e) => {
    const t = e.target, win = t.closest ? t.closest('.board-widget') : null;
    if (activeWin && win !== activeWin) { // tapping anywhere else closes the open window (and only does that)
      setActiveWin(null);
      if (!win && !(t.closest && t.closest(UI_TARGETS))) { e.preventDefault(); e.stopPropagation(); return; }
    }
    if (!win || win === activeWin || !drawsOverWindows() || t.closest('.bw-head, .bw-resize')) return;
    if (e.button === Number(settings.panButton) || e.button === 1) return;
    e.preventDefault(); e.stopPropagation();
    try { boardStage.setPointerCapture(e.pointerId); } catch {}
    if (winPending && winPending.id !== e.pointerId) { startPendingWin(); if (touchUI) stageDown(e); return; } // 2nd finger: pinch
    winPending = { el: win, id: e.pointerId, x: e.clientX, y: e.clientY, ev: e, started: false };
  }, true);
  boardStage.addEventListener('pointermove', (e) => {
    const p = winPending; if (!p || e.pointerId !== p.id) return;
    if (!p.started) { if (Math.hypot(e.clientX - p.x, e.clientY - p.y) < 8) return; startPendingWin(); }
    if (!touchUI) onBoardMove(e); // on touch screens the stage handler takes it from here
  }, true);
  const endPendingWin = (e) => {
    const p = winPending; if (!p || e.pointerId !== p.id) return;
    winPending = null;
    if (!p.started) { if (e.type === 'pointerup') openWindowByTap(p.el, p.x, p.y); return; }
    if (!touchUI) onBoardUp(e);
  };
  boardStage.addEventListener('pointerup', endPendingWin, true);
  boardStage.addEventListener('pointercancel', endPendingWin, true);
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

  // Pinch / Ctrl+scroll anywhere (over Desmos, a toolbar, a window…) zooms the BOARD, never the whole web page,
  // so the buttons can't get pushed off the screen.
  function ctrlWheelZoom(e, x, y) {
    const dy = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;
    const speed = (Number(settings.zoomSpeed) || 22) / 10000;
    zoomAt(x, y, Math.exp(-Math.max(-45, Math.min(45, dy)) * speed));
  }
  window.addEventListener('wheel', (e) => {
    if (!(e.ctrlKey || e.metaKey)) return;
    if (e.target.closest && e.target.closest('.peek-window')) return; // the photo viewer zooms its photo
    e.preventDefault(); e.stopPropagation();
    if (e.target.closest && e.target.closest('.side-drawer, .modal')) return;
    ctrlWheelZoom(e, e.clientX, e.clientY);
  }, { passive: false, capture: true });
  window.addEventListener('keydown', (e) => {
    if (!(e.ctrlKey || e.metaKey) || e.altKey) return;
    if (['Equal', 'NumpadAdd', 'Minus', 'NumpadSubtract', 'Digit0', 'Numpad0'].includes(e.code)) {
      e.preventDefault();
      if (e.code === 'Digit0' || e.code === 'Numpad0') { cam = homeCam(); applyCamera(); }
      else zoomAt(window.innerWidth / 2, window.innerHeight / 2, /Minus|Subtract/.test(e.code) ? 0.86 : 1.16);
    }
  }, true);

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

  // Undo only reverts what *I* changed: each entry keeps the "before" of just the objects my action changed,
  // so undoing never removes a friend's strokes.
  let undoOpen = null; // { qid, before: Map(id -> json), remote: Set(ids others changed meanwhile) }
  function objMap() { return new Map(objects.filter(o => o && o.id).map(o => [o.id, JSON.stringify(o)])); }
  function closeUndo() {
    const e = undoOpen; if (!e) return; undoOpen = null;
    const now = objMap(), ids = new Set([...e.before.keys(), ...now.keys()]), changes = [];
    ids.forEach(id => { if (!e.remote.has(id) && e.before.get(id) !== now.get(id)) changes.push([id, e.before.has(id) ? e.before.get(id) : null]); });
    if (!changes.length) return;
    const u = undoByQ[e.qid] || (undoByQ[e.qid] = []);
    u.push(changes); if (u.length > 80) u.shift();
    redoByQ[e.qid] = [];
  }
  function pushUndo() {
    closeUndo();
    const e = undoOpen = { qid: currentQ().id, before: objMap(), remote: new Set() };
    setTimeout(() => { if (undoOpen === e && !pState) closeUndo(); }, 0);
  }
  function noteRemote(id) { if (undoOpen && id) undoOpen.remote.add(id); }
  function applyChanges(changes) {
    const inv = [];
    changes.forEach(([id, json]) => {
      const i = objects.findIndex(o => o.id === id);
      inv.push([id, i >= 0 ? JSON.stringify(objects[i]) : null]);
      if (json === null) { if (i >= 0) objects.splice(i, 1); }
      else { const o = JSON.parse(json); if (i >= 0) objects[i] = o; else objects.push(o); }
    });
    return inv;
  }
  function undo() {
    closeUndo();
    const id = currentQ().id, u = undoByQ[id];
    if (!u || !u.length) return;
    (redoByQ[id] || (redoByQ[id] = [])).push(applyChanges(u.pop()));
    clearSel(); renderBoard(); saveWorkspace(); broadcastBoard();
  }
  function redo() {
    closeUndo();
    const id = currentQ().id, r = redoByQ[id];
    if (!r || !r.length) return;
    (undoByQ[id] || (undoByQ[id] = [])).push(applyChanges(r.pop()));
    clearSel(); renderBoard(); saveWorkspace(); broadcastBoard();
  }
  document.getElementById('undoBtn').onclick = undo;
  document.getElementById('redoBtn').onclick = redo;

  function setTool(nextTool, nextShape = null) {
    if (nextTool !== 'text') commitText();
    tool = nextTool; shapeType = nextShape;
    document.querySelectorAll('.toolbar-top .tbtn[data-tool]').forEach(b => b.classList.toggle('active', b.dataset.tool === nextTool));
    document.getElementById('shapesBtn').classList.toggle('active', nextTool === 'shape');
    boardCanvas.classList.toggle('pass-through', nextTool === 'cursor' && !spaceHeld);
    if (typeof refreshShields === 'function') refreshShields();
    boardCanvas.style.cursor = spaceHeld ? 'grab' : nextTool === 'select' ? 'default' : nextTool === 'text' ? 'text' : nextTool === 'eraser' ? 'cell' : 'crosshair';
    if (nextTool !== 'select') { clearSel(); renderBoard(); }
    updateTray();
  }
  document.querySelectorAll('.toolbar-top .tbtn[data-tool]').forEach(b => { b.onclick = () => setTool(b.dataset.tool); });

  function renderColorPalette() { renderColorPaletteNew(); }
  function renderColorPaletteOld() {
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
      objects.push({ id, own: clientId, type: 'stamp', kind: b.dataset.stamp, x: c.x - 85, y: c.y - 70, w: 170, h: 140, color: inkColor });
      selectedId = id; setTool('select'); renderBoard(); saveWorkspace(); broadcastBoard();
    };
  });

  function getBounds(o) {
    if (o.type === 'pin') { const r = 15 / cam.z; return { x: o.x - r, y: o.y - r, w: 2 * r, h: 2 * r }; }
    if (o.type === 'stroke') {
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const p of o.points) { minX = Math.min(minX, p.x); minY = Math.min(minY, p.y); maxX = Math.max(maxX, p.x); maxY = Math.max(maxY, p.y); }
      return { x: minX - 5, y: minY - 5, w: Math.max(14, maxX - minX + 10), h: Math.max(14, maxY - minY + 10) };
    }
    if (o.type === 'text') { const tb = textBlock(o.text, o.fontSize || 19); return { x: o.x, y: o.y, w: tb.w, h: tb.h }; }
    if (o.type === 'gpt') return { x: o.x - 6, y: o.y - 6, w: 12, h: 12 };
    if (o.type === 'angleArc') { const r = o.r || 1; return { x: o.x - r, y: o.y - r, w: 2 * r, h: 2 * r }; }
    return { x: Math.min(o.x, o.x + o.w), y: Math.min(o.y, o.y + o.h), w: Math.abs(o.w), h: Math.abs(o.h) };
  }

  function hitTest(pt, ok) {
    const tol = 11 / cam.z;
    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i];
      if (ok && !ok(o)) continue;
      if (o.type === 'stroke') { if (o.points.some(p => Math.hypot(p.x - pt.x, p.y - pt.y) < tol)) return o; }
      else if (o.type === 'grid') {
        // a grid is only grabbed by its edge, so you can still draw and lasso on top of it
        const b = getBounds(o), t2 = tol * 1.4;
        const inX = pt.x >= b.x - t2 && pt.x <= b.x + b.w + t2, inY = pt.y >= b.y - t2 && pt.y <= b.y + b.h + t2;
        if (inX && inY && (pt.x < b.x + t2 || pt.x > b.x + b.w - t2 || pt.y < b.y + t2 || pt.y > b.y + b.h - t2)) return o;
      } else { const b = getBounds(o); if (pt.x >= b.x - tol && pt.x <= b.x + b.w + tol && pt.y >= b.y - tol && pt.y <= b.y + b.h + tol) return o; }
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
    if (direct > 25 && len / direct < 1.12) { const a = snapToGrid(f) || f, z = snapToGrid(l) || l; return { id: stroke.id, own: stroke.own, type: 'line', onDiagram: stroke.onDiagram, x: a.x, y: a.y, w: z.x - a.x, h: z.y - a.y, color: stroke.color, width: stroke.width, dashed: false }; }
    const bw = maxX - minX, bh = maxY - minY;
    if (bw > 24 && bh > 24 && direct < Math.max(bw, bh) * 0.38) {
      const cx = (minX + maxX) / 2, cy = (minY + maxY) / 2, r = (bw + bh) / 4;
      let err = 0; for (const p of pts) err += Math.abs(Math.hypot(p.x - cx, p.y - cy) - r);
      if (err / pts.length < r * 0.2 && Math.abs(bw - bh) < Math.max(bw, bh) * 0.32) return { id: stroke.id, own: stroke.own, type: 'circle', onDiagram: stroke.onDiagram, x: cx - r, y: cy - r, w: r * 2, h: r * 2, color: stroke.color, width: stroke.width };
      return { id: stroke.id, own: stroke.own, type: 'isoTriangle', onDiagram: stroke.onDiagram, x: minX, y: minY, w: bw, h: bh, color: stroke.color, width: stroke.width };
    }
    return null;
  }

  function renderBoard(targetCtx = ctx, skipCam = false) {
    if (targetCtx === ctx && window.__tiramisuFeel) watchInk();
    if (!skipCam) {
      const dpr = window.devicePixelRatio || 1;
      targetCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      targetCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      targetCtx.save();
      targetCtx.translate(cam.x, cam.y);
      targetCtx.scale(cam.z, cam.z);
    }

    const liveTexts = Object.values(peerTexts).filter(t => Date.now() - t.t < 20000);
    const liveIds = new Set(liveTexts.map(t => t.id).filter(Boolean));
    const drawList = (window.__satReplayObjs || objects), ordered = drawList.filter(o => o.type === 'grid').concat(drawList.filter(o => o.type !== 'grid'));
    for (const o of ordered) {
      if (o === window.__satEditingText) continue; // being edited in the text box
      if (liveIds.has(o.id)) continue; // someone else is editing it — their live version is drawn below
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
      } else if (o.type === 'grid') {
        drawGrid(o, targetCtx);
      } else if (o.type === 'gpt') {
        drawGridPoint(o, targetCtx);
      } else if (o.type === 'arrow' || o.type === 'rightMark' || o.type === 'tick' || (o.type === 'angleArc' && o.a0 != null)) {
        drawMark(o, targetCtx);
      } else if (o.type === 'pin') {
        if (!window.__satReplayObjs) drawPin(o, targetCtx);
      } else if (o.type === 'text') {
        targetCtx.fillStyle = o.color || '#111111';
        drawTextBlock(targetCtx, o.text || '', o.fontSize || 19, o.x, o.y);
      } else if (o.type === 'image') {
        let im = imgCache.get(o.src);
        if (!im) { im = new Image(); im.onload = () => renderBoard(); im.src = o.src; imgCache.set(o.src, im); }
        if (im.complete) { targetCtx.drawImage(im, o.x, o.y, o.w, o.h); targetCtx.strokeStyle = '#111'; targetCtx.lineWidth = 1; targetCtx.strokeRect(o.x, o.y, o.w, o.h); }
      }
      targetCtx.restore();
    }

    // Text other people are typing right now
    if (!skipCam) liveTexts.forEach(t => {
      const fs = t.fontSize || 19, tb = textBlock(String(t.text || ''), fs);
      targetCtx.save();
      targetCtx.strokeStyle = '#2563eb'; targetCtx.lineWidth = 1.2 / cam.z; targetCtx.setLineDash([4 / cam.z, 3 / cam.z]);
      targetCtx.strokeRect(t.x, t.y, tb.w, tb.h);
      targetCtx.setLineDash([]);
      targetCtx.fillStyle = t.color || '#111111';
      drawTextBlock(targetCtx, String(t.text || ''), fs, t.x, t.y);
      targetCtx.font = `700 ${11 / cam.z}px Inter, sans-serif`; targetCtx.fillStyle = '#2563eb'; targetCtx.textBaseline = 'bottom';
      targetCtx.fillText(`${t.name || 'Friend'} is typing…`, t.x, t.y - 2 / cam.z);
      targetCtx.restore();
    });

    if (!skipCam && multiSel.length && !window.__satReplayObjs) {
      const b = selBounds();
      if (b) {
        targetCtx.save(); targetCtx.strokeStyle = '#2563eb'; targetCtx.lineWidth = 1.4 / cam.z; targetCtx.setLineDash([5 / cam.z, 4 / cam.z]);
        targetCtx.strokeRect(b.x - 4, b.y - 4, b.w + 8, b.h + 8); targetCtx.setLineDash([]);
        targetCtx.fillStyle = '#2563eb'; const hs = 10 / cam.z; targetCtx.fillRect(b.x + b.w + 4 - hs / 2, b.y + b.h + 4 - hs / 2, hs, hs);
        targetCtx.restore();
      }
    }
    if (!skipCam && pState && pState.mode === 'lasso' && pState.pts.length > 1) {
      targetCtx.save(); targetCtx.strokeStyle = '#2563eb'; targetCtx.fillStyle = 'rgba(37,99,235,0.06)'; targetCtx.lineWidth = 1.4 / cam.z; targetCtx.setLineDash([5 / cam.z, 4 / cam.z]);
      targetCtx.beginPath(); pState.pts.forEach((p, i) => i ? targetCtx.lineTo(p.x, p.y) : targetCtx.moveTo(p.x, p.y)); targetCtx.closePath(); targetCtx.fill(); targetCtx.stroke();
      targetCtx.restore();
    }
    if (!skipCam) placeSelBar();
    if (!skipCam && selectedId && !window.__satReplayObjs) {
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

  /* ==================== MATH IN TEXT: x^2, sqrt(3), (a+b)/(c), pi, <= ==================== */
  var MATH_TRIGGER = /[\^_\/]|sqrt|\bpi\b|\btheta\b|<=|>=|!=|\+-|\binf\b|\bdeg\b|->/;
  var MATH_WORDS = { pi: 'π', theta: 'θ', alpha: 'α', beta: 'β', deg: '°', inf: '∞', Delta: 'Δ', delta: 'δ', degrees: '°' };
  var MATH_OPS = [['<=', '≤'], ['>=', '≥'], ['!=', '≠'], ['+-', '±'], ['->', '→'], ['*', '·']];
  var mc = document.createElement('canvas').getContext('2d');
  var mFont = (s) => `600 ${s}px Inter, sans-serif`;
  function mText(s, size) {
    mc.font = mFont(size);
    return { w: mc.measureText(s).width, asc: size * 0.76, desc: size * 0.22, draw(c, x, y) { c.font = mFont(size); c.fillText(s, x, y); } };
  }
  function mRow(items) {
    let w = 0, asc = 0, desc = 0;
    items.forEach(b => { w += b.w; asc = Math.max(asc, b.asc); desc = Math.max(desc, b.desc); });
    return { w, asc, desc, draw(c, x, y) { let cx = x; items.forEach(b => { b.draw(c, cx, y); cx += b.w; }); } };
  }
  function mSup(base, ex, size, sub) {
    const sh = sub ? -size * 0.24 : size * 0.42;
    return { w: base.w + ex.w + size * 0.05, asc: Math.max(base.asc, ex.asc + sh), desc: Math.max(base.desc, ex.desc - sh),
      draw(c, x, y) { base.draw(c, x, y); ex.draw(c, x + base.w + size * 0.03, y - sh); } };
  }
  function mFrac(num, den, size) {
    const ax = size * 0.28, g = size * 0.14, lw = Math.max(1, size * 0.065), w = Math.max(num.w, den.w) + size * 0.26;
    return { w, asc: ax + g + num.desc + num.asc, desc: Math.max(0, den.asc + den.desc + g - ax),
      draw(c, x, y) {
        const y0 = y - ax;
        c.fillRect(x + size * 0.07, y0 - lw / 2, w - size * 0.14, lw);
        num.draw(c, x + (w - num.w) / 2, y0 - g - num.desc);
        den.draw(c, x + (w - den.w) / 2, y0 + g + den.asc);
      } };
  }
  function mSqrt(inner, size) {
    const pad = size * 0.52, top = inner.asc + size * 0.14, lw = Math.max(1, size * 0.065), desc = Math.max(inner.desc, size * 0.12);
    const w = pad + inner.w + size * 0.1;
    return { w, asc: top + lw, desc,
      draw(c, x, y) {
        c.save(); c.strokeStyle = c.fillStyle; c.lineWidth = lw; c.lineJoin = 'round'; c.lineCap = 'round';
        c.beginPath(); c.moveTo(x + size * 0.04, y - size * 0.26); c.lineTo(x + size * 0.14, y - size * 0.32);
        c.lineTo(x + size * 0.27, y + desc * 0.8); c.lineTo(x + pad - size * 0.05, y - top); c.lineTo(x + w, y - top); c.stroke(); c.restore();
        inner.draw(c, x + pad, y);
      } };
  }
  function mParen(inner, size) {
    const ps = Math.max(size, (inner.asc + inner.desc) * 0.95), yc = (inner.asc - inner.desc) / 2;
    const o = mText('(', ps), cl = mText(')', ps), dy = -yc + 0.27 * ps;
    return { w: o.w + inner.w + cl.w, asc: Math.max(inner.asc, yc + 0.5 * ps), desc: Math.max(inner.desc, 0.5 * ps - yc),
      draw(c, x, y) { o.draw(c, x, y + dy); inner.draw(c, x + o.w, y); cl.draw(c, x + o.w + inner.w, y + dy); } };
  }
  function mTokens(s) {
    const t = []; let i = 0;
    const word = (wd) => {
      while (wd) {
        if (wd.startsWith('sqrt')) { t.push({ k: 'sqrt' }); wd = wd.slice(4); continue; }
        const gk = Object.keys(MATH_WORDS).sort((a, b) => b.length - a.length).find(k => wd === k);
        if (gk) { t.push({ k: 'var', v: MATH_WORDS[gk] }); return; }
        t.push({ k: wd.length === 1 ? 'var' : 'word', v: wd }); return;
      }
    };
    while (i < s.length) {
      const r = s.slice(i); let m;
      if ((m = r.match(/^\d+(\.\d+)?/))) { t.push({ k: 'num', v: m[0] }); i += m[0].length; continue; }
      if ((m = r.match(/^[A-Za-z]+/))) { word(m[0]); i += m[0].length; continue; }
      const op = MATH_OPS.find(([a]) => r.startsWith(a));
      if (op) { t.push({ k: 'sym', v: op[1] }); i += op[0].length; continue; }
      const ch = s[i]; t.push({ k: '()^_/'.includes(ch) ? ch : 'sym', v: ch }); i++;
    }
    return t;
  }
  function mAst(s) {
    const tk = mTokens(s); let i = 0;
    const fracs = (a) => {
      for (let j = 1; j < a.length - 1; j++) if (a[j].op && a[j - 1].ok && a[j + 1].ok) { a.splice(j - 1, 3, { t: 'frac', n: a[j - 1], d: a[j + 1], ok: true }); j--; }
      return a;
    };
    function prim() {
      const t = tk[i++];
      if (t.k === '(') { const c = seq(); if (tk[i] && tk[i].k === ')') i++; return { t: 'grp', c, ok: true }; }
      if (t.k === 'sqrt') { const a = (i < tk.length && tk[i].k !== ')') ? prim() : { t: 'txt', v: ' ' }; return { t: 'sqrt', a, ok: true }; }
      if (t.k === 'num' || t.k === 'var') return { t: 'txt', v: t.v, ok: true };
      if (t.k === 'word') return { t: 'txt', v: t.v, ok: t.v.length <= 2 };
      return { t: 'txt', v: t.k === 'sym' ? t.v : t.k, op: t.k === '/', ok: false };
    }
    function post() {
      let a = prim();
      while (i < tk.length && (tk[i].k === '^' || tk[i].k === '_')) {
        const k = tk[i++].k; if (i >= tk.length || tk[i].k === ')') break;
        let e;
        if (tk[i].k === 'sym' && tk[i].v === '-' && tk[i + 1] && (tk[i + 1].k === 'num' || tk[i + 1].k === 'var')) { e = { t: 'txt', v: '−' + tk[i + 1].v }; i += 2; }
        else e = prim();
        a = { t: k === '^' ? 'sup' : 'sub', b: a, e, ok: true };
      }
      return a;
    }
    function seq() { const out = []; while (i < tk.length && tk[i].k !== ')') out.push(post()); return fracs(out); }
    const all = [];
    while (i < tk.length) { all.push(...seq()); if (i < tk.length) { all.push({ t: 'txt', v: ')' }); i++; } }
    return all;
  }
  function mLay(n, s) {
    if (n.t === 'txt') return mText(n.v, s);
    if (n.t === 'grp') return mParen(mRow(n.c.map(x => mLay(x, s))), s);
    if (n.t === 'sqrt') return mSqrt(mInner(n.a, s), s);
    if (n.t === 'sup' || n.t === 'sub') return mSup(mLay(n.b, s), mInner(n.e, Math.max(7, s * 0.7)), s, n.t === 'sub');
    if (n.t === 'frac') return mFrac(mInner(n.n, s * 0.9), mInner(n.d, s * 0.9), s);
    return mText('', s);
  }
  function mInner(n, s) { return n.t === 'grp' ? mRow(n.c.map(x => mLay(x, s))) : mLay(n, s); }
  var textBlockCache = new Map();
  function textBlock(text, fs) {
    const key = fs + '|' + text;
    let tb = textBlockCache.get(key);
    if (tb) return tb;
    let top = 0, w = fs * 0.6;
    const lines = String(text || '').split('\n').map(ln => {
      const box = MATH_TRIGGER.test(ln) ? mRow(mAst(ln).map(n => mLay(n, fs))) : mText(ln, fs);
      const asc = Math.max(fs * 0.95, box.asc + fs * 0.05), h = Math.max(fs * 1.32, asc + box.desc + fs * 0.25);
      const L = { box, base: top + asc }; top += h; w = Math.max(w, box.w); return L;
    });
    tb = { w: w + 8, h: top + 6, lines };
    if (textBlockCache.size > 400) textBlockCache.clear();
    textBlockCache.set(key, tb);
    return tb;
  }
  window.__dbgTB = (t, f) => textBlock(t, f);
  function drawTextBlock(c, text, fs, x, y) {
    c.textBaseline = 'alphabetic';
    textBlock(text, fs).lines.forEach(L => L.box.draw(c, x + 3, y + 3 + L.base));
  }

  /* ==================== COORDINATE GRID ==================== */
  function gridGeom(o) { const b = getBounds(o), u = o.u || 30; return { b, u, ox: b.x + b.w / 2, oy: b.y + b.h / 2, nx: Math.floor(b.w / 2 / u), ny: Math.floor(b.h / 2 / u) }; }
  function drawGrid(o, c) {
    const { b, u, ox, oy, nx, ny } = gridGeom(o);
    c.save();
    c.fillStyle = 'rgba(255,255,255,0.92)'; c.fillRect(b.x, b.y, b.w, b.h);
    c.strokeStyle = '#e3e6ea'; c.lineWidth = 1;
    c.beginPath();
    for (let i = -nx; i <= nx; i++) { const x = ox + i * u; c.moveTo(x, b.y); c.lineTo(x, b.y + b.h); }
    for (let j = -ny; j <= ny; j++) { const y = oy + j * u; c.moveTo(b.x, y); c.lineTo(b.x + b.w, y); }
    c.stroke();
    c.strokeStyle = '#d1d5db'; c.strokeRect(b.x, b.y, b.w, b.h);
    c.strokeStyle = '#374151'; c.fillStyle = '#374151'; c.lineWidth = 1.6;
    c.beginPath(); c.moveTo(b.x + 2, oy); c.lineTo(b.x + b.w - 2, oy); c.moveTo(ox, b.y + b.h - 2); c.lineTo(ox, b.y + 2); c.stroke();
    const ah = 7;
    c.beginPath(); c.moveTo(b.x + b.w - 2, oy); c.lineTo(b.x + b.w - 2 - ah, oy - ah * 0.6); c.lineTo(b.x + b.w - 2 - ah, oy + ah * 0.6); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(ox, b.y + 2); c.lineTo(ox - ah * 0.6, b.y + 2 + ah); c.lineTo(ox + ah * 0.6, b.y + 2 + ah); c.closePath(); c.fill();
    const fs = Math.max(8, Math.min(13, u * 0.4)), step = u < 13 ? 5 : u < 22 ? 2 : 1;
    c.font = `600 ${fs}px Inter, sans-serif`; c.fillStyle = '#6b7280';
    c.textAlign = 'center'; c.textBaseline = 'top';
    for (let i = -nx + 1; i < nx; i++) if (i && i % step === 0) { c.fillText(String(i).replace('-', '−'), ox + i * u, oy + 3); c.fillRect(ox + i * u - 0.6, oy - 3, 1.2, 6); }
    c.textAlign = 'right'; c.textBaseline = 'middle';
    for (let j = -ny + 1; j < ny; j++) if (j && j % step === 0) { c.fillText(String(j).replace('-', '−'), ox - 5, oy - j * u); c.fillRect(ox - 3, oy - j * u - 0.6, 6, 1.2); }
    c.textAlign = 'left'; c.textBaseline = 'alphabetic'; c.fillStyle = '#374151'; c.font = `italic 700 ${fs + 2}px Inter, sans-serif`;
    c.fillText('x', b.x + b.w - fs - 4, oy - 7); c.fillText('y', ox + 7, b.y + fs + 6);
    c.restore();
  }
  function gridAt(pt) {
    for (let i = objects.length - 1; i >= 0; i--) {
      const o = objects[i]; if (o.type !== 'grid') continue;
      const b = getBounds(o); if (pt.x >= b.x && pt.x <= b.x + b.w && pt.y >= b.y && pt.y <= b.y + b.h) return o;
    }
    return null;
  }
  function snapToGrid(pt) {
    const g = gridAt(pt); if (!g) return null;
    const { u, ox, oy } = gridGeom(g), gx = Math.round((pt.x - ox) / u), gy = Math.round((oy - pt.y) / u);
    return { x: ox + gx * u, y: oy - gy * u, gx, gy };
  }
  function drawGridPoint(o, c) {
    c.save(); c.fillStyle = o.color || '#111';
    c.beginPath(); c.arc(o.x, o.y, 4.2, 0, Math.PI * 2); c.fill();
    const label = `(${String(o.gx).replace('-', '−')}, ${String(o.gy).replace('-', '−')})`;
    c.font = '700 12px Inter, sans-serif'; c.textBaseline = 'bottom';
    c.lineWidth = 3.5; c.strokeStyle = 'rgba(255,255,255,0.95)'; c.lineJoin = 'round';
    c.strokeText(label, o.x + 6, o.y - 5); c.fillText(label, o.x + 6, o.y - 5);
    c.restore();
  }
  document.getElementById('addGridBtn').onclick = () => {
    shapesMenu.classList.remove('show');
    pushUndo();
    const s = Math.min(window.innerWidth, window.innerHeight) * 0.5 / cam.z, u = Math.max(14, Math.round(s / 12)), n = 6;
    const qr = document.getElementById('questionCard').getBoundingClientRect();
    const half = n * u * cam.z, cx = Math.max(window.innerWidth * 0.66, qr.right + half + 40);
    const c = screenToWorld(cx, Math.max(qr.top + half, window.innerHeight * 0.5));
    objects.push({ id: 'o_' + Date.now(), own: clientId, type: 'grid', u, x: c.x - n * u, y: c.y - n * u, w: 2 * n * u, h: 2 * n * u });
    if (!['pen', 'shape'].includes(tool)) setTool('pen');
    renderBoard(); saveWorkspace(); broadcastBoard();
    toast('Tap inside the grid to drop a point · lines snap to the grid · move it with Select (drag its edge)');
  };

  /* ==================== GEOMETRY MARKS ==================== */
  function drawMark(o, c) {
    c.save(); c.strokeStyle = o.color || '#111'; c.fillStyle = o.color || '#111'; c.lineWidth = o.width || 2.2; c.lineCap = 'round'; c.lineJoin = 'round';
    const len = Math.hypot(o.w, o.h) || 1, ux = o.w / len, uy = o.h / len;
    if (o.type === 'arrow') {
      const hl = Math.min(16, len * 0.4) + (o.width || 2) * 1.5, ex = o.x + o.w, ey = o.y + o.h;
      c.beginPath(); c.moveTo(o.x, o.y); c.lineTo(ex - ux * hl * 0.6, ey - uy * hl * 0.6); c.stroke();
      c.beginPath(); c.moveTo(ex, ey); c.lineTo(ex - ux * hl - uy * hl * 0.5, ey - uy * hl + ux * hl * 0.5); c.lineTo(ex - ux * hl + uy * hl * 0.5, ey - uy * hl - ux * hl * 0.5); c.closePath(); c.fill();
    } else if (o.type === 'rightMark') {
      // a small square in the corner; you drag from the corner into the angle
      const s = Math.max(6, len / Math.SQRT2), a = { x: (ux - uy) / Math.SQRT2 * s, y: (uy + ux) / Math.SQRT2 * s }, b = { x: (ux + uy) / Math.SQRT2 * s, y: (uy - ux) / Math.SQRT2 * s };
      c.beginPath(); c.moveTo(o.x + a.x, o.y + a.y); c.lineTo(o.x + a.x + b.x, o.y + a.y + b.y); c.lineTo(o.x + b.x, o.y + b.y); c.stroke();
    } else if (o.type === 'tick') {
      // equal-length marks across a side; you drag along the side
      const mx = o.x + o.w / 2, my = o.y + o.h / 2, tl = 8, n = o.n || 1, gap = 5;
      for (let k = 0; k < n; k++) {
        const off = (k - (n - 1) / 2) * gap, cx = mx + ux * off, cy = my + uy * off;
        c.beginPath(); c.moveTo(cx - uy * tl, cy + ux * tl); c.lineTo(cx + uy * tl, cy - ux * tl); c.stroke();
      }
    } else if (o.type === 'angleArc') {
      c.beginPath(); c.arc(o.x, o.y, o.r, o.a0, o.a1, o.ccw); c.stroke();
    }
    c.restore();
  }
  function arcAngles(o, pt) {
    // the arc starts where you first left the vertex and follows your finger around
    const a = Math.atan2(pt.y - o.y, pt.x - o.x);
    let d = a - o.a0; while (d > Math.PI) d -= 2 * Math.PI; while (d < -Math.PI) d += 2 * Math.PI;
    o.sweep = (o.sweep === undefined ? 0 : o.sweep);
    let prev = o.sweep, cand = d; while (cand - prev > Math.PI) cand -= 2 * Math.PI; while (cand - prev < -Math.PI) cand += 2 * Math.PI;
    o.sweep = Math.max(-2 * Math.PI + 0.05, Math.min(2 * Math.PI - 0.05, cand));
    o.a1 = o.a0 + o.sweep; o.ccw = o.sweep < 0;
  }

  /* ==================== LASSO / MULTI-SELECT ==================== */
  var multiSel = [];
  function clearSel() { selectedId = null; multiSel = []; }
  function selObjs() { const ids = multiSel.length ? multiSel : (selectedId ? [selectedId] : []); return objects.filter(o => ids.includes(o.id)); }
  function selBounds(list = selObjs()) {
    if (!list.length) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    list.forEach(o => { const b = getBounds(o); x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); });
    return { x: x0, y: y0, w: Math.max(1, x1 - x0), h: Math.max(1, y1 - y0) };
  }
  function cloneSel() { const m = {}; selObjs().forEach(o => m[o.id] = JSON.parse(JSON.stringify(o))); return m; }
  function moveObjFrom(o, s, dx, dy) {
    if (s.points) o.points = s.points.map(p => ({ x: p.x + dx, y: p.y + dy }));
    else { o.x = s.x + dx; o.y = s.y + dy; }
  }
  function scaleObjFrom(o, s, ox, oy, k) {
    if (s.points) { o.points = s.points.map(p => ({ x: ox + (p.x - ox) * k, y: oy + (p.y - oy) * k })); return; }
    o.x = ox + (s.x - ox) * k; o.y = oy + (s.y - oy) * k;
    if (s.w !== undefined) { o.w = s.w * k; o.h = s.h * k; }
    if (s.r !== undefined) o.r = s.r * k;
    if (s.fontSize) o.fontSize = Math.max(6, Math.round(s.fontSize * k));
  }
  function pointInPoly(p, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const a = poly[i], b = poly[j];
      if ((a.y > p.y) !== (b.y > p.y) && p.x < (b.x - a.x) * (p.y - a.y) / (b.y - a.y) + a.x) inside = !inside;
    }
    return inside;
  }
  function finishLasso(poly) {
    clearSel();
    if (poly.length < 4) return;
    const got = objects.filter(o => {
      if (o.type === 'pin') return false;
      if (o.points) { const n = o.points.filter(p => pointInPoly(p, poly)).length; return n > o.points.length * 0.5; }
      const b = getBounds(o); return pointInPoly({ x: b.x + b.w / 2, y: b.y + b.h / 2 }, poly);
    });
    if (got.length === 1) selectedId = got[0].id;
    else if (got.length > 1) multiSel = got.map(o => o.id);
  }
  var boardClip = null, clipToken = '', clipNoSys = false;
  function newId() { return 'o_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7); }
  function pasteObjs(list, dx, dy) {
    if (!list || !list.length) return;
    pushUndo();
    const ids = [];
    list.forEach(s => { const o = JSON.parse(JSON.stringify(s)); o.id = newId(); o.own = clientId; o.onDiagram = false; moveObjFrom(o, s, dx, dy); objects.push(o); ids.push(o.id); });
    clearSel(); if (ids.length === 1) selectedId = ids[0]; else multiSel = ids;
    if (tool !== 'select') setTool('select');
    renderBoard(); saveWorkspace(); broadcastBoard();
  }
  function duplicateSel() { const l = selObjs(); if (l.length) pasteObjs(l, 24 / cam.z, 24 / cam.z); }
  function deleteSel() {
    const ids = selObjs().map(o => o.id); if (!ids.length) return;
    pushUndo(); objects = objects.filter(o => !ids.includes(o.id)); clearSel();
    renderBoard(); saveWorkspace(); broadcastBoard();
  }
  function copySel() {
    const l = selObjs(); if (!l.length) return false;
    boardClip = JSON.parse(JSON.stringify(l)); boardClip.n = 0;
    clipToken = 'satwb-copy-' + Date.now();
    clipNoSys = false;
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(clipToken).catch(() => { clipNoSys = true; }); else clipNoSys = true;
    toast(l.length > 1 ? `Copied ${l.length} items` : 'Copied');
    return true;
  }
  function pasteClip() { if (!boardClip) return; boardClip.n++; pasteObjs(boardClip, 24 * boardClip.n / cam.z, 24 * boardClip.n / cam.z); }
  var selBar = document.getElementById('selBar');
  document.getElementById('selDup').onclick = duplicateSel;
  document.getElementById('selCopy').onclick = () => copySel();
  document.getElementById('selDel').onclick = deleteSel;
  function placeSelBar() {
    const b = (tool === 'select' && !(pState && /move|resize|lasso/.test(pState.mode))) ? selBounds() : null;
    if (!b || window.__satReplayObjs) { selBar.classList.remove('show'); return; }
    const sx = cam.x + (b.x + b.w / 2) * cam.z, sy = cam.y + b.y * cam.z;
    selBar.classList.add('show');
    const w = selBar.offsetWidth || 180;
    selBar.style.left = Math.max(6, Math.min(window.innerWidth - w - 6, sx - w / 2)) + 'px';
    selBar.style.top = Math.max(56, sy - 46) + 'px';
  }

  /* ==================== COPY THE QUESTION'S FIGURE ==================== */
  document.getElementById('diagCopyBtn').onclick = () => {
    const box = document.getElementById('diagramBox');
    const img = box.querySelector('img'), svg = box.querySelector('svg');
    const place = (src, w0, h0) => {
      const r = box.getBoundingClientRect(), qr = document.getElementById('questionCard').getBoundingClientRect();
      const pos = screenToWorld(Math.max(r.right, qr.right) + 40, r.top);
      const w = Math.min(520, w0 * 1.6), h = w * (h0 / w0);
      pushUndo();
      const id = newId();
      objects.push({ id, own: clientId, type: 'image', src, x: pos.x, y: pos.y, w, h });
      clearSel(); selectedId = id; setTool('select'); renderBoard(); saveWorkspace(); broadcastBoard();
      toast('Figure copied — draw on it, drag to move, corner to resize');
    };
    if (img) { const im = new Image(); im.onload = () => place(img.src, im.width || 300, im.height || 200); im.src = img.src; return; }
    if (!svg) { toast('This question has no figure'); return; }
    const cl = svg.cloneNode(true);
    const vb = svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal : null;
    const w0 = svg.width.baseVal.value || (vb && vb.width) || 300, h0 = svg.height.baseVal.value || (vb && vb.height) || 200;
    cl.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); cl.setAttribute('width', w0 * 3); cl.setAttribute('height', h0 * 3);
    if (!cl.getAttribute('viewBox')) cl.setAttribute('viewBox', `0 0 ${w0} ${h0}`);
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(new XMLSerializer().serializeToString(cl));
    const im = new Image();
    im.onload = () => {
      // turn it into a PNG so the board can still be exported
      const cv = document.createElement('canvas'); cv.width = w0 * 3; cv.height = h0 * 3;
      const cx = cv.getContext('2d'); cx.fillStyle = '#fff'; cx.fillRect(0, 0, cv.width, cv.height); cx.drawImage(im, 0, 0, cv.width, cv.height);
      let src; try { src = cv.toDataURL('image/png'); } catch { src = url; }
      place(src, w0, h0);
    };
    im.onerror = () => toast('Could not copy this figure');
    im.src = url;
  };

  /* ==================== SHORTCUT SHEET ==================== */
  function keyName(code) { return String(code || '').replace(/^Key/, '').replace(/^Digit/, ''); }
  function openKeysHelp() {
    const kb = settings.keybinds;
    const rows = [
      ['Pen', kb.pen], ['Highlighter', kb.highlighter], ['Eraser', kb.eraser], ['Text', kb.text], ['Laser', kb.laser],
      ['Select / lasso', kb.select], ['Cursor (use Desmos etc.)', kb.cursor], ['Formulas', kb.formulas], ['Desmos', kb.desmos], ['Zen mode', kb.zen], ['Reactions (then 1–8 for the quick row)', kb.react], ['Timer', kb.timer]
    ].map(([n, k]) => `<tr><td>${n}</td><td><kbd>${keyName(k)}</kbd></td></tr>`).join('');
    document.getElementById('keysHelpBody').innerHTML = `
      <div class="kh-col"><h4>Tools</h4><table>${rows}</table></div>
      <div class="kh-col"><h4>Board</h4><table>
        <tr><td>Undo / redo (only your own changes)</td><td><kbd>Ctrl Z</kbd> <kbd>Ctrl Y</kbd></td></tr>
        <tr><td>Move the board</td><td>hold <kbd>Space</kbd> + drag</td></tr>
        <tr><td>Zoom</td><td><kbd>Ctrl +</kbd> <kbd>Ctrl −</kbd> <kbd>Ctrl 0</kbd></td></tr>
        <tr><td>Lasso: Select tool, drag around things</td><td><kbd>${keyName(kb.select)}</kbd></td></tr>
        <tr><td>Select everything</td><td><kbd>Ctrl A</kbd></td></tr>
        <tr><td>Copy / paste / duplicate</td><td><kbd>Ctrl C</kbd> <kbd>Ctrl V</kbd> <kbd>Ctrl D</kbd></td></tr>
        <tr><td>Delete selection</td><td><kbd>Del</kbd></td></tr>
        <tr><td>Close a window / finish text</td><td><kbd>Esc</kbd></td></tr>
        <tr><td>This sheet</td><td><kbd>?</kbd></td></tr>
      </table>
      <h4>Math in text</h4><table>
        <tr><td><code>x^2</code> <code>x_1</code></td><td>power, index</td></tr>
        <tr><td><code>sqrt(3)</code> <code>sqrt x</code></td><td>root</td></tr>
        <tr><td><code>3/4</code> <code>(x+1)/(x-2)</code></td><td>fraction</td></tr>
        <tr><td><code>pi theta deg</code></td><td>π θ °</td></tr>
        <tr><td><code>&lt;= &gt;= != +- *</code></td><td>≤ ≥ ≠ ± ·</td></tr>
        <tr><td><code>17*23=</code> then Enter</td><td>answer appears after =</td></tr>
      </table></div>
      <div class="kh-col"><h4>iPad / phone</h4><table>
        <tr><td>Apple Pencil</td><td>draws</td></tr>
        <tr><td>One finger (after Pencil is used)</td><td>moves the board</td></tr>
        <tr><td>Two fingers</td><td>move + zoom</td></tr>
        <tr><td>Press and hold</td><td>react / "I'm lost here"</td></tr>
        <tr><td>Selection buttons</td><td>duplicate, copy, delete</td></tr>
      </table></div>`;
    document.getElementById('keysHelp').classList.add('show');
  }
  document.getElementById('keysHelpBtn').onclick = openKeysHelp;
  document.getElementById('keysHelpClose').onclick = () => document.getElementById('keysHelp').classList.remove('show');
  document.getElementById('keysHelp').addEventListener('pointerdown', (e) => { if (e.target.id === 'keysHelp') e.currentTarget.classList.remove('show'); });

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
    if (replay) stopReplay();
    // a "lost here" pin: tap it to mark it explained
    const pin = tool !== 'select' && objects.slice().reverse().find(o => o.type === 'pin' && Math.hypot(o.x - pt.x, o.y - pt.y) < 18 / cam.z);
    if (pin) { openPinMenu(pin, e.clientX, e.clientY); return; }
    armHold(e);

    if (tool === 'text') {
      if (textOpen()) { commitText(); return; }
      const hit = hitTest(pt);
      pState = { mode: 'textTap', sx: e.clientX, sy: e.clientY, hit: hit && hit.type === 'text' ? hit : null };
      return;
    }
    if (tool === 'laser') {
      laserActive = true;
      laserTrail.push({ x: pt.x, y: pt.y, t: Date.now() });
      if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'cursor', payload: curPayload({ wx: pt.x, wy: pt.y, tool: 'laser', laserActive: true }) });
      renderBoard(); return;
    }
    if (tool === 'eraser') {
      const hit = hitTest(pt, isMine);
      pushUndo();
      if (hit) { objects = objects.filter(o => o.id !== hit.id); renderBoard(); saveWorkspace(); broadcastBoard(); }
      else eraseHint(pt);
      pState = { mode: 'erase' }; return;
    }
    if (tool === 'select') {
      if (multiSel.length) {
        const mb = selBounds();
        if (mb && Math.hypot(pt.x - (mb.x + mb.w + 4), pt.y - (mb.y + mb.h + 4)) < 16 / cam.z) { pushUndo(); pState = { mode: 'mresize', box: mb, orig: cloneSel() }; capturePtr(e); return; }
        if (mb && pt.x >= mb.x - 6 && pt.x <= mb.x + mb.w + 6 && pt.y >= mb.y - 6 && pt.y <= mb.y + mb.h + 6) { pushUndo(); pState = { mode: 'mmove', sx: pt.x, sy: pt.y, orig: cloneSel() }; capturePtr(e); return; }
        multiSel = [];
      }
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
      } else { pState = { mode: 'lasso', pts: [pt] }; capturePtr(e); }
      return;
    }
    if (tool === 'shape') {
      pushUndo();
      const SNAPS = ['line', 'dashed', 'arrow', 'rightTriangle', 'isoTriangle', 'angleArc'];
      const sp = (SNAPS.includes(shapeType) && snapToGrid(pt)) || pt;
      const obj = { id: newId(), own: clientId, type: shapeType === 'dashed' ? 'line' : shapeType === 'tick2' ? 'tick' : shapeType, dashed: shapeType === 'dashed', onDiagram: isInsideDiagram(pt), x: sp.x, y: sp.y, w: 1, h: 1, color: inkColor, width: inkWidth };
      if (shapeType === 'tick2') obj.n = 2;
      if (shapeType === 'angleArc') { delete obj.w; delete obj.h; obj.r = 0; obj.a0 = null; }
      objects.push(obj); pState = { mode: 'shape', obj }; capturePtr(e); return;
    }

    pushUndo();
    const s = { id: 'o_' + Date.now() + Math.random(), own: clientId, type: 'stroke', onDiagram: isInsideDiagram(pt), color: inkColor, width: tool === 'highlighter' ? inkWidth * 3.8 : inkWidth, alpha: tool === 'highlighter' ? 0.28 : 1, points: [pt] };
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
    if (holdStart && Math.hypot(e.clientX - holdStart.x, e.clientY - holdStart.y) > 9) clearHold();
    if (!pState) return;
    if (pState.mode === 'textTap') {
      // dragging in text mode moves the board instead
      if (Math.hypot(e.clientX - pState.sx, e.clientY - pState.sy) > 10) pState = { mode: 'pan', sx: pState.sx - cam.x, sy: pState.sy - cam.y, pointerType: pState.pointerType, pointerId: pState.pointerId };
      return;
    }
    if (pState.mode === 'pan') { cam.x = e.clientX - pState.sx; cam.y = e.clientY - pState.sy; applyCamera(); }
    else if (pState.mode === 'erase') { const hit = hitTest(pt, isMine); if (hit) { objects = objects.filter(o => o.id !== hit.id); renderBoard(); } else eraseHint(pt); }
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
    } else if (pState.mode === 'lasso') {
      const last = pState.pts[pState.pts.length - 1];
      if (Math.hypot(pt.x - last.x, pt.y - last.y) > 3 / cam.z) { pState.pts.push(pt); renderBoard(); }
    } else if (pState.mode === 'mmove' || pState.mode === 'mresize') {
      if (pState.mode === 'mmove') { const dx = pt.x - pState.sx, dy = pt.y - pState.sy; objects.forEach(o => { const s = pState.orig[o.id]; if (s) moveObjFrom(o, s, dx, dy); }); }
      else {
        const bx = pState.box, k = Math.max(0.1, ((pt.x - bx.x) / bx.w + (pt.y - bx.y) / bx.h) / 2);
        objects.forEach(o => { const s = pState.orig[o.id]; if (s) scaleObjFrom(o, s, bx.x, bx.y, k); });
      }
      if (roomChannel && Date.now() - lastLiveStrokeSend > 80) { lastLiveStrokeSend = Date.now(); broadcastBoard(); }
      renderBoard();
    } else if (pState.mode === 'shape' && pState.obj.type === 'angleArc') {
      const o = pState.obj, d = Math.hypot(pt.x - o.x, pt.y - o.y);
      if (o.a0 == null) { if (d > 12 / cam.z) { o.r = d; o.a0 = Math.atan2(pt.y - o.y, pt.x - o.x); o.a1 = o.a0; o.sweep = 0; } }
      else arcAngles(o, pt);
      if (roomChannel && o.a0 != null && Date.now() - lastLiveStrokeSend > 65) { lastLiveStrokeSend = Date.now(); broadcastObject(o); }
      renderBoard();
    } else if (pState.mode === 'shape') {
      const SN = ['line', 'arrow', 'rightTriangle', 'isoTriangle'];
      const ep = (SN.includes(pState.obj.type) && snapToGrid(pt)) || pt;
      pState.obj.w = ep.x - pState.obj.x; pState.obj.h = ep.y - pState.obj.y;
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
    clearHold();
    laserActive = false;
    if (pState && pState.mode === 'textTap') { const p = pState; pState = null; openText(p.sx, p.sy, p.hit); return; }
    if (pState && pState.mode === 'lasso') { finishLasso(pState.pts); pState = null; renderBoard(); return; }
    if (pState && pState.mode === 'shape' && pState.obj.type === 'angleArc' && pState.obj.a0 == null) {
      const dead = pState.obj; objects = objects.filter(o => o !== dead); undoOpen = null; pState = null; renderBoard(); return;
    }
    if (pState && pState.mode === 'stroke' && tool === 'pen' && !pState.snapped) {
      // a tap inside a coordinate grid drops a labelled point
      const s = pState.obj, xs = s.points.map(p => p.x), ys = s.points.map(p => p.y);
      if (Math.max(...xs) - Math.min(...xs) < 12 / cam.z && Math.max(...ys) - Math.min(...ys) < 12 / cam.z) {
        const g = snapToGrid(s.points[0]);
        if (g) {
          const idx = objects.indexOf(s);
          const pt0 = { id: s.id, type: 'gpt', x: g.x, y: g.y, gx: g.gx, gy: g.gy, color: s.color };
          if (idx !== -1) objects[idx] = pt0;
          pState.obj = pt0;
        }
      }
    }
    if (pState && pState.mode === 'stroke' && tool === 'pen' && !pState.snapped && window.__tiramisuFeel && tryScribbleErase(pState.obj)) pState.obj = null;
    if (pState) {
      clearTimeout(pState.timer);
      const finishedObj = pState.obj;
      const wasErase = pState.mode === 'erase';
      pState = null;
      saveWorkspace();
      if (finishedObj && !wasErase && objects.includes(finishedObj)) { broadcastObject(finishedObj); broadcastBoard(false, true); }
      else broadcastBoard();
    }
    closeUndo();
    renderBoard();
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
  let tapGesture = null;
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
      if (window.__tiramisuFeel) inkSeen.delete(dead.id);
      undoOpen = null;
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
      if (touchPts.size === 1) tapGesture = { start: Date.now(), max: 1, moved: false, at: new Map(), cam: { ...cam } };
      if (tapGesture) { tapGesture.max = Math.max(tapGesture.max, touchPts.size); tapGesture.at.set(e.pointerId, { x: e.clientX, y: e.clientY }); }
      if (touchPts.size === 2) { clearHold(); cancelActiveStroke(); startPinch(); return; }
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
      if (tapGesture && !tapGesture.moved) { const s = tapGesture.at.get(e.pointerId); if (s && Math.hypot(e.clientX - s.x, e.clientY - s.y) > 14) tapGesture.moved = true; }
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
      if (touchPts.size === 0 && tapGesture) { // two fingers tapped = undo, three = redo (like Goodnotes / Notability)
        const g = tapGesture; tapGesture = null;
        if (settings.tapUndo !== false && !g.moved && g.max >= 2 && Date.now() - g.start < 350) {
          cam = { ...g.cam }; applyCamera(); // a tap shouldn't leave a tiny accidental zoom behind
          pinch = null; pState = null;
          if (g.max === 2) { undo(); toast('Undo'); } else { redo(); toast('Redo'); }
          return;
        }
      }
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

  /* ==================== FEELINGS: reactions, "I'm lost here", celebrations, replay ==================== */
  const myName = () => document.getElementById('roomNameInput').value || 'Friend';
  const fxLayer = document.getElementById('fxLayer');
  // Reactions live on the board: they sit at a board spot and move and scale with pan / zoom.
  const liveFx = new Set();
  const fxScale = () => Math.max(0.6, Math.min(1.6, cam.z));
  function placeFx(el) {
    const s = fxScale();
    el.style.left = (cam.x + el._wx * cam.z + el._ox * s) + 'px';
    el.style.top = (cam.y + el._wy * cam.z + el._oy * s) + 'px';
    el.style.scale = s;
  }
  function anchorFx(el, wx, wy, ox, oy) {
    el._wx = wx; el._wy = wy; el._ox = ox; el._oy = oy; placeFx(el); liveFx.add(el);
    const t = setInterval(() => { if (!el.isConnected) { liveFx.delete(el); clearInterval(t); } }, 500);
  }
  function repositionFx() { liveFx.forEach(el => { if (el.isConnected) placeFx(el); else liveFx.delete(el); }); }
  // Emoji floating up from a spot on the board (everyone sees it there)
  function floatEmoji(wx, wy, emoji, name) {
    [0, 1, 2].forEach(i => {
      const d = document.createElement('div');
      d.className = 'fx-emoji'; d.textContent = emoji;
      d.style.fontSize = (i === 1 ? 42 : 28) + 'px'; d.style.animationDelay = (i === 1 ? 0 : 140 + i * 60) + 'ms';
      fxLayer.appendChild(d); anchorFx(d, wx, wy, (i - 1) * 20 + Math.random() * 10 - 5, 0); setTimeout(() => d.remove(), 2300);
    });
    if (name) {
      const n = document.createElement('div'); n.className = 'fx-name'; n.textContent = name;
      fxLayer.appendChild(n); anchorFx(n, wx, wy, 0, 24); setTimeout(() => n.remove(), 1900);
    }
  }
  function sendReaction(pt, emoji) {
    floatEmoji(pt.x, pt.y, emoji, null);
    if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'react', payload: { sender: peerId, questionId: currentQ().id, wx: pt.x, wy: pt.y, emoji, name: myName() } });
  }

  // Picker: press and hold on the board (or the 😀 button)
  const picker = document.getElementById('reactPicker');
  let pickerAt = null, holdTimer = null, holdStart = null;
  function openPicker(sx, sy) {
    pickerAt = screenToWorld(sx, sy);
    picker.classList.add('show');
    const w = picker.offsetWidth, h = picker.offsetHeight;
    picker.style.left = Math.max(6, Math.min(window.innerWidth - w - 6, sx - w / 2)) + 'px';
    picker.style.top = (sy - h - 18 > 8 ? sy - h - 18 : sy + 22) + 'px';
  }
  const closePicker = () => picker.classList.remove('show');
  let lastPtr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('pointermove', (e) => { lastPtr = { x: e.clientX, y: e.clientY }; }, { passive: true });
  // where the mouse last was over the board itself (not over a bar or menu)
  let lastBoardPtr = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  boardStage.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') lastBoardPtr = { x: e.clientX, y: e.clientY }; }, { passive: true });
  picker.addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return;
    e.stopPropagation();
    if (!pickerAt) return closePicker();
    if (b.dataset.lost) addLostPin(pickerAt);
    else if (b.dataset.stk != null) { const st = (settings.stickers || [])[Number(b.dataset.stk)]; if (st) sendSticker(pickerAt, st); }
    else sendReaction(pickerAt, b.dataset.r);
    closePicker();
  });
  document.getElementById('reactBtn').onclick = () => openPicker(lastBoardPtr.x, lastBoardPtr.y);
  window.addEventListener('pointerdown', (e) => {
    if (picker.classList.contains('show') && !picker.contains(e.target) && e.target.id !== 'reactBtn') closePicker();
    if (pinMenu.classList.contains('show') && !pinMenu.contains(e.target)) pinMenu.classList.remove('show');
  }, true);
  function clearHold() { clearTimeout(holdTimer); holdTimer = null; holdStart = null; }
  function armHold(e) {
    clearHold();
    // Select: holding still starts a move. Laser/eraser: holding still is normal use, not a reaction.
    if (tool === 'select' || tool === 'laser' || tool === 'eraser' || settings.holdReact === false) return;
    holdStart = { x: e.clientX, y: e.clientY };
    holdTimer = setTimeout(() => {
      const h = holdStart; clearHold();
      if (!h) return;
      if (pState && (pState.mode === 'stroke' || pState.mode === 'shape')) cancelActiveStroke(); // drop the dot
      pState = null; laserActive = false;
      openPicker(h.x, h.y);
    }, 550);
  }

  // "I'm lost here" pins: stay on the board until someone taps ✓ Explained
  function addLostPin(pt) {
    pushUndo();
    objects.push({ id: 'o_' + Date.now(), own: clientId, type: 'pin', x: pt.x, y: pt.y, by: myName() });
    renderBoard(); saveWorkspace(); broadcastBoard();
    sendReaction(pt, '❓');
  }
  function drawPin(o, c) {
    const z = cam.z, r = 13 / z;
    c.save();
    c.beginPath(); c.arc(o.x, o.y, r + 3 / z, 0, Math.PI * 2); c.fillStyle = 'rgba(245,158,11,0.25)'; c.fill();
    c.beginPath(); c.arc(o.x, o.y, r, 0, Math.PI * 2); c.fillStyle = '#f59e0b'; c.fill();
    c.lineWidth = 2 / z; c.strokeStyle = '#fff'; c.stroke();
    c.fillStyle = '#fff'; c.font = `800 ${17 / z}px Inter, sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
    c.fillText('?', o.x, o.y + 1 / z);
    const label = `${o.by || 'Someone'} is lost here`;
    c.font = `700 ${11 / z}px Inter, sans-serif`;
    const w = c.measureText(label).width + 12 / z;
    c.fillStyle = '#fef3c7'; c.fillRect(o.x - w / 2, o.y + r + 4 / z, w, 17 / z);
    c.fillStyle = '#92400e'; c.fillText(label, o.x, o.y + r + 12.5 / z);
    c.restore();
  }
  const pinMenu = document.getElementById('pinMenu');
  let pinMenuFor = null;
  function openPinMenu(pin, sx, sy) {
    pinMenuFor = pin;
    pinMenu.querySelector('.pm-text').textContent = `❓ ${pin.by || 'Someone'} is lost here`;
    pinMenu.classList.add('show');
    const w = pinMenu.offsetWidth;
    pinMenu.style.left = Math.max(6, Math.min(window.innerWidth - w - 6, sx - w / 2)) + 'px';
    pinMenu.style.top = Math.max(8, sy - 64) + 'px';
  }
  document.getElementById('pinCloseBtn').onclick = () => pinMenu.classList.remove('show');
  document.getElementById('pinDoneBtn').onclick = () => {
    const pin = pinMenuFor; pinMenu.classList.remove('show');
    if (!pin) return;
    pushUndo(); objects = objects.filter(o => o.id !== pin.id);
    renderBoard(); saveWorkspace(); broadcastBoard();
    sendReaction({ x: pin.x, y: pin.y }, '✅');
  };

  // Celebrations: everyone in the room sees them
  let streak = 0;
  const confCanvas = document.getElementById('confettiCanvas'), confCtx = confCanvas.getContext('2d');
  let confParts = [], confRaf = null;
  function confetti(n) {
    const W = window.innerWidth, H = window.innerHeight, dpr = window.devicePixelRatio || 1;
    if (!confRaf) { confCanvas.width = W * dpr; confCanvas.height = H * dpr; confCtx.setTransform(dpr, 0, 0, dpr, 0, 0); }
    const cols = ['#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
    for (let i = 0; i < n; i++) confParts.push({ x: W / 2 + (Math.random() - 0.5) * W * 0.45, y: H * 0.3, vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 10 - 3,
      r: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, w: 6 + Math.random() * 5, h: 9 + Math.random() * 7, c: cols[i % cols.length], life: 0 });
    if (!confRaf) confRaf = requestAnimationFrame(confStep);
  }
  function confStep() {
    confCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    confParts.forEach(p => {
      p.vy += 0.3; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.r += p.vr; p.life++;
      confCtx.save(); confCtx.translate(p.x, p.y); confCtx.rotate(p.r); confCtx.globalAlpha = Math.max(0, 1 - p.life / 140);
      confCtx.fillStyle = p.c; confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); confCtx.restore();
    });
    confParts = confParts.filter(p => p.life < 140 && p.y < window.innerHeight + 40);
    if (confParts.length) confRaf = requestAnimationFrame(confStep);
    else { confRaf = null; confCtx.clearRect(0, 0, window.innerWidth, window.innerHeight); }
  }
  function showBanner(text) {
    const b = document.getElementById('celebrateBanner');
    b.textContent = text; b.classList.remove('show'); void b.offsetWidth; b.classList.add('show');
    clearTimeout(showBanner.t); showBanner.t = setTimeout(() => b.classList.remove('show'), 2700);
  }
  // kind: correct (1st try) · streak (3+ in a row) · comeback (beat a Wrong-list question) · gotthere (right after a miss)
  function celebrate(kind, who, n) {
    const name = who || 'You';
    const text = kind === 'comeback' ? `💪 Comeback! ${name} beat a Wrong-list question`
      : kind === 'streak' ? `🔥 ${name}: ${n} in a row!`
      : kind === 'gotthere' ? `✓ ${name} got there`
      : `🎉 ${name} got it right!`;
    showBanner(text);
    confetti(kind === 'gotthere' ? 35 : kind === 'correct' ? 110 : 220);
  }

  // Replay: redraw the board in the order it was written, stroke by stroke
  let replay = null;
  const replayBar = document.getElementById('replayBar');
  function startReplay(share = false, speed) {
    const list = objects.filter(o => o.type !== 'pin');
    if (!list.length) { toast('Nothing on the board to replay yet'); return; }
    stopReplay();
    replay = { list, i: 0, k: 0, gap: 0, end: 0, paused: false, speed: speed || replaySpeed };
    document.getElementById('rpPause').textContent = '⏸';
    replayBar.classList.add('show');
    replay.raf = requestAnimationFrame(replayTick);
    if (share && roomChannel) roomChannel.send({ type: 'broadcast', event: 'replay_start', payload: { sender: peerId, questionId: currentQ().id, name: myName(), speed: replay.speed } });
  }
  let replaySpeed = 1;
  function replayTick() {
    const r = replay; if (!r) return;
    if (!r.paused) {
      if (r.i >= r.list.length) { if (++r.end > 50) { stopReplay(); return; } }
      else if (r.gap > 0) r.gap -= r.speed;
      else {
        const o = r.list[r.i];
        const n = o.type === 'stroke' ? o.points.length : o.type === 'text' ? (o.text || '').length : 1;
        r.k += o.type === 'stroke' ? 2.5 * r.speed : o.type === 'text' ? 0.6 * r.speed : 1;
        if (r.k >= n) { r.i++; r.k = 0; r.gap = 7; }
      }
      const shown = r.list.slice(0, r.i);
      const cur = r.list[r.i];
      if (cur && r.k > 0) {
        if (cur.type === 'stroke') shown.push({ ...cur, points: cur.points.slice(0, Math.max(2, Math.ceil(r.k))) });
        else if (cur.type === 'text') shown.push({ ...cur, text: (cur.text || '').slice(0, Math.ceil(r.k)) });
      }
      window.__satReplayObjs = shown;
      renderBoard();
    }
    r.raf = requestAnimationFrame(replayTick);
  }
  function stopReplay() {
    if (replay) cancelAnimationFrame(replay.raf);
    replay = null; window.__satReplayObjs = null;
    replayBar.classList.remove('show');
    renderBoard();
  }
  document.getElementById('replayBtn').onclick = () => startReplay(false);
  document.getElementById('rpStop').onclick = stopReplay;
  document.getElementById('rpPause').onclick = (e) => { if (!replay) return; replay.paused = !replay.paused; e.target.textContent = replay.paused ? '▶' : '⏸'; };
  document.getElementById('rpSpeed').onclick = (e) => {
    replaySpeed = replaySpeed === 1 ? 2 : replaySpeed === 2 ? 4 : 1;
    if (replay) replay.speed = replaySpeed;
    e.target.textContent = replaySpeed + '×';
  };
  document.getElementById('rpShare').onclick = () => { if (!roomChannel) { toast('Join a room to replay for everyone'); return; } startReplay(true); };

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
    if (window.__quickCalc) updateCalcHint();
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
  let textLiveTimer = null, textLiveId = null;
  function sendTextLive(done = false) {
    if (!roomChannel || (tutorLocked && !isHost)) return;
    clearTimeout(textLiveTimer);
    const send = () => roomChannel.send({ type: 'broadcast', event: 'text_live', payload: done
      ? { sender: peerId, questionId: currentQ().id, done: true }
      : { sender: peerId, questionId: currentQ().id, id: textLiveId, x: textTargetWorld.x, y: textTargetWorld.y, text: textBox.value, fontSize: textFont, color: textColor,
          name: document.getElementById('roomNameInput').value || 'Friend' } });
    if (done) send(); else textLiveTimer = setTimeout(send, 120);
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
    textLiveId = editingObj ? editingObj.id : null;
    layoutText(); renderBoard(); sendTextLive();
    try { textBox.focus({ preventScroll: true }); } catch { textBox.focus(); }
    const n = textBox.value.length; textBox.setSelectionRange(n, n);
    setTimeout(keepTextVisible, 350);
  }
  function closeText() {
    sendTextLive(true);
    textBox.style.display = 'none'; symBar.classList.remove('show'); calcHint.classList.remove('show');
    window.__satEditingText = null; editingObj = null;
    if (document.activeElement === textBox) textBox.blur();
  }
  // ---- Quick calc: "17*23=" -> "17*23=391". Understands × ÷ − · x, π √ ² ³ °, %, !, sin/cos/tan (degrees unless π is used), ln, log, implicit ×.
  function calcEval(src) {
    let s = String(src).toLowerCase()
      .replace(/[−–—]/g, '-').replace(/[×·∙⋅✕]/g, '*').replace(/÷/g, '/').replace(/²/g, '^2').replace(/³/g, '^3')
      .replace(/π/g, 'pi').replace(/√/g, 'sqrt').replace(/\s+/g, '')
      .replace(/(\d),(?=\d{3}(?!\d))/g, '$1')                 // 12,000 -> 12000
      .replace(/(\d|\))x(?=[\d(.]|pi|sqrt)/g, '$1*');         // 2x5 -> 2*5
    const toks = []; let i = 0;
    while (i < s.length) {
      const rest = s.slice(i); let m;
      if ((m = rest.match(/^(\d+\.?\d*|\.\d+)/))) { toks.push({ t: 'n', v: parseFloat(m[1]) }); i += m[1].length; }
      else if ((m = rest.match(/^(sqrt|sin|cos|tan|ln|log|pi)/))) { toks.push({ t: 'id', v: m[1] }); i += m[1].length; }
      else if ('+-*/^()%!°'.includes(s[i])) { toks.push({ t: s[i] }); i++; }
      else throw new Error('char ' + s[i]);
    }
    let p = 0, sawDeg = 0, sawPi = 0, ops = 0;
    const peek = () => toks[p], eat = (t) => { if (toks[p] && toks[p].t === t) { p++; return true; } return false; };
    const startsPrimary = (k) => k && (k.t === 'n' || k.t === 'id' || k.t === '(');
    function expr() { let v = term(); for (;;) { if (eat('+')) { ops++; v += term(); } else if (eat('-')) { ops++; v -= term(); } else return v; } }
    function term() {
      let v = unary();
      for (;;) {
        if (eat('*')) { ops++; v *= unary(); }
        else if (eat('/')) { ops++; const d = unary(); if (d === 0) throw new Error('÷0'); v /= d; }
        else if (startsPrimary(peek())) { ops++; v *= power(); }   // 2pi, 3(4), (2)(3)
        else return v;
      }
    }
    function unary() { if (eat('-')) { ops++; return -unary(); } if (eat('+')) return unary(); return power(); }
    function power() { const b = postfix(); if (eat('^')) { ops++; return Math.pow(b, unary()); } return b; }
    function postfix() {
      let v = primary();
      for (;;) {
        if (eat('%')) { ops++; v /= 100; }
        else if (eat('!')) { ops++; if (!Number.isInteger(v) || v < 0 || v > 170) throw new Error('!'); let f = 1; for (let k = 2; k <= v; k++) f *= k; v = f; }
        else if (eat('°')) { sawDeg++; v *= Math.PI / 180; }
        else return v;
      }
    }
    function primary() {
      const k = toks[p++]; if (!k) throw new Error('end');
      if (k.t === 'n') return k.v;
      if (k.t === '(') { const v = expr(); if (!eat(')') && p < toks.length) throw new Error(')'); return v; }  // a missing last ")" is forgiven
      if (k.t === 'id') {
        if (k.v === 'pi') { sawPi++; ops++; return Math.PI; }
        ops++;
        const d0 = sawDeg, p0 = sawPi;
        const a = k.v === 'sqrt' ? power() : postfix();
        if (k.v === 'sqrt') { if (a < 0) throw new Error('√-'); return Math.sqrt(a); }
        if (k.v === 'ln') return Math.log(a);
        if (k.v === 'log') return Math.log10(a);
        const rad = (sawDeg > d0 || sawPi > p0) ? a : a * Math.PI / 180;   // sin(30) means 30°, sin(pi/6) is radians
        const r = k.v === 'sin' ? Math.sin(rad) : k.v === 'cos' ? Math.cos(rad) : Math.tan(rad);
        return Math.abs(r) < 1e-12 ? 0 : r;
      }
      throw new Error('token ' + k.t);
    }
    const v = expr();
    if (p < toks.length) throw new Error('extra');
    if (!ops) throw new Error('nothing to calculate');
    if (typeof v !== 'number' || !isFinite(v)) throw new Error('not finite');
    return v;
  }
  function calcFormat(r, expr) {
    let out = Math.abs(r - Math.round(r)) < 1e-9 ? String(Math.round(r)) : String(parseFloat(r.toFixed(4)));
    if (!Number.isInteger(+out) && !/^\s*-?\d+\s*\/\s*\d+\s*$/.test(expr) && !/sqrt|√|pi|π|sin|cos|tan|ln|log/i.test(expr)) {
      for (let d = 2; d <= 100; d++) { const n = Math.round(r * d); if (Math.abs(r - n / d) < 1e-9) { out += ` = ${n}/${d}`; break; } }
    }
    return out.replace(/-/g, '−');
  }
  // Returns { line, answer } for a line ending in "=", or null when the line isn't a calculation.
  function calcLine(line) {
    const m = line.match(/^(.*?)([^=]*)=\s*$/);
    if (!m) return null;
    const expr = m[2].trim();
    const bare = expr.replace(/(\d|\))\s*[x×]\s*(?=[\d(.√π]|pi|sqrt)/gi, '$1*').replace(/sqrt|sin|cos|tan|ln|log|pi/gi, '');
    if (!expr || /[a-z]/i.test(bare)) return null; // letters like x, y: algebra, not arithmetic
    try { const r = calcEval(expr); return { answer: calcFormat(r, expr) }; }
    catch (e) { return /[-+*\/^×÷−√π²³!%]|\d\s*\(/.test(expr) ? { error: true } : null; }
  }
  function quickCalc(text) {
    return text.split('\n').map(line => {
      const c = calcLine(line);
      if (!c || !c.answer) return line;
      const t = line.replace(/\s*$/, '');
      return t + (/\s=$/.test(t) ? ' ' : '') + c.answer;
    }).join('\n');
  }
  // Live answer while typing: a chip under the text box.
  const calcHint = document.createElement('div');
  calcHint.id = 'calcHint'; calcHint.className = 'calc-hint'; document.body.appendChild(calcHint);
  function updateCalcHint() {
    if (!textOpen()) { calcHint.classList.remove('show'); return; }
    const v = textBox.value, caretLineEnd = v.slice(0, textBox.selectionEnd || v.length).split('\n').length - 1;
    const line = v.split('\n')[caretLineEnd] || '';
    const c = calcLine(line);
    if (!c) { calcHint.classList.remove('show'); return; }
    calcHint.innerHTML = c.error ? `<span class="mut">Can't calculate this line</span>`
      : `<b>= ${escHtml(c.answer)}</b><span class="mut">${document.body.classList.contains('touch-ui') ? 'Place' : 'Enter'} writes it</span>`;
    calcHint.classList.toggle('err', !!c.error);
    const r = textBox.getBoundingClientRect();
    calcHint.classList.add('show');
    const w = calcHint.offsetWidth, h = calcHint.offsetHeight;
    if (r.right + 12 + w < window.innerWidth - 8) { calcHint.style.left = (r.right + 12) + 'px'; calcHint.style.top = Math.max(8, r.bottom - h - 2) + 'px'; }
    else { calcHint.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.left)) + 'px'; calcHint.style.top = (r.bottom + 10) + 'px'; }
  }
  window.__quickCalc = quickCalc; window.__calcEval = calcEval;
  function commitText() {
    if (!textOpen()) return;
    const val = quickCalc(textBox.value.replace(/\s+$/, ''));
    const ed = editingObj;
    closeText();
    if (ed) {
      if (!val.trim()) { pushUndo(); objects = objects.filter(o => o !== ed); }
      else if (val !== ed.text || textFont !== ed.fontSize) { pushUndo(); ed.text = val; ed.fontSize = textFont; }
      else { renderBoard(); return; }
    } else {
      if (!val.trim()) { renderBoard(); return; }
      pushUndo();
      objects.push({ id: 'o_' + Date.now(), own: clientId, type: 'text', x: textTargetWorld.x, y: textTargetWorld.y, text: val, fontSize: textFont, color: textColor });
    }
    renderBoard(); saveWorkspace(); broadcastBoard();
  }
  function cancelText() { closeText(); renderBoard(); }
  textBox.addEventListener('input', () => { layoutText(); sendTextLive(); updateCalcHint(); });
  textBox.addEventListener('keyup', updateCalcHint); textBox.addEventListener('click', updateCalcHint);
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
      sendTextLive(); updateCalcHint();
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
  const desmosReadyCbs = [];
  function whenDesmosReady(cb) { if (desmosCalc) cb(); else desmosReadyCbs.push(cb); }
  function flushDesmosReady() { desmosReadyCbs.splice(0).forEach(cb => { try { cb(); } catch (e) { console.warn(e); } }); }
  function putInDesmos(lines, opts = {}) {
    if (!document.getElementById('desmosBoardWidget')) spawnDesmosOnBoard();
    if (!desmosCalc) {
      if (typeof window.Desmos === 'undefined') { toast('Desmos is not loaded (offline?)'); return; }
      toast('Opening Desmos…'); whenDesmosReady(() => putInDesmos(lines, opts)); return;
    }
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
      const sh = el.querySelector(':scope > .bw-shield'); if (sh) sh.style.top = el.querySelector('.bw-head').offsetHeight * z + 'px';
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
      const offline = '<div style="padding:18px;font-size:12px;color:#6b7280;">Offline — paste Desmos photo with Ctrl+V.</div>';
      if (typeof window.Desmos !== 'undefined') {
        // Desmos runs in its own iframe. Board zoom is a CSS scale, and inside a scaled box Desmos misjudges its size
        // and mouse positions (at a distance it switched to "narrow" mode with only its own keypad). An iframe always
        // sees its real size; the browser maps the zoom for it.
        const frame = document.createElement('iframe');
        frame.className = 'desmos-frame'; frame.title = 'Desmos';
        const src = (document.querySelector('script[src*="desmos.com/api"]') || {}).src || '';
        frame.srcdoc = `<!DOCTYPE html><html><head><meta charset="utf-8"><style>html,body{margin:0;height:100%;overflow:hidden;background:#fff}#c{position:absolute;inset:0}</style><script src="${src}"><\/script></head><body><div id="c"></div></body></html>`;
        mount.appendChild(frame);
        frame.addEventListener('load', () => {
          const w = frame.contentWindow;
          if (!el.isConnected || !w) return;
          if (!w.Desmos) { mount.innerHTML = offline; return; }
          desmosCalc = w.Desmos.GraphingCalculator(w.document.getElementById('c'), {
            degreeMode: settings.desmosAngles === 'deg',
            clearIntoDegreeMode: settings.desmosAngles === 'deg',
            projectorMode: zenOn && settings.zenProj
          });
          if (savedDesmosState) desmosCalc.setState(savedDesmosState, { allowUndo: false });
          lastDesmosJson = canon(shareableDesmos(desmosCalc.getState()));
          rememberDesmosIds(desmosCalc.getState());
          desmosCalc.observeEvent('change', onLocalDesmosChange);
          try { desmosCalc.observe('selectedExpressionId', onDesmosSelectionChange); } catch {}
          w.addEventListener('keydown', (ev) => {
            if (ev.key === 'Escape') setActiveWin(null);
            if ((ev.ctrlKey || ev.metaKey) && ['Equal', 'NumpadAdd', 'Minus', 'NumpadSubtract', 'Digit0', 'Numpad0'].includes(ev.code)) {
              ev.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { code: ev.code, key: ev.key, ctrlKey: true }));
            }
          });
          // pinch / Ctrl+scroll inside Desmos zooms the board too, not the page
          w.addEventListener('wheel', (ev) => {
            if (!(ev.ctrlKey || ev.metaKey)) return;
            ev.preventDefault();
            const r = frame.getBoundingClientRect(), k = r.width / (frame.offsetWidth || r.width);
            ctrlWheelZoom(ev, r.left + ev.clientX * k, r.top + ev.clientY * k);
          }, { passive: false });
          w.document.addEventListener('gesturestart', (ev) => ev.preventDefault(), { passive: false });
          w.document.addEventListener('gesturechange', (ev) => ev.preventDefault(), { passive: false });
          w.addEventListener('pointerdown', () => { if (activeWin !== el) setActiveWin(el); }); // using it = it's the open window
          flushDesmosReady();
        });
      } else mount.innerHTML = offline;
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
  document.getElementById('tabFormulasBtn').onclick = () => openDrawerTab('formulas');
  document.getElementById('tabDesmosBtn').onclick = () => { if (!document.getElementById('desmosBoardWidget')) spawnDesmosOnBoard(); else openDrawerTab('desmos'); };
  document.getElementById('tabPhotosBtn').onclick = () => openDrawerTab('photos');
  Object.keys(subBtns).forEach(k => { subBtns[k].onclick = () => openDrawerTab(k); });
  document.getElementById('closeDrawerBtn').onclick = closeDrawer;

  let filterTopic = 'ALL', filterDiff = 'all', filterStatus = 'any';
  // The "collection" = whatever the question picker filters currently show.
  function statusOk(q) {
    const st = progress[q.id] || {};
    if (filterStatus === 'starred') return !!st.starred;
    if (filterStatus === 'wrong') return !!st.wrong;
    if (filterStatus === 'new') return !st.solved && !st.wrong && !st.wrongCount;
    return true;
  }
  function inCollection(q) {
    if (filterTopic !== 'ALL' && q.topic !== filterTopic) return false;
    if (filterDiff !== 'all' && q.difficulty !== filterDiff) return false;
    return statusOk(q);
  }
  function collectionIdx() { return QUESTIONS.map((q, i) => i).filter(i => inCollection(QUESTIONS[i])); }
  function updateNavText() {
    const col = collectionIdx();
    const pos = col.indexOf(currentIndex);
    document.getElementById('qNavText').textContent = `${pos === -1 ? '–' : pos + 1} / ${col.length}`;
    if (document.getElementById('qPickerBackdrop').classList.contains('show')) renderPicker();
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
      b.classList.add('active'); if (b.dataset.diff === 'starred' || b.dataset.diff === 'wrong') { filterStatus = b.dataset.diff; filterDiff = 'all'; } else { filterDiff = b.dataset.diff; filterStatus = 'any'; } renderQuestionBrowser(); updateNavText();
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
    const im = new Image();
    im.onload = () => {
      pushUndo();
      const ratio = im.height / im.width || 0.55; const w = Math.min(460, im.width || 420);
      const pos = screenToWorld(window.innerWidth * 0.54, window.innerHeight * 0.28);
      const id = 'o_' + Date.now();
      objects.push({ id, own: clientId, type: 'image', src, x: pos.x, y: pos.y, w, h: w * ratio });
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
    if (boardClip) {
      const txt = e.clipboardData.getData('text/plain');
      if (txt === clipToken || (clipNoSys && !txt)) { e.preventDefault(); pasteClip(); }
    }
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

  const KEY_LABELS = { cursor: 'Hand', select: 'Select', pen: 'Pen', highlighter: 'Highlighter', laser: 'Laser', eraser: 'Eraser', text: 'Text', zen: 'Zen mode', formulas: 'Formulas', desmos: 'Desmos', photos: 'Photos', timer: 'Timer', react: 'Reactions' };
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

    populateTiramisuSettings();
    const km = document.getElementById('keybindsMount');
    km.innerHTML = Object.entries(settings.keybinds).map(([act, code]) => `
      <div class="set-row"><span>${KEY_LABELS[act] || act}</span><button class="keybind-btn" data-act="${act}">${code.replace('Key', '').replace('Digit', '')}</button></div>
    `).join('');
    km.querySelectorAll('.keybind-btn').forEach(b => {
      b.onclick = () => { km.querySelectorAll('.keybind-btn').forEach(x => x.classList.remove('listening')); b.classList.add('listening'); b.textContent = 'Press a key'; listeningKeybind = b.dataset.act; };
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
  document.getElementById('resetSettingsBtn').onclick = () => { const mc = settings.myColor; settings = JSON.parse(JSON.stringify(DEFAULT_SETTINGS)); settings.myColor = mc; inkColor = mc; saveSettings(); renderPickerQuick(); populateSettingsUI(); renderColorPalette(); applyGrid(settings.defaultGrid); toast('Settings reset'); };

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
    if (e.key === 'Escape' && activeWin) { setActiveWin(null); return; }
    const ae = document.activeElement;
    if (ae && (ae.tagName === 'INPUT' || ae.tagName === 'SELECT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable ||
        (ae.closest && ae.closest('.board-widget, .dcg-container, .side-drawer, .modal')))) return; // typing in Desmos etc.

    if (picker.classList.contains('show')) {
      const d = /^Digit([1-8])$/.exec(e.code) || /^Numpad([1-8])$/.exec(e.code);
      if (d) { e.preventDefault(); const r = settings.quick[Number(d[1]) - 1]; if (r && pickerAt) sendReaction(pickerAt, r); closePicker(); return; }
      if (e.code === 'Escape' || e.code === settings.keybinds.react) { e.preventDefault(); closePicker(); return; }
    }
    if (e.code === settings.keybinds.react && !e.ctrlKey && !e.metaKey && !e.altKey) {
      e.preventDefault(); openPicker(lastBoardPtr.x, lastBoardPtr.y); return;
    }
    if (e.code === 'Space' && !spaceHeld) { spaceHeld = true; boardCanvas.classList.remove('pass-through'); boardCanvas.style.cursor = 'grab'; return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyZ') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyY') { e.preventDefault(); redo(); return; }
    if (e.code === 'Delete' || e.code === 'Backspace') { deleteSel(); return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyA') { e.preventDefault(); setTool('select'); clearSel(); multiSel = objects.filter(o => o.type !== 'pin').map(o => o.id); renderBoard(); return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyD') { e.preventDefault(); duplicateSel(); return; }
    if ((e.ctrlKey || e.metaKey) && e.code === 'KeyC' && !e.shiftKey) { if (selObjs().length && !(window.getSelection && String(window.getSelection()))) copySel(); return; }
    if (e.key === '?') { e.preventDefault(); openKeysHelp(); return; }
    if (e.key === 'Escape' && document.getElementById('keysHelp').classList.contains('show')) { document.getElementById('keysHelp').classList.remove('show'); return; }
    if (e.key === 'Escape' && (selectedId || multiSel.length)) { clearSel(); renderBoard(); return; }
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
      else if (e.code === kb.formulas) openDrawerTab('formulas');
      else if (e.code === kb.desmos) document.getElementById('tabDesmosBtn').click();
      else if (e.code === kb.photos) openPeek(peekIdx);
      else if (e.code === kb.timer) document.getElementById('timerBtn').click();
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

    if (settings.keybinds) delete settings.keybinds.gather; // "Bring everyone" was removed
    delete settings.allowBring;
    if (!settings.myColor) {
      let h = 0; for (const ch of clientId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      settings.myColor = PEOPLE_COLORS[h % PEOPLE_COLORS.length]; saveSettings();
    }
    inkColor = settings.myColor;
    renderPickerQuick();
    renderPickerStickers();
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
    /* ==================== TIRAMISU: people, ink ownership, picker, timer, follow, settings ==================== */
  const $ = (id) => document.getElementById(id);
  const PEOPLE_COLORS = ['#3D6BE0', '#F08A24', '#8E5BE8', '#E2559B', '#1C9AA0', '#7A4B32', '#5A8F2E'];
  const initial = (n) => (String(n || '?').trim()[0] || '?').toUpperCase();
  const people = {}; // cid -> { cid, pid, name, color, t, x, y, presence }
  function myColor() { return settings.myColor || PEOPLE_COLORS[0]; }
  function applyMyColorVars() {
    document.documentElement.style.setProperty('--me', myColor());
    document.documentElement.style.setProperty('--ink', inkColor);
    const dot = $('penInkDot'); if (dot) dot.style.background = inkColor;
  }
  function takenColors() { const now = Date.now(); return Object.values(people).filter(p => p.cid !== clientId && (p.presence || now - p.t < 30000)).map(p => p.color); }
  function hello() { if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'hello', payload: { cid: clientId, pid: peerId, name: myName(), color: myColor() } }); }
  function seePerson(d) {
    if (!d || !d.cid || d.cid === clientId) return;
    const isNew = !people[d.cid];
    const p = people[d.cid] || (people[d.cid] = { cid: d.cid });
    if (isNew) setTimeout(hello, 50);
    if (d.name) p.name = d.name; if (d.color) p.color = d.color; if (d.pid) p.pid = d.pid;
    p.t = Date.now();
    // Two people got the same automatic colour: the one with the larger id moves to a free one.
    // A colour someone picked by hand in Settings is never changed.
    if (!settings.myColorPicked && p.color && p.color.toLowerCase() === myColor().toLowerCase() && clientId > p.cid) {
      const used = new Set(takenColors().map(c => (c || '').toLowerCase()));
      const free = PEOPLE_COLORS.find(c => !used.has(c.toLowerCase()));
      if (free) {
        const old = myColor(); settings.myColor = free; saveSettings();
        if (String(inkColor).toLowerCase() === old.toLowerCase()) inkColor = free;
        renderColorPaletteNew(); setTimeout(() => { hello(); retrack(); }, 0);
      }
    }
    renderPeople();
  }
  function renderPeople() {
    const m = $('peopleMount'); if (!m) return;
    const now = Date.now();
    const list = Object.values(people).filter(p => p.presence || now - p.t < 30000);
    const me = `<button class="av" data-cid="${clientId}" style="background:${myColor()}" title="${escHtml(myName())} (you)">${escHtml(initial(myName()))}</button>`;
    m.innerHTML = roomChannel ? list.map(p => `<button class="av" data-cid="${p.cid}" style="background:${p.color || '#999'}" title="${escHtml(p.name)}">${escHtml(initial(p.name))}</button>`).join('') + me : '';
    m.querySelectorAll('.av').forEach(b => b.onclick = (e) => { e.stopPropagation(); openPersonMenu(b.dataset.cid, b); });
    if (window.__tiramisuFeel) popNewAvatars();
  }
  setInterval(() => { hello(); renderPeople(); }, 10000);

  // ---- menus ----
  function placeMenu(menu, anchor, alignRight) {
    const r = anchor.getBoundingClientRect();
    menu.classList.add('show');
    const w = menu.offsetWidth;
    menu.style.top = (r.bottom + 10) + 'px';
    menu.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, alignRight ? r.right - w : r.left)) + 'px';
    menu.style.right = 'auto';
  }
  const moreMenu = $('moreMenu');
  $('moreBtn').onclick = (e) => { e.stopPropagation(); const open = !moreMenu.classList.contains('show'); closeMenus(); if (open) { moreMenu.classList.add('show'); $('moreBtn').classList.add('active'); } };
  moreMenu.addEventListener('click', (e) => { if (e.target.closest('.mi')) setTimeout(closeMenus, 0); });
  function closeMenus() {
    ['moreMenu', 'personMenu', 'toolsSheet', 'timerPop'].forEach(id => $(id).classList.remove('show'));
    $('moreBtn').classList.remove('active'); $('phoneMoreTools').classList.remove('active');
  }
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest && e.target.closest('.menu, #moreBtn, #phoneMoreTools, #timerBtn, .av, #shapesBtn, #shapesMenu')) return;
    closeMenus();
  }, true);

  function openPersonMenu(cid, anchor) {
    const pm = $('personMenu');
    if (cid === clientId) {
      pm.innerHTML = `<div class="mi" style="cursor:default"><span class="av sm" style="background:${myColor()}">${escHtml(initial(myName()))}</span><b>${escHtml(myName())}</b><span class="mut">you</span></div><span class="menu-sep"></span>
        <button class="mi" data-act="color">Change my colour or name</button>`;
    } else {
      const p = people[cid] || {};
      const fol = following && following.cid === cid;
      pm.innerHTML = `<div class="mi" style="cursor:default"><span class="av sm" style="background:${p.color}">${escHtml(initial(p.name))}</span><b>${escHtml(p.name)}</b></div><span class="menu-sep"></span>
        <button class="mi" data-act="follow">${fol ? 'Stop following' : 'Follow ' + escHtml(p.name)}</button>
        <button class="mi" data-act="goto">Go to them once</button>`;
    }
    pm.querySelectorAll('[data-act]').forEach(b => b.onclick = () => {
      closeMenus();
      if (b.dataset.act === 'color') openSettings('inks');
      else if (b.dataset.act === 'follow') { if (following && following.cid === cid) stopFollow(); else startFollow(cid); }
      else if (b.dataset.act === 'goto') goToPerson(cid);
    });
    placeMenu(pm, anchor, true);
  }

  // ---- peer cursors (their colour, laser = red dot) ----
  // Cursors stay where people left them. After a minute without any activity they doze off (z z z),
  // and wake with a jolt when that person does something again.
  const SLEEP_MS = 60000;
  const curEls = new Map();
  const isAsleep = (p, now) => now - p.t > SLEEP_MS;
  function renderPeerCursorsNew() {
    const layer = $('cursorsLayer');
    const now = Date.now(), keep = new Set();
    Object.entries(peers).forEach(([key, p]) => {
      if (!Number.isFinite(p.wx)) return;
      const person = people[key];
      const here = person && (person.presence || now - person.t < 30000);
      if (!here && now - p.t > 5000) return;            // left the room
      if (now - p.t > 20 * 60000) return;               // gone for ages
      keep.add(key);
      let el = curEls.get(key);
      if (!el || !el.isConnected) {
        el = document.createElement('div'); el.className = 'peer-cursor';
        el.innerHTML = '<span class="pc-icon"></span><span class="peer-tag"></span><span class="zzz" aria-hidden="true"><i>z</i><i>z</i><i>z</i></span>';
        layer.appendChild(el); curEls.set(key, el);
      }
      const c = p.color || '#2A1D16';
      el.style.left = (p.wx * cam.z + cam.x) + 'px'; el.style.top = (p.wy * cam.z + cam.y) + 'px';
      const iconKey = (p.tool === 'laser' ? 'laser' : (p.cs || 'arrow')) + c;
      if (el._iconKey !== iconKey) {
        el._iconKey = iconKey;
        el.querySelector('.pc-icon').innerHTML = p.tool === 'laser'
          ? '<svg width="22" height="22" viewBox="0 0 24 24" style="margin:-11px 0 0 -11px"><circle cx="12" cy="12" r="9" fill="#E5484D" opacity=".25"/><circle cx="12" cy="12" r="5" fill="#E5484D" stroke="#fff" stroke-width="2"/></svg>'
          : cursorSvg(p.cs || 'arrow', c);
      }
      const tag = el.querySelector('.peer-tag');
      if (tag.textContent !== (p.name || '')) tag.textContent = p.name || '';
      tag.style.background = c;
      const asleep = isAsleep(p, now);
      if (el._asleep && !asleep && !calmMotion()) { el.classList.remove('wake'); void el.offsetWidth; el.classList.add('wake'); setTimeout(() => el.classList.remove('wake'), 600); }
      el.classList.toggle('asleep', asleep && !p.big); el._asleep = asleep;
      el.classList.toggle('big', !!p.big && now - p.t < 1200);
    });
    curEls.forEach((el, k) => { if (!keep.has(k)) { el.remove(); curEls.delete(k); } });
    document.querySelectorAll('#peopleMount .av[data-cid]').forEach(av => {
      const p = peers[av.dataset.cid]; av.classList.toggle('asleep', !!(p && isAsleep(p, now)));
    });
  }
  setInterval(() => { if (Object.keys(peers).length) renderPeerCursorsNew(); }, 1000);
  // I'm awake: any key, tap or scroll keeps my cursor fresh for the others, even without moving it
  // (typing in Desmos, reading the question, using the keyboard).
  let lastCurAt = 0, lastCurWire = null;
  const keepAwake = () => {
    if (!roomChannel || !lastCurWire || Date.now() - lastCurAt < 20000) return;
    lastCurAt = Date.now();
    roomChannel.send({ type: 'broadcast', event: 'cursor', payload: { ...lastCurWire, laserActive: false, t: Date.now() } });
  };
  ['keydown', 'pointerdown', 'wheel', 'input'].forEach(ev => window.addEventListener(ev, keepAwake, { capture: true, passive: true }));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) keepAwake(); });
  function curPayload(extra) { lastCurAt = Date.now(); lastCurWire = { sender: clientId, pid: peerId, name: myName(), color: myColor(), t: Date.now(), big: Date.now() < shakeUntil, cs: myCursorStyle(), ...extra }; return lastCurWire; }

  // ---- ink belongs to the person who drew it ----
  const isMine = (o) => !o.own || o.own === clientId;
  let eraseHintAt = 0;
  function eraseHint(pt) {
    if (Date.now() - eraseHintAt < 2500) return;
    const other = hitTest(pt, (o) => !isMine(o));
    if (!other) return;
    eraseHintAt = Date.now();
    const who = Object.values(people).find(p => p.cid === other.own);
    toast(`That's ${who ? who.name + "'s" : "someone else's"} ink. Your eraser only takes yours.`);
  }
  function renderColorPaletteNew() {
    const mount = $('colorPaletteMount');
    const list = [myColor(), ...settings.colors.filter(c => c.toLowerCase() !== myColor().toLowerCase())];
    if (!list.some(c => c.toLowerCase() === String(inkColor).toLowerCase())) inkColor = myColor();
    mount.innerHTML = list.map((c, i) => `<span class="cdot ${String(inkColor).toLowerCase() === c.toLowerCase() ? 'active' : ''}" data-color="${c}" title="${i ? 'Extra ink' : 'Your colour'}" style="background:${c};"></span>`).join('');
    mount.querySelectorAll('.cdot').forEach(dot => { dot.onclick = () => { inkColor = dot.dataset.color; renderColorPaletteNew(); }; });
    applyMyColorVars();
  }
  $('clearMineBtn').onclick = () => {
    const mine = objects.filter(o => o.own === clientId);
    if (!mine.length) { toast('You have no ink on this question'); return; }
    pushUndo(); objects = objects.filter(o => o.own !== clientId); selectedId = null; renderBoard(); saveWorkspace(); broadcastBoard();
  };
  function confirmBox(title, text, okLabel, fn) {
    $('confirmTitle').textContent = title; $('confirmText').textContent = text; $('confirmOk').textContent = okLabel;
    const bd = $('confirmBackdrop'); bd.classList.add('show');
    const close = () => bd.classList.remove('show');
    $('confirmCancel').onclick = close; bd.onclick = (e) => { if (e.target === bd) close(); };
    $('confirmOk').onclick = () => { close(); fn(); };
    setTimeout(() => $('confirmCancel').focus(), 0);
  }
  $('clearAllBtn').onclick = () => {
    if (!objects.length) { toast('The board is already empty'); return; }
    confirmBox('Clear the whole board?', "Everyone's ink, text and shapes on this question. You can undo it.", 'Clear all', () => {
      pushUndo(); objects = []; selectedId = null; renderBoard(); saveWorkspace(); broadcastBoard();
    });
  };

  // ---- pen tray: shows for drawing tools (desktop), on tapping the active pen (phone) ----
  let trayOpen = false;
  function updateTray() {
    const drawing = ['pen', 'highlighter', 'shape', 'text'].includes(tool);
    document.getElementById('inkStyleBar').classList.toggle('show', isPhone() ? (trayOpen && drawing) : drawing);
  }
  document.querySelectorAll('#mainToolbar .tbtn[data-tool]').forEach(b => {
    b.addEventListener('pointerdown', () => { b._wasActive = b.classList.contains('active'); });
    b.addEventListener('click', () => { if (isPhone()) trayOpen = b._wasActive ? !trayOpen : false; updateTray(); });
  });
  boardStage.addEventListener('pointerdown', () => { if (trayOpen) { trayOpen = false; updateTray(); } });

  // ---- phone: hide question, tools sheet ----
  $('qCollapseBtn').onclick = (e) => {
    e.stopPropagation();
    const c = $('questionCard').classList.toggle('collapsed');
    $('qCollapseBtn').textContent = c ? '▾' : '▴'; $('qCollapseBtn').title = c ? 'Show question' : 'Hide question';
  };
  $('phoneMoreTools').onclick = (e) => {
    e.stopPropagation();
    const s = $('toolsSheet'), open = !s.classList.contains('show'); closeMenus();
    if (open) { s.classList.add('show'); $('phoneMoreTools').classList.add('active'); }
  };
  document.querySelectorAll('[data-sheet-tool]').forEach(b => b.onclick = (e) => {
    e.stopPropagation(); const t = b.dataset.sheetTool; closeMenus();
    if (t === 'shapes') shapesMenu.classList.add('show');
    else if (t === 'react') openPicker(window.innerWidth / 2, window.innerHeight / 2);
    else setTool(t);
  });

  // ---- question picker ----
  const pickerBd = $('qPickerBackdrop');
  const TOPICS = [...new Set(QUESTIONS.map(q => q.topic))];
  const numOf = (q) => (String(q.num).match(/\d+/) || [''])[0];
  function segButtons(mount, opts, cur, onPick) {
    mount.innerHTML = opts.map(([v, l]) => `<button data-v="${v}" class="${v === cur ? 'on' : ''}">${l}</button>`).join('');
    mount.querySelectorAll('button').forEach(b => b.onclick = () => onPick(b.dataset.v));
  }
  function renderPicker() {
    const tm = $('qpTopics');
    const base = (q) => (filterDiff === 'all' || q.difficulty === filterDiff) && statusOk(q);
    tm.innerHTML = [['ALL', 'All topics', QUESTIONS.filter(base).length], ...TOPICS.map(t => [t, t, QUESTIONS.filter(q => q.topic === t && base(q)).length])]
      .map(([v, l, n]) => `<button data-v="${escHtml(v)}" class="${v === filterTopic ? 'on' : ''}">${escHtml(l)} <small>${n}</small></button>`).join('');
    tm.querySelectorAll('button').forEach(b => b.onclick = () => { filterTopic = b.dataset.v; afterFilter(); });
    segButtons($('qpDiff'), [['all', 'Any level'], ['easy', 'Easy'], ['medium', 'Medium'], ['hard', 'Hard']], filterDiff, (v) => { filterDiff = v; afterFilter(); });
    const wrongN = QUESTIONS.filter(q => progress[q.id] && progress[q.id].wrong).length;
    segButtons($('qpStatus'), [['any', 'Any'], ['new', 'Not tried'], ['wrong', `Wrong (${wrongN})`], ['starred', 'Starred']], filterStatus, (v) => { filterStatus = v; afterFilter(); });
    const col = collectionIdx();
    $('qpJump').placeholder = `Jump to #  ·  1–${col.length}`;
    const groups = [];
    col.forEach(i => { const q = QUESTIONS[i], key = q.topic + ' · ' + q.difficulty; let g = groups[groups.length - 1]; if (!g || g.key !== key) groups.push(g = { key, q, items: [] }); g.items.push(i); });
    $('qpList').innerHTML = groups.map(g => `<div class="qp-sec"><h4>${escHtml(g.q.topic)} <span class="mut">· ${g.q.difficulty[0].toUpperCase() + g.q.difficulty.slice(1)}</span></h4><div class="qp-grid">${g.items.map(i => {
      const q = QUESTIONS[i], st = progress[q.id] || {};
      const cls = i === currentIndex ? 'cur' : st.wrong ? 'bad' : st.solved ? 'ok' : '';
      return `<button class="qtile ${cls}" data-i="${i}" title="${escHtml(q.topic + ' · ' + q.num)}">${numOf(q)}${st.starred ? '<span class="st">★</span>' : ''}</button>`;
    }).join('')}</div></div>`).join('') || '<div class="mut" style="padding:20px 4px">Nothing matches these filters.</div>';
    $('qpList').querySelectorAll('.qtile').forEach(b => b.onclick = () => { closeQPicker(); switchQuestion(Number(b.dataset.i)); });
  }
  function afterFilter() { renderPicker(); renderQuestionBrowser(); updateNavText(); }
  function openQPicker() { closeMenus(); renderPicker(); pickerBd.classList.add('show'); const cur = $('qpList').querySelector('.qtile.cur'); if (cur) cur.scrollIntoView({ block: 'center' }); if (!isPhone() && !('ontouchstart' in window)) $('qpJump').focus(); }
  function closeQPicker() { pickerBd.classList.remove('show'); $('qpJump').value = ''; }
  $('openQuestionsBtn').onclick = () => pickerBd.classList.contains('show') ? closeQPicker() : openQPicker();
  $('qpClose').onclick = closeQPicker;
  pickerBd.onclick = (e) => { if (e.target === pickerBd) closeQPicker(); };
  $('qpJump').addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeQPicker(); return; }
    if (e.key !== 'Enter') return;
    const col = collectionIdx(), n = parseInt($('qpJump').value, 10);
    if (!(n >= 1 && n <= col.length)) { toast(`Pick a number from 1 to ${col.length}`); return; }
    closeQPicker(); switchQuestion(col[n - 1]);
  });
  $('qpRandom').onclick = () => { const col = collectionIdx().filter(i => i !== currentIndex); if (!col.length) return; closeQPicker(); switchQuestion(col[Math.floor(Math.random() * col.length)]); };
  window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pickerBd.classList.contains('show')) closeQPicker(); });

  // ---- shared timer ----
  let timer = { state: 'idle', left: 0, endAt: 0, dur: 0 }; // state: idle | run | pause | up
  let tpMinutes = 10, timerTick = null;
  const fmt = (ms) => { const s = Math.max(0, Math.ceil(ms / 1000)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
  function timerLeft() { return timer.state === 'run' ? timer.endAt - Date.now() : timer.left; }
  function paintTimer() {
    const bar = $('timerBar'), txt = $('timerText'), tg = $('timerToggle');
    bar.classList.toggle('up', timer.state === 'up'); bar.classList.toggle('paused', timer.state === 'pause');
    if (timer.state === 'idle') txt.textContent = 'Timer';
    else if (timer.state === 'up') txt.textContent = "Time's up";
    else txt.textContent = fmt(timerLeft());
    tg.style.display = (timer.state === 'run' || timer.state === 'pause') ? '' : 'none';
    tg.innerHTML = timer.state === 'pause' ? '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13l10.5-6.5z"/></svg>' : '<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><rect x="6.5" y="5.5" width="4" height="13" rx="1.2"/><rect x="13.5" y="5.5" width="4" height="13" rx="1.2"/></svg>';
    tg.title = timer.state === 'pause' ? 'Resume for everyone' : 'Pause for everyone';
    $('tpStart').textContent = timer.state === 'idle' ? 'Start for everyone' : 'Restart with this time';
    $('tpReset').style.display = timer.state === 'idle' ? 'none' : '';
    $('tpMin').textContent = `${tpMinutes} min`;
  }
  function beep() {
    if (settings.timerSound === false) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      [0, 0.28, 0.56].forEach(t0 => { const o = ac.createOscillator(), g = ac.createGain(); o.frequency.value = 880; o.connect(g); g.connect(ac.destination);
        g.gain.setValueAtTime(0.0001, ac.currentTime + t0); g.gain.exponentialRampToValueAtTime(0.25, ac.currentTime + t0 + 0.02); g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + t0 + 0.22);
        o.start(ac.currentTime + t0); o.stop(ac.currentTime + t0 + 0.25); });
    } catch {}
  }
  function runTimerLoop() {
    clearInterval(timerTick);
    if (timer.state === 'run') timerTick = setInterval(() => {
      if (timer.state === 'run' && timer.endAt - Date.now() <= 0) { timer = { ...timer, state: 'up', left: 0 }; clearInterval(timerTick); beep(); }
      paintTimer();
    }, 250);
    paintTimer();
  }
  function setTimer(next, send = true) {
    timer = next; runTimerLoop();
    if (send && roomChannel) roomChannel.send({ type: 'broadcast', event: 'timer', payload: { sender: peerId, name: myName(), ...timerWire() } });
  }
  const timerWire = () => ({ state: timer.state, left: Math.max(0, timerLeft()), dur: timer.dur });
  function recvTimer(p) {
    const left = Number(p.left) || 0;
    timer = { state: p.state, left, dur: p.dur, endAt: Date.now() + left };
    runTimerLoop();
  }
  $('timerBtn').onclick = (e) => {
    e.stopPropagation();
    const pop = $('timerPop'); const open = !pop.classList.contains('show'); closeMenus();
    if (timer.state === 'up') { setTimer({ state: 'idle', left: 0, dur: 0, endAt: 0 }); return; }
    if (open) { paintTimer(); placeMenu(pop, $('timerBar'), false); const r = $('timerBar').getBoundingClientRect(); pop.style.left = Math.max(8, Math.min(window.innerWidth - pop.offsetWidth - 8, r.left + r.width / 2 - pop.offsetWidth / 2)) + 'px'; if (r.top > window.innerHeight / 2) pop.style.top = (r.top - pop.offsetHeight - 10) + 'px'; }
  };
  $('timerToggle').onclick = (e) => {
    e.stopPropagation();
    if (timer.state === 'run') setTimer({ ...timer, state: 'pause', left: timerLeft() });
    else if (timer.state === 'pause') setTimer({ ...timer, state: 'run', endAt: Date.now() + timer.left });
  };
  $('timerPop').querySelectorAll('[data-min]').forEach(b => b.onclick = () => { tpMinutes = Number(b.dataset.min); paintTimer(); });
  $('tpLess').onclick = () => { tpMinutes = Math.max(1, tpMinutes - 1); paintTimer(); };
  $('tpMore').onclick = () => { tpMinutes = Math.min(180, tpMinutes + 1); paintTimer(); };
  $('tpStart').onclick = () => { const ms = tpMinutes * 60000; setTimer({ state: 'run', left: ms, dur: ms, endAt: Date.now() + ms }); closeMenus(); };
  $('tpReset').onclick = () => { setTimer({ state: 'idle', left: 0, dur: 0, endAt: 0 }); closeMenus(); };

  // ---- follow / go to / bring everyone ----
  let following = null;          // { cid, name, color }
  const followers = new Set();   // cids following me
  let lastCamSend = 0, camSendTimer = null, applyingRemoteCam = false;
  function viewWire() { return { cx: (window.innerWidth / 2 - cam.x) / cam.z, cy: (window.innerHeight / 2 - cam.y) / cam.z, z: cam.z, W: window.innerWidth, H: window.innerHeight }; }
  function applyView(v) {
    const fit = Math.min(window.innerWidth / (v.W || window.innerWidth), window.innerHeight / (v.H || window.innerHeight));
    const z = Math.max(0.2, Math.min(4, v.z * Math.min(1, fit)));
    applyingRemoteCam = true;
    cam = { x: window.innerWidth / 2 - v.cx * z, y: window.innerHeight / 2 - v.cy * z, z };
    applyCamera();
    applyingRemoteCam = false;
  }
  function sendCam() {
    if (!roomChannel || !followers.size) return;
    const now = Date.now();
    clearTimeout(camSendTimer);
    if (now - lastCamSend < 120) { camSendTimer = setTimeout(sendCam, 130); return; }
    lastCamSend = now;
    roomChannel.send({ type: 'broadcast', event: 'cam', payload: { cid: clientId, ...viewWire() } });
  }
  function onCameraMoved() {
    repositionFx();
    if (following && !applyingRemoteCam) stopFollow();
    sendCam();
  }
  function startFollow(cid) {
    const p = people[cid]; if (!p || !roomChannel) return;
    following = { cid, name: p.name, color: p.color };
    roomChannel.send({ type: 'broadcast', event: 'follow', payload: { from: clientId, to: cid, on: true } });
    const fr = $('followFrame'); fr.style.borderColor = p.color; fr.classList.add('show');
    $('followPill').innerHTML = `<span class="av sm" style="background:${p.color}">${escHtml(initial(p.name))}</span>Following ${escHtml(p.name)}<button class="tbtn tb bordered" id="stopFollowBtn">Stop</button>`;
    $('stopFollowBtn').onclick = stopFollow;
  }
  function stopFollow() {
    if (!following) return;
    if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'follow', payload: { from: clientId, to: following.cid, on: false } });
    following = null; $('followFrame').classList.remove('show');
  }
  function goToPerson(cid) {
    const p = Object.values(peers).find(x => x.sender === cid) || peers[cid];
    if (!p || !Number.isFinite(p.wx)) { toast('Wait until they move their cursor'); return; }
    applyView({ cx: p.wx, cy: p.wy, z: cam.z });
  }
  function toastAction(msg, label, fn, ms = 6000) {
    const t = $('toast');
    t.innerHTML = `${escHtml(msg)}<button class="tbtn tb bordered">${escHtml(label)}</button>`;
    t.querySelector('button').onclick = () => { t.classList.remove('show'); fn(); };
    t.classList.add('show'); clearTimeout(t._id); t._id = setTimeout(() => t.classList.remove('show'), ms);
  }
  // ---- room events for all of the above ----
  function wireTiramisuRoom(ch) {
    ch.on('broadcast', { event: 'hello' }, ({ payload }) => seePerson(payload))
      .on('broadcast', { event: 'timer' }, ({ payload }) => { if (payload.sender !== peerId) recvTimer(payload); })
      .on('broadcast', { event: 'timer_req' }, ({ payload }) => { if (payload.sender !== peerId && timer.state !== 'idle') ch.send({ type: 'broadcast', event: 'timer', payload: { sender: peerId, ...timerWire() } }); })
      .on('broadcast', { event: 'follow' }, ({ payload }) => { if (payload.to !== clientId) return; if (payload.on) { followers.add(payload.from); lastCamSend = 0; sendCam(); const p = people[payload.from]; if (p) toast(`${p.name} is following your view`); } else followers.delete(payload.from); })
      .on('broadcast', { event: 'cam' }, ({ payload }) => { if (following && payload.cid === following.cid) applyView(payload); })
      .on('broadcast', { event: 'bye' }, ({ payload }) => { delete people[payload.cid]; if (following && following.cid === payload.cid) stopFollow(); renderPeople(); });
  }
  function onPresenceSync(st) {
    const seen = new Set();
    Object.values(st).flat().forEach(u => { if (!u.cid) return; seen.add(u.cid); seePerson(u); if (people[u.cid]) people[u.cid].presence = true; });
    Object.values(people).forEach(p => { if (p.presence && !seen.has(p.cid)) { delete people[p.cid]; if (following && following.cid === p.cid) stopFollow(); } });
    renderPeople();
  }
  function onRoomJoined() { hello(); renderPeople(); roomChannel.send({ type: 'broadcast', event: 'timer_req', payload: { sender: peerId } }); }
  function onRoomLeft() { Object.keys(people).forEach(k => delete people[k]); followers.clear(); if (following) { following = null; $('followFrame').classList.remove('show'); } renderPeople(); }
  window.addEventListener('pagehide', () => { if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'bye', payload: { cid: clientId } }); });

  // ---- settings: tabs, colours, name, reactions ----
  const TAB_TITLES = { inks: 'Inks', pen: 'Pen & touch', board: 'Board', keys: 'Shortcuts', room: 'Room', react: 'Reactions' };
  function showSettingsTab(t) {
    document.querySelectorAll('.snav').forEach(b => b.classList.toggle('on', b.dataset.stab === t));
    document.querySelectorAll('.spane').forEach(p => p.classList.toggle('on', p.dataset.spane === t));
    $('settingsTabTitle').textContent = TAB_TITLES[t] || 'Settings';
  }
  document.querySelectorAll('.snav').forEach(b => b.onclick = () => showSettingsTab(b.dataset.stab));
  function openSettings(tab) { closeMenus(); populateSettingsUI(); showSettingsTab(tab || 'inks'); settingsBackdrop.classList.add('show'); }
  $('openSettingsBtn').onclick = () => openSettings('inks');
  function renderMyColorSwatches() {
    const taken = Object.values(people).filter(p => p.cid !== clientId && (p.presence || Date.now() - p.t < 30000));
    $('setMyColorMount').innerHTML = PEOPLE_COLORS.map(c => {
      const who = taken.find(p => (p.color || '').toLowerCase() === c.toLowerCase());
      const on = myColor().toLowerCase() === c.toLowerCase();
      return `<button class="sw ${on ? 'on' : ''} ${who ? 'taken' : ''}" data-c="${c}" style="background:${c}" title="${who ? escHtml(who.name) + ' has this one' : on ? 'Your colour' : 'Use this colour'}" aria-label="${c}">${who ? `<span class="av" style="background:${c}">${escHtml(initial(who.name))}</span>` : ''}</button>`;
    }).join('');
    $('setMyColorMount').querySelectorAll('.sw').forEach(b => b.onclick = () => {
      if (b.classList.contains('taken')) { toast(b.title); return; }
      const old = myColor(); settings.myColor = b.dataset.c; settings.myColorPicked = true; saveSettings();
      if (String(inkColor).toLowerCase() === old.toLowerCase()) inkColor = settings.myColor;
      renderMyColorSwatches(); renderColorPaletteNew(); renderPeople(); hello(); retrack(); renderCursorPicker();
    });
  }
  function renderExtraInks() {
    const m = $('setColorsMount');
    m.innerHTML = settings.colors.map((c, i) => `<label class="sw" style="background:${c}" title="Tap to change"><input type="color" value="${c}" data-i="${i}" /></label>`).join('')
      + (settings.colors.length < 6 ? '<button class="sw sw-add" id="addInkBtn" title="Add an ink">+</button>' : '')
      + (settings.colors.length > 1 ? '<button class="tbtn tb" id="removeInkBtn">Remove last</button>' : '');
    m.querySelectorAll('input[type=color]').forEach(inp => {
      inp.oninput = (e) => { inp.parentElement.style.background = e.target.value; };
      inp.onchange = (e) => { const i = Number(inp.dataset.i), was = settings.colors[i]; settings.colors[i] = e.target.value; if (String(inkColor).toLowerCase() === String(was).toLowerCase()) inkColor = e.target.value; saveSettings(); renderColorPaletteNew(); renderExtraInks(); };
    });
    const add = $('addInkBtn'); if (add) add.onclick = () => { settings.colors.push('#2A1D16'); saveSettings(); renderExtraInks(); renderColorPaletteNew(); };
    const rm = $('removeInkBtn'); if (rm) rm.onclick = () => { settings.colors.pop(); saveSettings(); renderExtraInks(); renderColorPaletteNew(); };
  }
  const EMOJI_BANK = '🤯 🔥 👏 😂 🤔 😭 💀 ❤️ 👍 👎 🙌 💯 ✅ ❌ ⭐ 🎉 😮 😅 🥲 😎 🤓 🧐 😴 🙃 😬 🤝 👀 💡 ⚡ 🚀 🧠 📐 📏 ✏️ 🍰 ☕ 🐢 🐇 🎯 🏆 🫠 🥳 😤 😳 🤡 👻 🙏 💪 ✨ 🌀 ➕ ➖ ✖️ ➗ ❓ ❗ 💤 🔁 ⏰ 🫡'.split(' ');
  let quickSlot = 0;
  function renderQuickEditor() {
    $('setQuickMount').innerHTML = settings.quick.map((e, i) => `<button class="qslot ${i === quickSlot ? 'on' : ''}" data-i="${i}">${e}</button>`).join('');
    $('setQuickMount').querySelectorAll('.qslot').forEach(b => b.onclick = () => { quickSlot = Number(b.dataset.i); renderQuickEditor(); });
    $('setEmojiGrid').innerHTML = EMOJI_BANK.map(e => `<button data-e="${e}">${e}</button>`).join('');
    $('setEmojiGrid').querySelectorAll('button').forEach(b => b.onclick = () => {
      settings.quick[quickSlot] = b.dataset.e; quickSlot = (quickSlot + 1) % settings.quick.length; saveSettings(); renderQuickEditor(); renderPickerQuick();
    });
  }
  function renderPickerQuick() {
    const pk = $('reactPicker');
    pk.querySelectorAll('button[data-r]').forEach(b => b.remove());
    const sep = pk.querySelector('.tsep');
    settings.quick.forEach(e => { const b = document.createElement('button'); b.dataset.r = e; b.textContent = e; pk.insertBefore(b, sep); });
  }
  function retrack() { if (roomChannel) try { roomChannel.track({ id: peerId, cid: clientId, name: myName(), color: myColor() }); } catch {} }
  function populateTiramisuSettings() {
    renderMyColorSwatches(); renderExtraInks(); renderQuickEditor(); renderStickerSettings();
    $('setNameInput').value = myName();
    $('setHoldReact').checked = settings.holdReact !== false;
    $('setTimerSound').checked = settings.timerSound !== false;
    $('setTapUndo').checked = settings.tapUndo !== false;
    $('setScribbleErase').checked = settings.scribbleErase !== false;
    renderCursorPicker();
  }
  $('setHoldReact').onchange = (e) => { settings.holdReact = e.target.checked; saveSettings(); };
  $('setTimerSound').onchange = (e) => { settings.timerSound = e.target.checked; saveSettings(); };
  $('setTapUndo').onchange = (e) => { settings.tapUndo = e.target.checked; saveSettings(); };
  $('setScribbleErase').onchange = (e) => { settings.scribbleErase = e.target.checked; saveSettings(); };
  $('setNameInput').onchange = (e) => {
    const v = e.target.value.trim().slice(0, 24); if (!v) { e.target.value = myName(); return; }
    $('roomNameInput').value = v; localStorage.setItem('sat_wb_name', v); renderPeople(); hello(); retrack();
  };
  $('settingsRoomBtn').onclick = () => { settingsBackdrop.classList.remove('show'); $('openRoomBtn').click(); };
  $('roomNameInput').addEventListener('change', () => { renderPeople(); hello(); retrack(); });


  // ---- Shake to point: wiggle the mouse fast and your cursor swells up on everyone's screen ----
  let shakeUntil = 0;
  const shakeTrail = [];
  const meBig = document.createElement('div'); meBig.id = 'meBig'; document.body.appendChild(meBig);
  function paintMeBig(x, y) {
    meBig.innerHTML = cursorSvg(myCursorStyle(), myColor());
    meBig.style.left = x + 'px'; meBig.style.top = y + 'px';
  }
  boardStage.addEventListener('pointermove', (e) => {
    if (e.pointerType === 'touch') return;
    const now = Date.now();
    shakeTrail.push({ x: e.clientX, t: now });
    while (shakeTrail.length && now - shakeTrail[0].t > 550) shakeTrail.shift();
    // count direction flips on the x axis, ignoring wobbles shorter than 18px
    let flips = 0, dir = 0, legStart = shakeTrail.length ? shakeTrail[0].x : 0, dist = 0;
    for (let i = 1; i < shakeTrail.length; i++) {
      const dx = shakeTrail[i].x - shakeTrail[i - 1].x; dist += Math.abs(dx);
      const d = Math.sign(dx); if (!d) continue;
      if (dir && d !== dir && Math.abs(shakeTrail[i - 1].x - legStart) > 18) { flips++; legStart = shakeTrail[i - 1].x; }
      if (!dir || d !== dir) dir = d;
    }
    const wasBig = now < shakeUntil;
    if (flips >= 4 && dist > 500) shakeUntil = now + 700;
    const big = now < shakeUntil;
    if (big) { paintMeBig(e.clientX, e.clientY); meBig.classList.add('on'); }
    if (big && !wasBig && roomChannel) { // tell the room right away, don't wait for the next cursor tick
      lastCursorSend = now; const w = screenToWorld(e.clientX, e.clientY);
      roomChannel.send({ type: 'broadcast', event: 'cursor', payload: curPayload({ wx: w.x, wy: w.y, tool, laserActive }) });
    }
  }, true);
  setInterval(() => {
    if (meBig.classList.contains('on') && Date.now() >= shakeUntil) {
      meBig.classList.remove('on');
      if (roomChannel && lastCurWire) roomChannel.send({ type: 'broadcast', event: 'cursor', payload: { ...lastCurWire, big: false, laserActive: false, t: Date.now() } });
    }
  }, 120);
  // ---- Cursor styles: everyone sees yours. The tip is always at the top-left (2,2), so pointing stays exact. ----
  const CURSOR_STYLES = [['arrow', 'Arrow'], ['plane', 'Paper plane'], ['pencil', 'Pencil'], ['spoon', 'Spoon'], ['cake', 'Tiramisu']];
  function cursorSvg(style, c, size = 24) {
    const K = '#2A1D16', S = `stroke="${K}" stroke-width="2" stroke-linejoin="round"`;
    let body;
    if (style === 'plane') body = `<path d="M2 2L22 9.5 13 12.5 9.5 22z" fill="${c}" ${S}/><path d="M2 2L13 12.5" fill="none" stroke="${K}" stroke-width="1.6" stroke-linecap="round"/>`;
    else if (style === 'pencil') body = `<path d="M10 4.8L21.6 16.4 16.4 21.6 4.8 10z" fill="${c}" ${S}/><path d="M21.6 16.4l1.4 1.4a1.6 1.6 0 010 2.3l-2.9 2.9a1.6 1.6 0 01-2.3 0L16.4 21.6z" fill="#F4A6B7" ${S}/><path d="M2 2L10 4.8 4.8 10z" fill="#F5D9B0" ${S}/><path d="M2 2l3.1 1.1L3.1 5.1z" fill="${K}"/>`;
    else if (style === 'spoon') body = `<path d="M10.5 10.5L21 21" stroke="${K}" stroke-width="5.4" stroke-linecap="round"/><path d="M10.5 10.5L21 21" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><ellipse cx="6.6" cy="6.6" rx="6" ry="4.1" transform="rotate(45 6.6 6.6)" fill="${c}" ${S}/><ellipse cx="5.8" cy="5.8" rx="2.4" ry="1.3" transform="rotate(45 5.8 5.8)" fill="#fff" opacity=".55"/>`;
    else if (style === 'cake') body = `<path d="M2 2L21.5 10.5 10.5 21.5z" fill="#E9B977" ${S}/><path d="M15.6 7.9L7.9 15.6" stroke="#FFF4E0" stroke-width="3.2"/><path d="M19.2 9.5L9.5 19.2" stroke="#7A4B32" stroke-width="3"/><path d="M2 2L21.5 10.5 10.5 21.5z" fill="none" ${S}/><circle cx="17.6" cy="17.6" r="2.6" fill="${c}" ${S}/>`;
    else body = `<path d="M2 2l15 8.2-6.6 1.6L7 18.5z" fill="${c}" ${S}/>`;
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" style="overflow:visible">${body}</svg>`;
  }
  function myCursorStyle() { return CURSOR_STYLES.some(([k]) => k === settings.cursorStyle) ? settings.cursorStyle : 'arrow'; }
  function renderCursorPicker() {
    const m = document.getElementById('setCursorMount'); if (!m) return;
    m.innerHTML = CURSOR_STYLES.map(([k, label]) => `<button class="curpick ${k === myCursorStyle() ? 'on' : ''}" data-k="${k}" title="${label}"><span>${cursorSvg(k, myColor(), 34)}</span><small>${label}</small></button>`).join('');
    m.querySelectorAll('.curpick').forEach(b => b.onclick = () => {
      settings.cursorStyle = b.dataset.k; saveSettings(); renderCursorPicker();
      if (roomChannel && lastCurWire) roomChannel.send({ type: 'broadcast', event: 'cursor', payload: { ...lastCurWire, cs: settings.cursorStyle, laserActive: false, big: false, t: Date.now() } });
    });
  }

  // ---- Scribble to erase: scratch back and forth over your own ink with the pen and it's gone ----
  function scribbleTargets(s) {
    const P = s.points; if (!P || P.length < 12) return null;
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, L = 0;
    P.forEach((p, i) => { x0 = Math.min(x0, p.x); y0 = Math.min(y0, p.y); x1 = Math.max(x1, p.x); y1 = Math.max(y1, p.y); if (i) L += Math.hypot(p.x - P[i - 1].x, p.y - P[i - 1].y); });
    const w = x1 - x0, h = y1 - y0, ext = Math.max(w, h);
    if (ext < 14 / cam.z || L < 3.2 * ext) return null;
    const ax = w >= h ? 'x' : 'y', span = ax === 'x' ? w : h, minLeg = span * 0.25;
    let flips = 0, dir = 0, legStart = P[0][ax];
    for (let i = 1; i < P.length; i++) {
      const d = Math.sign(P[i][ax] - P[i - 1][ax]); if (!d) continue;
      if (dir && d !== dir && Math.abs(P[i - 1][ax] - legStart) > minLeg) { flips++; legStart = P[i - 1][ax]; }
      if (!dir || d !== dir) dir = d;
    }
    if (flips < 5) return null; // a scratch-out goes back and forth at least three times
    const pad = (s.width || 3) * 1.5, bx0 = x0 - pad, by0 = y0 - pad, bx1 = x1 + pad, by1 = y1 + pad;
    const inBox = (p) => p.x >= bx0 && p.x <= bx1 && p.y >= by0 && p.y <= by1;
    return objects.filter(o => {
      if (o === s || o.id === s.id || ['pin', 'grid', 'image'].includes(o.type)) return false;
      if (o.type === 'stroke') { const pts = o.points || []; return pts.length && pts.filter(inBox).length / pts.length >= 0.6; }
      let b; try { b = getBounds(o); } catch { return false; }
      return b && inBox({ x: b.x + b.w / 2, y: b.y + b.h / 2 }) && b.w <= (bx1 - bx0) * 1.3 && b.h <= (by1 - by0) * 1.3;
    });
  }
  // Called when a pen stroke ends. Returns true when the stroke was a scratch-out (and has been handled).
  function tryScribbleErase(s) {
    if (settings.scribbleErase === false || !s || s.type !== 'stroke') return false;
    const hits = scribbleTargets(s);
    if (!hits || !hits.length) return false;
    const mine = hits.filter(isMine), others = hits.filter(o => !isMine(o));
    if (!mine.length && !others.length) return false;
    inkSeen.delete(s.id); // the scribble itself just disappears; what it covered crumbles
    const gone = new Set(mine.map(o => o.id).concat(s.id));
    objects = objects.filter(o => !gone.has(o.id));
    if (others.length && !mine.length) {
      const who = Object.values(people).find(p => p.cid === others[0].own);
      toast(`That's ${who ? who.name + "'s" : "someone else's"} ink. Scribbling only erases yours.`);
    }
    return true;
  }
  window.__cursorSvg = cursorSvg;
  window.__tiramisu = { people, timer: () => timer, following: () => following, followers, cid: () => clientId, objects: () => objects, peers: () => peers, shakeUntil: () => shakeUntil };

  /* ==================== TELEGRAM STICKERS (via Supabase function tg-stickers) ==================== */
  const STK_MAX = 24;
  function stickerFn() {
    const u = (settings.sbUrl || (window.APP_CONFIG && window.APP_CONFIG.SUPABASE_URL) || '').trim().replace(/\/+$/, '');
    return u ? u + '/functions/v1/tg-stickers' : '';
  }
  const stkUrl = (fileId) => `${stickerFn()}?file=${encodeURIComponent(fileId)}`;
  const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);
  let lottieP = null;
  function loadLottie() {
    if (window.lottie) return Promise.resolve(window.lottie);
    if (!lottieP) lottieP = new Promise((res, rej) => { const sc = document.createElement('script'); sc.src = 'https://cdn.jsdelivr.net/npm/lottie-web@5.12.2/build/player/lottie_light.min.js'; sc.onload = () => res(window.lottie); sc.onerror = rej; document.head.appendChild(sc); });
    return lottieP;
  }
  const lottieData = new Map();
  function getLottie(id) { if (!lottieData.has(id)) lottieData.set(id, fetch(stkUrl(id)).then(r => { if (!r.ok) throw new Error('sticker ' + r.status); return r.json(); })); return lottieData.get(id); }
  // A small still picture for grids and the picker.
  function stickerThumb(st) {
    const img = document.createElement('img');
    img.alt = st.emoji || 'sticker'; img.loading = 'lazy'; img.draggable = false;
    img.src = stkUrl(st.kind === 'static' ? st.id : (st.thumb || st.id));
    return img;
  }
  // The full moving sticker for a reaction.
  function stickerFull(st, box) {
    if (st.kind === 'video' && !(isSafari && st.thumb)) {
      const v = document.createElement('video');
      v.src = stkUrl(st.id); v.autoplay = true; v.muted = true; v.loop = true; v.playsInline = true; v.setAttribute('playsinline', '');
      box.appendChild(v); v.play().catch(() => {});
    } else if (st.kind === 'tgs') {
      const holder = document.createElement('div'); box.appendChild(holder);
      Promise.all([loadLottie(), getLottie(st.id)]).then(([L, data]) => { if (holder.isConnected) L.loadAnimation({ container: holder, renderer: 'svg', loop: true, autoplay: true, animationData: data }); })
        .catch(() => { holder.remove(); if (st.thumb) box.appendChild(stickerThumb(st)); });
    } else box.appendChild(stickerThumb(st));
  }
  function floatSticker(wx, wy, st, name) {
    if (!st || !st.id || !stickerFn()) return;
    const d = document.createElement('div'); d.className = 'fx-sticker';
    stickerFull(st, d); fxLayer.appendChild(d); anchorFx(d, wx, wy, 0, 0); setTimeout(() => d.remove(), 2900);
    if (name) {
      const n = document.createElement('div'); n.className = 'fx-name'; n.textContent = name;
      fxLayer.appendChild(n); anchorFx(n, wx, wy, 0, 34); setTimeout(() => n.remove(), 2400);
    }
  }
  function sendSticker(pt, st) {
    const wire = { id: st.id, kind: st.kind, thumb: st.thumb || null, emoji: st.emoji || '' };
    floatSticker(pt.x, pt.y, wire, null);
    if (roomChannel) roomChannel.send({ type: 'broadcast', event: 'react', payload: { sender: peerId, questionId: currentQ().id, wx: pt.x, wy: pt.y, sticker: wire, name: myName() } });
  }
  function renderPickerStickers() {
    const m = document.getElementById('rpStickers'); if (!m) return;
    const list = stickerFn() ? (settings.stickers || []) : [];
    m.innerHTML = ''; m.classList.toggle('has', list.length > 0);
    list.forEach((st, i) => { const b = document.createElement('button'); b.dataset.stk = i; b.title = st.emoji || 'Sticker'; b.appendChild(stickerThumb(st)); m.appendChild(b); });
  }

  // ---- settings: load packs, pick favourites ----
  let stkPack = null;
  const stkStatus = (t) => { document.getElementById('stkStatus').textContent = t || ''; };
  const hasStk = (uid) => (settings.stickers || []).some(s => s.uid === uid);
  function renderStickerSettings() {
    document.getElementById('stkCount').textContent = `${(settings.stickers || []).length} / ${STK_MAX}`;
    const mine = document.getElementById('stkMine'); mine.innerHTML = '';
    (settings.stickers || []).forEach((st, i) => {
      const b = document.createElement('button'); b.title = 'Remove from picker'; b.appendChild(stickerThumb(st));
      const x = document.createElement('span'); x.className = 'x'; x.textContent = '✕'; b.appendChild(x);
      b.onclick = () => { settings.stickers.splice(i, 1); saveSettings(); renderStickerSettings(); renderPickerStickers(); };
      mine.appendChild(b);
    });
    if (!(settings.stickers || []).length) mine.innerHTML = '';
    const packs = document.getElementById('stkPacks');
    packs.innerHTML = (settings.stickerPacks || []).map(p => `<button data-p="${escHtml(p)}" class="${stkPack && stkPack.name === p ? 'on' : ''}">${escHtml(p)}</button>`).join('');
    packs.querySelectorAll('button').forEach(b => b.onclick = () => loadPack(b.dataset.p));
    document.getElementById('stkPackTitle').textContent = stkPack ? `${stkPack.title} · tap to add` : '';
    const grid = document.getElementById('stkPackGrid'); grid.innerHTML = '';
    if (stkPack) stkPack.stickers.forEach(st => {
      const b = document.createElement('button'); b.title = st.emoji || ''; b.classList.toggle('on', hasStk(st.uid)); b.appendChild(stickerThumb(st));
      b.onclick = () => {
        settings.stickers = settings.stickers || [];
        if (hasStk(st.uid)) settings.stickers = settings.stickers.filter(s => s.uid !== st.uid);
        else if (settings.stickers.length >= STK_MAX) { toast(`Picker holds ${STK_MAX} stickers. Remove one first.`); return; }
        else settings.stickers.push({ id: st.id, uid: st.uid, kind: st.kind, thumb: st.thumb, emoji: st.emoji });
        saveSettings(); renderStickerSettings(); renderPickerStickers();
      };
      grid.appendChild(b);
    });
  }
  async function loadPack(raw) {
    const fn = stickerFn();
    if (!fn) { stkStatus('Stickers need the room server. Set it up under Room first.'); return; }
    const name = String(raw || '').trim(); if (!name) { stkStatus('Paste a pack link first.'); return; }
    stkStatus('Loading…');
    try {
      const r = await fetch(`${fn}?set=${encodeURIComponent(name)}`);
      const data = await r.json().catch(() => ({}));
      if (!r.ok) {
        stkStatus(data.error === 'no_token' ? 'The sticker bot is not set up yet (TELEGRAM_BOT_TOKEN is missing on the server).'
          : data.error === 'bad_name' ? "That doesn't look like a pack link. It should look like t.me/addstickers/SomeName."
          : data.error === 'not_found' ? 'Telegram has no pack with that name.' : `Couldn't load it (${r.status}).`);
        return;
      }
      stkPack = data; stkStatus(`${data.stickers.length} stickers`);
      settings.stickerPacks = [data.name, ...(settings.stickerPacks || []).filter(p => p !== data.name)].slice(0, 8);
      saveSettings(); document.getElementById('stkPackInput').value = ''; renderStickerSettings();
    } catch (e) { stkStatus("Couldn't reach the server. Check your connection."); }
  }
  document.getElementById('stkLoadBtn').onclick = () => loadPack(document.getElementById('stkPackInput').value);
  document.getElementById('stkPackInput').addEventListener('keydown', (e) => { if (e.key === 'Enter') loadPack(e.target.value); });

  /* ==================== FEEL: bounce, pop, shake, crumble, sticker-in, avatar pop ==================== */
  const calmMotion = () => window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function playAnim(el, cls) {
    if (!el || calmMotion()) return;
    el.classList.remove('anim-pick', 'anim-right', 'anim-wrong', 'anim-in');
    void el.offsetWidth; // restart the animation if it's already running
    el.classList.add(cls);
    el.addEventListener('animationend', () => el.classList.remove(cls), { once: true });
  }
  // Answers: bounce on a new pick, pop when right, shake when wrong. Runs for everyone in the room.
  let lastAnswerLook = '';
  function animateAnswer() {
    const q = currentQ(), st = answerState && answerState.qid === q.id ? answerState : null;
    const look = st ? `${q.id}|${st.pick || ''}|${st.result || ''}` : `${q.id}||`;
    const prev = lastAnswerLook; lastAnswerLook = look;
    if (!st || look === prev) return;
    if (prev.split('|')[0] !== q.id && Date.now() - cardArrivedAt < 900) return; // the state that comes with a question you just opened
    const cls = st.result === 'correct' ? 'anim-right' : st.result === 'wrong' ? 'anim-wrong' : 'anim-pick';
    if (q.type === 'mcq') { if (st.pick) playAnim(document.querySelector(`#qChoices .choice-chip[data-choice="${st.pick}"]`), cls); }
    else if (st.result) playAnim(document.getElementById('gridInField'), cls);
  }
  // Ink that leaves the board crumbles: eraser, undo, clear, and the same on everyone's screen.
  let inkSeen = new Map(), inkSeenQ = null;
  function sampleObject(o, n) {
    const out = [];
    if (o.type === 'stroke' && Array.isArray(o.points) && o.points.length) {
      const P = o.points, seg = [0];
      for (let i = 1; i < P.length; i++) seg.push(seg[i - 1] + Math.hypot(P[i].x - P[i - 1].x, P[i].y - P[i - 1].y));
      const len = seg[seg.length - 1], k = Math.max(1, Math.min(n, Math.round(len * cam.z / 4)));
      const w = (o.width || 3) / 2;
      for (let j = 0; j < k; j++) { // evenly along the line, a little scattered across its width
        const d = len * (j + Math.random()) / k; let i = 1; while (i < seg.length - 1 && seg[i] < d) i++;
        const t = seg[i] > seg[i - 1] ? (d - seg[i - 1]) / (seg[i] - seg[i - 1]) : 0, a = P[i - 1], b = P[i] || a;
        out.push({ x: a.x + (b.x - a.x) * t + (Math.random() - .5) * w, y: a.y + (b.y - a.y) * t + (Math.random() - .5) * w });
      }
    } else {
      let b; try { b = getBounds(o); } catch { return out; }
      if (!b || ![b.x, b.y, b.w, b.h].every(Number.isFinite)) return out;
      for (let i = 0; i < n; i++) { const t = Math.random(); const side = i % 4;
        out.push(side === 0 ? { x: b.x + t * b.w, y: b.y } : side === 1 ? { x: b.x + b.w, y: b.y + t * b.h } : side === 2 ? { x: b.x + t * b.w, y: b.y + b.h } : { x: b.x, y: b.y + t * b.h }); }
    }
    return out;
  }
  function crumble(gone) {
    if (calmMotion() || !gone.length) return;
    const per = Math.max(4, Math.min(70, Math.floor(420 / gone.length)));
    const frag = document.createDocumentFragment();
    gone.forEach(o => sampleObject(o, per).forEach(p => {
      const d = document.createElement('i'); d.className = 'crumb';
      const sx = cam.x + p.x * cam.z, sy = cam.y + p.y * cam.z;
      if (sx < -20 || sy < -20 || sx > window.innerWidth + 20 || sy > window.innerHeight + 20) return;
      const size = Math.max(2.5, Math.min(9, (o.width || 3) * cam.z * (0.7 + Math.random() * 0.8)));
      d.style.cssText = `left:${sx}px;top:${sy}px;width:${size}px;height:${size}px;background:${o.color || '#2A1D16'};opacity:${o.alpha && o.alpha < 1 ? 0.5 : 1};` +
        `--dx:${(Math.random() * 36 - 18).toFixed(1)}px;--dy:${(24 + Math.random() * 46).toFixed(1)}px;--r:${Math.round(Math.random() * 240 - 120)}deg;animation-delay:${Math.round(Math.random() * 90)}ms`;
      frag.appendChild(d);
    }));
    fxLayer.appendChild(frag);
    setTimeout(() => fxLayer.querySelectorAll('.crumb').forEach(c => c.remove()), 1200); // safety net if animationend never fires
  }
  function watchInk() {
    const qid = currentQ().id;
    const now = new Map(objects.map(o => [o.id, o]));
    if (inkSeenQ === qid) {
      const gone = []; inkSeen.forEach((o, id) => { if (!now.has(id) && o.type !== 'pin') gone.push(o); });
      if (gone.length) crumble(gone);
    }
    inkSeen = now; inkSeenQ = qid;
  }
  fxLayer.addEventListener('animationend', (e) => { if (e.target.classList && e.target.classList.contains('crumb')) e.target.remove(); });
  // New question: the card lands like a sticker pressed onto the board.
  let lastCardQ = null, cardArrivedAt = 0;
  function animateCard() {
    const id = currentQ().id;
    if (lastCardQ !== id) cardArrivedAt = Date.now();
    if (lastCardQ !== null && lastCardQ !== id) playAnim(document.getElementById('questionCard'), 'anim-in');
    lastCardQ = id;
  }
  // Avatars pop in when someone joins.
  const avSeen = new Set();
  function popNewAvatars() {
    const m = document.getElementById('peopleMount'); if (!m) return;
    const here = new Set();
    m.querySelectorAll('.av').forEach(a => { here.add(a.dataset.cid); if (!avSeen.has(a.dataset.cid) && !calmMotion()) a.classList.add('pop-in'); });
    [...avSeen].forEach(c => { if (!here.has(c)) avSeen.delete(c); });
    here.forEach(c => avSeen.add(c));
  }
  window.__tiramisuFeel = true;

})();
