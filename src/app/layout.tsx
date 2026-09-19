import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tillgängliga & framtidssäkra webbplatser - Frontend & Wordpress-utvecklare | Tobias Årud',
  description:
    'Webbutvecklare med fokus på tillgänglighet, prestanda och hållbar kod. Bygger framtidssäkra webbplatser i React, Next.js och WordPress.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
