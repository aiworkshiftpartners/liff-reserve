const GAS_BASE = "https://script.google.com/macros/s/AKfycbypz2p9RnwfTgW-1GD9cUocNa6Bzz5H6ZIwC6y2Q318DcdN8RM-1WkxsNkRoZBOu945/exec";

const CORS = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
  "cache-control": "no-store",
};

export async function onRequestPost({ request }) {
  const body = await request.text();
  const upstream = await fetch(GAS_BASE, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
  });
  const text = await upstream.text();
  const ct = upstream.headers.get("content-type") || "application/json";
  return new Response(text, { status: upstream.status, headers: { ...CORS, "content-type": ct } });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS });
}