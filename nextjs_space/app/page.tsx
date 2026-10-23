'use client'

import dynamic from 'next/dynamic'

const CataloniaMap = dynamic(() => import('@/components/catalonia-map'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#f4f5f7', fontFamily: 'Inter, sans-serif', fontSize: 16, opacity: 0.6 }}>Carregant mapa…</div>
    </div>
  ),
})

export default function Page() {
  return <CataloniaMap />
}
