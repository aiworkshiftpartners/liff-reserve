const GAS_BASE = "https://script.google.com/macros/s/AKfycbyJei1maZIYXLuIC38nlTQE0hBH3qNAjlqfqLi8S9euOEuGrmxc4FkXzHvuCVgXUa62/exec"; // ← あなたの /exec

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
};

export async function onRequestGet({ request }) {
  try {
    const url = new URL(request.url);
    // /api/available?week=0.. を GAS ?path=available&week=.. に中継
    const week = url.searchParams.get("week") ?? "0";
    const upstream = await fetch(`${GAS_BASE}?path=available&week=${encodeURIComponent(week)}`);
    const text = await upstream.text();
    const ct = upstream.headers.get("content-type") || "application/json";
    return new Response(text, { status: upstream.status, headers: { ...CORS, "content-type": ct } });
  } catch (err) {
    return new Response(JSON.stringify({ ok:false, error:"proxy_failed", message:String(err) }), {
      status: 502, headers: { ...CORS, "content-type": "application/json" }
    });
  }
}

export async function onRequestOptions(){ return new Response(null, { headers: CORS }); }