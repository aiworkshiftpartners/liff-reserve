const GAS_BASE = "Yhttps://script.google.com/macros/s/AKfycbzvWkRatzZlsnuHS_2_P7CjkvDH9gC1kFTwq2iaomJZG5HKYR37zTqJ1towGktlHP-H/exec"; // 例: https://script.google.com/macros/s/AKfycb.../exec
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
};

export async function onRequestPost({ request }) {
  const body = await request.text();
  const upstream = await fetch(GAS_BASE, { method: "POST", headers:{ "content-type":"application/json" }, body });
  const text = await upstream.text();
  return new Response(text, { status: upstream.status, headers: { ...CORS, "content-type": "application/json" } });
}
export async function onRequestOptions(){ return new Response(null, { headers: CORS }); }