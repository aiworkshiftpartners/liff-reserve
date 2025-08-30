const GAS_BASE = "https://script.google.com/macros/s/AKfycbzvWkRatzZlsnuHS_2_P7CjkvDH9gC1kFTwq2iaomJZG5HKYR37zTqJ1towGktlHP-H/exec"; // 例: https://script.google.com/macros/s/AKfycb.../exec
const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
};

export async function onRequestGet() {
  const upstream = await fetch(`${GAS_BASE}?path=available`, { headers:{ accept:"application/json" } });
  const text = await upstream.text();
  // JSON検証（upstreamがHTMLでも落とさない）
  try {
    const json = JSON.parse(text);
    return new Response(JSON.stringify(json), { headers: { ...CORS, "content-type": "application/json" } });
  } catch {
    return new Response(JSON.stringify({ ok:false, error:"bad_upstream", raw:text.slice(0,500) }), {
      status: 502, headers: { ...CORS, "content-type": "application/json" }
    });
  }
}
export async function onRequestOptions(){ return new Response(null, { headers: CORS }); }