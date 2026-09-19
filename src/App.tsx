'use client'

import { Hero } from './components/sections/Hero'
import StickyNav from './components/StickyNav'
import { Process } from './components/sections/Process'
import { Competence } from './components/sections/Competence'
import { Examples } from './components/sections/Examples'
import { Footer } from './components/sections/Footer'
import type { Competence as CompetenceDoc, Example, Hero as HeroDoc, Process as ProcessDoc } from './payload-types'

interface AppProps {
  heroData?: HeroDoc | null
  competenceData?: CompetenceDoc[]
  examplesData?: Example[]
  processData?: ProcessDoc[]
}

export default function App({ heroData, competenceData, examplesData, processData }: AppProps) {
  return (
    <main>
      <Hero data={heroData ?? undefined} />
      <StickyNav />
      <Process data={processData} />
      <Competence data={competenceData} />
      <Examples data={examplesData} />
      <Footer />
    </main>
  )
}
