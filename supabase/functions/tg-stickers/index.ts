// Tiramisu: Telegram sticker proxy.
//   GET ?set=<pack name or t.me/addstickers link>  -> JSON list of the pack's stickers
//   GET ?file=<file_id>                          -> the sticker file (webp / webm / Lottie JSON for .tgs)
// The bot token lives only here (secret TELEGRAM_BOT_TOKEN), never in the site.
// Only files under stickers/ and thumbnails/ are served, so this can't be used to pull other Telegram files.

const TOKEN = Deno.env.get("TELEGRAM_BOT_TOKEN") ?? "";
const API = `https://api.telegram.org/bot${TOKEN}`;
const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, apikey, content-type",
};

function json(body: unknown, status = 200, cache = "no-store") {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": cache },
  });
}

async function tg(method: string, params: Record<string, string>) {
  const r = await fetch(`${API}/${method}?${new URLSearchParams(params)}`);
  return await r.json();
}

// file_path lookups expire after ~1h on Telegram's side; keep them a bit in this instance.
const pathCache = new Map<string, { path: string; at: number }>();

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: CORS });
  if (req.method !== "GET") return json({ error: "method" }, 405);
  if (!TOKEN) return json({ error: "no_token" }, 503);

  const url = new URL(req.url);
  const setRaw = url.searchParams.get("set");
  const file = url.searchParams.get("file");

  if (setRaw) {
    const name = setRaw.trim().replace(/^.*\/addstickers\//i, "").replace(/[?#].*$/, "").replace(/\/+$/, "");
    if (!/^[A-Za-z0-9_]{1,64}$/.test(name)) return json({ error: "bad_name" }, 400);
    const res = await tg("getStickerSet", { name });
    if (!res.ok) return json({ error: "not_found", detail: res.description }, 404);
    const s = res.result;
    return json({
      name: s.name,
      title: s.title,
      stickers: (s.stickers || []).map((k: any) => ({
        id: k.file_id,
        uid: k.file_unique_id,
        emoji: k.emoji || "",
        kind: k.is_video ? "video" : k.is_animated ? "tgs" : "static",
        thumb: (k.thumbnail || k.thumb || {}).file_id || null,
      })),
    }, 200, "public, max-age=3600");
  }

  if (file) {
    if (!/^[A-Za-z0-9_-]{10,250}$/.test(file)) return json({ error: "bad_file" }, 400);
    let hit = pathCache.get(file);
    if (!hit || Date.now() - hit.at > 30 * 60 * 1000) {
      const res = await tg("getFile", { file_id: file });
      if (!res.ok) return json({ error: "file_not_found", detail: res.description }, 404);
      hit = { path: res.result.file_path as string, at: Date.now() };
      pathCache.set(file, hit);
    }
    if (!/^(stickers|thumbnails)\//.test(hit.path)) return json({ error: "not_a_sticker" }, 403);
    const r = await fetch(`https://api.telegram.org/file/bot${TOKEN}/${hit.path}`);
    if (!r.ok || !r.body) return json({ error: "download_failed" }, 502);
    const ext = hit.path.split(".").pop()!.toLowerCase();
    const cache = "public, max-age=31536000, immutable";
    if (ext === "tgs") {
      // .tgs = gzipped Lottie JSON; unzip so the browser can play it directly.
      const body = r.body.pipeThrough(new DecompressionStream("gzip"));
      return new Response(body, { headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": cache } });
    }
    const type = ext === "webm" ? "video/webm" : ext === "webp" ? "image/webp" : ext === "png" ? "image/png" : ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "application/octet-stream";
    return new Response(r.body, { headers: { ...CORS, "Content-Type": type, "Cache-Control": cache } });
  }

  return json({ error: "use ?set= or ?file=" }, 400);
});
