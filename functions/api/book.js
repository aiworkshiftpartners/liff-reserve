// /functions/api/book.js
const GAS_BASE = "https://script.google.com/macros/s/AKfycbwkdbhx0eD4mEhfelNNU2ajKVqBKLF9TA238c8MdgfCE2QCGC9VKX786sW1zyCIl7It/exec";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
};

export async function onRequestPost({ request }) {
  try {
    const body = await request.text();
    const upstream = await fetch(GAS_BASE, { method:"POST", headers:{ "content-type":"application/json" }, body });
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