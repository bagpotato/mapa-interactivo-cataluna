// Proxies CARTO tiles so the API key stays on the server
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ z: string; x: string; y: string }> }
) {
  const key = process.env.CARTO_API_KEY
  if (!key) return new Response('CARTO_API_KEY is not set', { status: 500 })

  const { z, x, y } = await params
  const m = /^(\d+)(@2x)?\.png$/.exec(y)
  if (!/^\d+$/.test(z) || !/^\d+$/.test(x) || !m) {
    return new Response('Bad request', { status: 400 })
  }

  const url = `https://a.basemaps.cartocdn.com/rastertiles/dark_all/${z}/${x}/${m[1]}${m[2] ?? ''}.png?key=${key}`
  const upstream = await fetch(url)
  if (!upstream.ok) return new Response('Upstream error', { status: upstream.status })

  return new Response(upstream.body, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=86400',
    },
  })
}
