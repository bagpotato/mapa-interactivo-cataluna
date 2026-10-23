import './globals.css'
import { ChunkLoadErrorHandler } from '@/components/chunk-load-error-handler'

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const base = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  return {
    metadataBase: new URL(base),
    title: 'Mapa Interactiu de Catalunya',
    description: 'Explora els llocs més emblemàtics de Catalunya en un mapa interactiu.',
    icons: {
      icon: '/favicon.svg',
      shortcut: '/favicon.svg',
    },
    openGraph: {
      title: 'Mapa Interactiu de Catalunya',
      description: 'Explora els llocs més emblemàtics de Catalunya en un mapa interactiu.',
      images: ['/og-image.png'],
    },
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ca" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://apps.abacus.ai/chatllm/appllm-lib.js" />
      </head>
      <body>
        {children}
        <ChunkLoadErrorHandler />
      </body>
    </html>
  )
}
