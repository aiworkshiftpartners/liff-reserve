const GAS_BASE = "https://script.google.com/macros/s/AKfycbxaETOZw-tyBHaSlcpSVrmm522P6K0gFVRUJlVgxxtBkxWPqbrgUZH8iZSG1Ac1r7o/exec"; // 例: https://script.google.com/macros/s/AKfycb.../exec

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export async function onRequestGet({ request }) {
  const url = new URL(request.url);
  const week = url.searchParams.get("week") ?? "0";

  // エッジキャッシュ
  const cache = caches.default;
  const cacheKey = new Request(`${url.origin}/api/available?week=${week}`, request);
  let resp = await cache.match(cacheKey);
  if (resp) return resp;

  const upstream = await fetch(`${GAS_BASE}?path=available&week=${encodeURIComponent(week)}`, {
    headers: { accept: "application/json" },
  });
  const text = await upstream.text();

  try {
    JSON.parse(text); // JSON検証
    resp = new Response(text, {
      headers: {
        ...CORS,
        "content-type": upstream.headers.get("content-type") || "application/json",
        "cache-control": "public, s-maxage=120, stale-while-revalidate=60",
      },
    });
    await cache.put(cacheKey, resp.clone());
    return resp;
  } catch {
    return new Response(JSON.stringify({ ok:false, error:"bad_upstream", raw:text.slice(0,200) }), {
      status: 502, headers: { ...CORS, "content-type": "application/json" }
    });
  }
}

export async function onRequestOptions(){ return new Response(null, { headers: CORS }); }