'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import L from 'leaflet'

const GOOGLE_PLACES_API_KEY = ''

interface POI {
  name: string
  lat: number
  lng: number
  comarca: string
  description: string
  wiki: string
}

const POIS: POI[] = [
  { name: 'Barcelona', lat: 41.3874, lng: 2.1686, comarca: 'Barcelonès', description: 'Capital de Catalunya, ciutat cosmopolita amb una arquitectura modernista única. La Sagrada Família, el Parc Güell i les Rambles són icones mundials.', wiki: 'Barcelona' },
  { name: 'Girona', lat: 41.9794, lng: 2.8214, comarca: 'Gironès', description: 'Ciutat medieval amb el barri jueu més ben conservat d\'Europa. El riu Onyar i les seves cases de colors són la imatge més emblemàtica.', wiki: 'Girona' },
  { name: 'Tarragona', lat: 41.1189, lng: 1.2445, comarca: 'Tarragonès', description: 'Antiga Tàrraco romana, Patrimoni de la Humanitat. L\'amfiteatre romà domina el Mediterrani amb vistes espectaculars.', wiki: 'Tarragona' },
  { name: 'Lleida', lat: 41.6176, lng: 0.6200, comarca: 'Segrià', description: 'Ciutat amb segles d\'història dominada per la Seu Vella, catedral romànica-gòtica al cim d\'un turó amb vistes a la plana.', wiki: 'Lleida' },
  { name: 'Sitges', lat: 41.2371, lng: 1.8120, comarca: 'Garraf', description: 'Vila costanera bohèmia famosa per les seves platges, el festival de cinema fantàstic i la seva vibrant vida cultural.', wiki: 'Sitges' },
  { name: 'Cadaqués', lat: 42.2886, lng: 3.2764, comarca: 'Alt Empordà', description: 'Poble blanc del Cap de Creus que va inspirar Salvador Dalí. Carrers empedrats, cales cristal·lines i una llum única.', wiki: 'Cadaqués' },
  { name: 'Figueres', lat: 42.2666, lng: 2.9617, comarca: 'Alt Empordà', description: 'Ciutat natal de Salvador Dalí amb el famós Teatre-Museu Dalí, l\'obra surrealista més gran del món.', wiki: 'Figueres' },
  { name: 'Montserrat', lat: 41.5935, lng: 1.8378, comarca: 'Bages', description: 'Muntanya sagrada de Catalunya amb el monestir benedictí i la Mare de Déu de Montserrat, la Moreneta. Formacions rocoses úniques.', wiki: 'Montserrat_(mountain)' },
  { name: 'Vic', lat: 41.8893, lng: 2.2546, comarca: 'Osona', description: 'Capital de la plana de Vic amb un centre històric notable. La plaça Major porticada és una de les més belles de Catalunya.', wiki: 'Vic,_Catalonia' },
  { name: 'Reus', lat: 41.1559, lng: 1.1072, comarca: 'Baix Camp', description: 'Ciutat natal d\'Antoni Gaudí amb un centre modernista extraordinari. Capital del vermut i de la cultura del Camp de Tarragona.', wiki: 'Reus' },
  { name: 'Tortosa', lat: 40.8126, lng: 0.5215, comarca: 'Baix Ebre', description: 'Ciutat monumental a la riba de l\'Ebre amb catedral gòtica, barri jueu i un notable conjunt modernista.', wiki: 'Tortosa' },
  { name: 'Besalú', lat: 42.1989, lng: 2.6987, comarca: 'Garrotxa', description: 'Vila medieval presidida pel seu pont romànic fortificat del segle XII. Un dels conjunts medievals més ben conservats de Catalunya.', wiki: 'Besalú' },
  { name: 'Cardona', lat: 41.9130, lng: 1.6815, comarca: 'Bages', description: 'Dominada pel castell dels Ducs de Cardona i la muntanya de sal. La col·legiata de Sant Vicenç és una joia del romànic llombard.', wiki: 'Cardona' },
  { name: 'Tossa de Mar', lat: 41.7197, lng: 2.9316, comarca: 'Selva', description: 'Vila marinera amb la Vila Vella emmurallada sobre el mar. Marc Chagall la va anomenar "el Paradís Blau".', wiki: 'Tossa_de_Mar' },
  { name: 'Salou', lat: 41.0768, lng: 1.1414, comarca: 'Tarragonès', description: 'Principal destinació turística de la Costa Daurada amb platges daurades, passeig marítim i PortAventura World a prop.', wiki: 'Salou' },
  { name: 'Vielha', lat: 42.7028, lng: 0.7962, comarca: 'Val d\'Aran', description: 'Capital de la Val d\'Aran, l\'única vall atlàntica del Pirineu català. Poble de muntanya amb l\'església de Sant Miquèu.', wiki: 'Vielha_e_Mijaran' },
  { name: 'La Seu d\'Urgell', lat: 42.3576, lng: 1.4609, comarca: 'Alt Urgell', description: 'Ciutat pirinenca amb la catedral romànica de Santa Maria, la més antiga de Catalunya. Porta d\'entrada a Andorra.', wiki: 'La_Seu_d%27Urgell' },
  { name: 'Monestir de Poblet', lat: 41.3805, lng: 1.0818, comarca: 'Conca de Barberà', description: 'Monestir cistercenc Patrimoni de la Humanitat, panteó reial de la Corona d\'Aragó. Un dels conjunts monàstics més grans d\'Europa.', wiki: 'Poblet_Monastery' },
  { name: 'Siurana', lat: 41.2558, lng: 0.9326, comarca: 'Priorat', description: 'Poble de cingle sobre un penya-segat amb vistes espectaculars. Últim reducte sarraí de Catalunya i meca de l\'escalada.', wiki: 'Siurana_(village)' },
  { name: 'Peratallada', lat: 41.9780, lng: 3.0873, comarca: 'Baix Empordà', description: 'Conjunt medieval fortificat amb carrers tallats a la roca. Un dels nuclis més ben conservats de l\'Empordà.', wiki: 'Peratallada' },
  { name: 'Pals', lat: 41.9714, lng: 3.1481, comarca: 'Baix Empordà', description: 'Vila medieval amb torre romànica i carrerons empedrats. Les seves platges i arrossars ofereixen paisatges únics.', wiki: 'Pals,_Girona' },
  { name: 'Rupit', lat: 42.0018, lng: 2.4632, comarca: 'Osona', description: 'Poble medieval suspès sobre un cingle rocós amb el pont penjant sobre el torrent. Naturalesa exuberant a la zona volcànica.', wiki: 'Rupit_i_Pruit' },
  { name: 'Taüll', lat: 42.5218, lng: 0.8531, comarca: 'Alta Ribagorça', description: 'Petit poble pirinenc amb les esglésies romàniques de Sant Climent i Santa Maria, Patrimoni de la Humanitat. El Pantocràtor és icònic.', wiki: 'Taüll' },
  { name: 'Olot', lat: 42.1803, lng: 2.4898, comarca: 'Garrotxa', description: 'Capital de la Garrotxa envoltada de volcans. La fageda d\'en Jordà i el volcà Croscat són paisatges naturals excepcionals.', wiki: 'Olot' },
  { name: 'Manresa', lat: 41.7251, lng: 1.8265, comarca: 'Bages', description: 'Ciutat amb la Seu gòtica i la Cova de Sant Ignasi. Centre geogràfic de Catalunya amb un ric patrimoni barroc.', wiki: 'Manresa' },
  { name: 'Mataró', lat: 41.5402, lng: 2.4445, comarca: 'Maresme', description: 'Capital del Maresme amb patrimoni modernista i la basílica de Santa Maria. Primera línia de ferrocarril de la Península Ibèrica.', wiki: 'Mataró' },
  { name: 'Blanes', lat: 41.6746, lng: 2.7903, comarca: 'Selva', description: 'Porta de la Costa Brava amb el Jardí Botànic Marimurtra sobre els penya-segats i la platja de S\'Abanell, la més llarga de la costa.', wiki: 'Blanes' },
  { name: 'Roses', lat: 42.2627, lng: 3.1764, comarca: 'Alt Empordà', description: 'Vila marinera amb la ciutadella renaixentista i el golf de Roses. Aquí hi havia el celler Bulli, el millor restaurant del món.', wiki: 'Roses,_Girona' },
  { name: 'L\'Escala', lat: 42.1248, lng: 3.1354, comarca: 'Alt Empordà', description: 'Poble pescador amb les ruïnes gregues i romanes d\'Empúries. Famós per les seves anxoves artesanals i la platja de Riells.', wiki: 'L%27Escala' },
  { name: 'Delta de l\'Ebre', lat: 40.7204, lng: 0.8585, comarca: 'Montsià', description: 'Parc natural amb aiguamolls, arrossars i flamencs. El tercer delta més gran del Mediterrani, un paradís per a les aus.', wiki: 'Ebro_Delta' },
  { name: 'Camprodon', lat: 42.3130, lng: 2.3651, comarca: 'Ripollès', description: 'Vila pirinenca amb el pont nou medieval sobre el riu Ter. Bressol del compositor Isaac Albéniz i porta del Pirineu oriental.', wiki: 'Camprodon' },
]

const COMARCA_GEOJSON_URL = 'https://raw.githubusercontent.com/rveciana/catalonia-geoJSON/master/comarques.geojson'
const OUTLINE_GEOJSON_URL = 'https://raw.githubusercontent.com/rveciana/catalonia-geoJSON/master/catalunya.geojson'

const wikiCache = new Map<string, string | null>()

async function wikiThumb(host: string, params: string): Promise<string | null> {
  try {
    const url = `https://${host}.wikipedia.org/w/api.php?action=query&format=json&prop=pageimages&piprop=thumbnail&pithumbsize=600&redirects=1&origin=*&${params}`
    const res = await fetch(url)
    const data = await res.json()
    const pages = Object.values(data?.query?.pages ?? {}) as any[]
    pages.sort((a, b) => (a?.index ?? 0) - (b?.index ?? 0))
    return pages.find((p) => p?.thumbnail?.source)?.thumbnail?.source ?? null
  } catch {
    return null
  }
}

// Exact title first, then a search on en and ca Wikipedia for ambiguous or missing titles
async function fetchWikiImage(poi: POI): Promise<string | null> {
  const cached = wikiCache.get(poi.name)
  if (cached !== undefined) return cached
  let title = poi.wiki
  try { title = decodeURIComponent(title) } catch {}
  const q = encodeURIComponent
  const img =
    (await wikiThumb('en', `titles=${q(title)}`)) ??
    (await wikiThumb('en', `generator=search&gsrlimit=5&gsrsearch=${q(`${poi.name} ${poi.comarca} Catalonia`)}`)) ??
    (await wikiThumb('ca', `generator=search&gsrlimit=5&gsrsearch=${q(`${poi.name} ${poi.comarca}`)}`))
  wikiCache.set(poi.name, img)
  return img
}

export default function CataloniaMap() {
  const mapRef = useRef<L.Map | null>(null)
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [selectedPOI, setSelectedPOI] = useState<POI | null>(null)
  const [panelOpen, setPanelOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageLoading, setImageLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const markersRef = useRef<Map<string, L.Marker>>(new Map())

  const filteredPOIs = searchQuery?.trim()
    ? POIS?.filter?.((p: POI) => p?.name?.toLowerCase?.()?.includes?.(searchQuery?.toLowerCase?.() ?? '') ?? false) ?? []
    : []

  const openPanel = useCallback(async (poi: POI) => {
    setSelectedPOI(poi)
    setPanelOpen(true)
    setImageUrl(null)
    setImageLoading(true)
    const img = await fetchWikiImage(poi)
    setImageUrl(img)
    setImageLoading(false)
  }, [])

  const closePanel = useCallback(() => {
    setPanelOpen(false)
    setTimeout(() => setSelectedPOI(null), 350)
  }, [])

  const flyToAndOpen = useCallback((poi: POI) => {
    const map = mapRef?.current
    if (map) {
      map.flyTo([poi?.lat ?? 41.8, poi?.lng ?? 1.7], 12, { duration: 1.2 })
    }
    openPanel(poi)
    setSearchQuery('')
    setSearchOpen(false)
  }, [openPanel])

  const recenter = useCallback(() => {
    mapRef?.current?.flyTo?.([41.8, 1.7], 8, { duration: 1 })
  }, [])

  useEffect(() => {
    if (!mapContainerRef?.current || mapRef?.current) return

    const map = L.map(mapContainerRef.current, {
      center: [41.8, 1.7],
      zoom: 8,
      minZoom: 7,
      maxZoom: 14,
      maxBounds: L.latLngBounds([40.4, 0.1], [42.9, 3.4]),
      maxBoundsViscosity: 0.9,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png?key=cb1_4qx2_1_1d998e9e3d3a01b08365ae7b', {
      attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
      subdomains: 'abcd',
      maxZoom: 19,
    }).addTo(map)

    // Load comarca boundaries
    fetch(COMARCA_GEOJSON_URL)
      .then(r => r?.json?.())
      .then((geojson: any) => {
        if (!geojson?.features) return
        L.geoJSON(geojson, {
          style: () => ({
            fillColor: 'transparent',
            fillOpacity: 0,
            color: '#aaaaaa',
            weight: 0.8,
            opacity: 0.4,
          }),
          onEachFeature: (feature: any, layer: any) => {
            const name = feature?.properties?.NOM_CA ?? feature?.properties?.nom ?? feature?.properties?.NAME ?? ''
            if (name) {
              layer.bindTooltip(name, { sticky: true, direction: 'top', offset: [0, -10] })
            }
            layer.on('mouseover', () => {
              layer.setStyle({ color: '#ffffff', weight: 1.5, opacity: 0.8 })
            })
            layer.on('mouseout', () => {
              layer.setStyle({ color: '#aaaaaa', weight: 0.8, opacity: 0.4 })
            })
          },
        }).addTo(map)
      })
      .catch(() => {})

    // Load Catalonia outline
    fetch(OUTLINE_GEOJSON_URL)
      .then(r => r?.json?.())
      .then((geojson: any) => {
        if (!geojson) return
        L.geoJSON(geojson, {
          style: () => ({
            color: '#4fc3f7',
            weight: 2.5,
            fillOpacity: 0,
            opacity: 0.6,
          }),
          interactive: false,
        }).addTo(map)
      })
      .catch(() => {})

    // Add POI markers
    POIS?.forEach?.((poi: POI) => {
      const icon = L.divIcon({
        className: '',
        html: '<div class="marker-pulse"><div class="marker-ring"></div><div class="marker-dot"></div></div>',
        iconSize: [14, 14],
        iconAnchor: [7, 7],
      })
      const marker = L.marker([poi?.lat ?? 0, poi?.lng ?? 0], { icon }).addTo(map)
      marker.on('click', () => {
        map.flyTo([poi?.lat ?? 41.8, poi?.lng ?? 1.7], 12, { duration: 1 })
        openPanel(poi)
      })
      markersRef.current.set(poi?.name ?? '', marker)
    })

    mapRef.current = map

    return () => {
      map?.remove?.()
      mapRef.current = null
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', background: '#000' }}>
      {/* Map container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }} />

      {/* Search bar */}
      <div style={{
        position: 'absolute', top: 16, left: 16, zIndex: 1000,
        width: 'min(320px, calc(100vw - 32px))',
      }}>
        <div style={{
          background: '#111', border: '1px solid #222', borderRadius: 12,
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', padding: '0 12px', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Cercar lloc…"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchQuery(e?.target?.value ?? '')
                setSearchOpen(true)
              }}
              onFocus={() => setSearchOpen(true)}
              style={{
                background: 'transparent', border: 'none', outline: 'none',
                color: '#f4f5f7', fontSize: 14, fontFamily: 'Inter, sans-serif',
                padding: '12px 0', width: '100%',
              }}
            />
            {searchQuery && (
              <button
                onClick={() => { setSearchQuery(''); setSearchOpen(false) }}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: 18, padding: 4 }}
              >
                ×
              </button>
            )}
          </div>
          {searchOpen && (filteredPOIs?.length ?? 0) > 0 && (
            <div style={{ borderTop: '1px solid #222', maxHeight: 240, overflowY: 'auto' }}>
              {filteredPOIs?.map?.((poi: POI) => (
                <button
                  key={poi?.name}
                  onClick={() => flyToAndOpen(poi)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '10px 14px', background: 'transparent',
                    border: 'none', cursor: 'pointer', color: '#f4f5f7',
                    fontSize: 13, fontFamily: 'Inter, sans-serif', textAlign: 'left',
                  }}
                  onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
                    (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'
                  }}
                  onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
                  }}
                >
                  <span style={{ color: '#e63946', fontSize: 8, lineHeight: 1 }}>●</span>
                  <span>{poi?.name}</span>
                  <span style={{ marginLeft: 'auto', color: '#555', fontSize: 11 }}>{poi?.comarca}</span>
                </button>
              )) ?? null}
            </div>
          )}
        </div>
      </div>

      {/* Recenter button */}
      <button
        onClick={recenter}
        title="Recentrar mapa"
        style={{
          position: 'absolute', top: 16, right: 16, zIndex: 1000,
          width: 42, height: 42, borderRadius: 12,
          background: '#111', border: '1px solid #222',
          color: '#f4f5f7', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
          transition: 'background 0.2s',
        }}
        onMouseEnter={(e: React.MouseEvent<HTMLButtonElement>) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#222'
        }}
        onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
          (e.currentTarget as HTMLButtonElement).style.background = '#111'
        }}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3"/>
          <line x1="12" y1="2" x2="12" y2="6"/>
          <line x1="12" y1="18" x2="12" y2="22"/>
          <line x1="2" y1="12" x2="6" y2="12"/>
          <line x1="18" y1="12" x2="22" y2="12"/>
        </svg>
      </button>

      {/* Counter */}
      <div style={{
        position: 'absolute', bottom: 24, left: 16, zIndex: 1000,
        background: '#111', border: '1px solid #222', borderRadius: 10,
        padding: '8px 16px', color: '#f4f5f7', fontSize: 13,
        fontFamily: 'Orbitron, sans-serif', fontWeight: 600, letterSpacing: 1,
        boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ color: '#e63946', fontSize: 10 }}>●</span>
        {POIS?.length ?? 0} llocs
      </div>

      {/* Title watermark */}
      <div style={{
        position: 'absolute', top: 16, left: '50%', transform: 'translateX(-50%)', zIndex: 999,
        fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 14,
        color: 'rgba(244,245,247,0.25)', letterSpacing: 3, textTransform: 'uppercase',
        pointerEvents: 'none', whiteSpace: 'nowrap',
        display: 'none',
      }}>
        Catalunya
      </div>

      {/* Overlay */}
      {panelOpen && (
        <div
          onClick={closePanel}
          style={{
            position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0,0,0,0.4)', zIndex: 1100,
            transition: 'opacity 0.3s',
          }}
        />
      )}

      {/* Side panel */}
      <div style={{
        position: 'absolute', top: 0, right: 0, height: '100%',
        width: typeof window !== 'undefined' && window.innerWidth < 640 ? '100vw' : 380,
        background: '#111', borderLeft: '1px solid #222',
        zIndex: 1200,
        transform: panelOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s ease',
        display: 'flex', flexDirection: 'column',
        boxShadow: panelOpen ? '-8px 0 40px rgba(0,0,0,0.6)' : 'none',
        overflowY: 'auto',
      }}>
        {/* Close button */}
        <button
          onClick={closePanel}
          style={{
            position: 'absolute', top: 14, right: 14, zIndex: 10,
            width: 36, height: 36, borderRadius: 10,
            background: 'rgba(0,0,0,0.5)', border: '1px solid #333',
            color: '#f4f5f7', cursor: 'pointer', fontSize: 18,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }}
        >
          ✕
        </button>

        {selectedPOI && (
          <>
            {/* Image */}
            <div style={{
              width: '100%', height: 220, background: '#0a0a0a',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              overflow: 'hidden', flexShrink: 0,
            }}>
              {imageLoading ? (
                <div style={{ color: '#444', fontSize: 13 }}>Carregant imatge…</div>
              ) : imageUrl ? (
                <img
                  src={imageUrl}
                  alt={selectedPOI?.name ?? ''}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={() => setImageUrl(null)}
                />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, color: '#333' }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                    <circle cx="8.5" cy="8.5" r="1.5"/>
                    <polyline points="21,15 16,10 5,21"/>
                  </svg>
                  <span style={{ fontSize: 11 }}>Imatge no disponible</span>
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: '24px 24px 32px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <h2 style={{
                  fontFamily: 'Orbitron, sans-serif', fontWeight: 700, fontSize: 22,
                  color: '#f4f5f7', margin: 0, letterSpacing: 0.5,
                }}>
                  {selectedPOI?.name ?? ''}
                </h2>
                <span style={{
                  display: 'inline-block', marginTop: 8,
                  background: '#1a1a1a', border: '1px solid #222',
                  borderRadius: 6, padding: '4px 10px',
                  fontSize: 12, color: '#4fc3f7', fontWeight: 500,
                }}>
                  {selectedPOI?.comarca ?? ''}
                </span>
              </div>

              <p style={{
                fontSize: 14, lineHeight: 1.7, color: '#aaa', margin: 0,
              }}>
                {selectedPOI?.description ?? ''}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedPOI?.lat ?? 0},${selectedPOI?.lng ?? 0}`}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  padding: '12px 20px', borderRadius: 12,
                  background: '#e63946', color: '#fff',
                  fontSize: 14, fontWeight: 600, textDecoration: 'none',
                  fontFamily: 'Inter, sans-serif',
                  transition: 'background 0.2s',
                  marginTop: 8,
                }}
                onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#d32f3f'
                }}
                onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = '#e63946'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                Ver en Google Maps
              </a>

              <div style={{
                marginTop: 8, paddingTop: 16, borderTop: '1px solid #1a1a1a',
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: '#444',
              }}>
                <span>{(selectedPOI?.lat ?? 0)?.toFixed?.(4) ?? '0'}°N</span>
                <span>{(selectedPOI?.lng ?? 0)?.toFixed?.(4) ?? '0'}°E</span>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Click outside search to close */}
      {searchOpen && (
        <div
          onClick={() => setSearchOpen(false)}
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 999 }}
        />
      )}
    </div>
  )
}
