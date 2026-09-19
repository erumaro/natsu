import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import App from '@/App'
import type { Competence, Example, Hero, Process } from '@/payload-types'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'

async function getHomeContent() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [heroResult, processResult, competencesResult, examplesResult] = await Promise.all([
      payload.find({
        collection: 'hero',
        limit: 1,
        pagination: false,
      }),
      payload.find({
        collection: 'process',
        limit: 100,
        pagination: false,
      }),
      payload.find({
        collection: 'competences',
        limit: 100,
        pagination: false,
      }),
      payload.find({
        collection: 'examples',
        limit: 100,
        pagination: false,
      }),
    ])

    return {
      heroData: (heroResult.docs[0] as Hero | undefined) ?? undefined,
      processData: processResult.docs as Process[],
      competenceData: competencesResult.docs as Competence[],
      examplesData: examplesResult.docs as Example[],
    }
  } catch (error) {
    console.error('Failed to load home content from Payload:', error)
    return {
      heroData: undefined,
      processData: undefined,
      competenceData: undefined,
      examplesData: undefined,
    }
  }
}

export default async function HomePage() {
  const { heroData, processData, competenceData, examplesData } = await getHomeContent()

  return (
    <App
      heroData={heroData}
      processData={processData}
      competenceData={competenceData}
      examplesData={examplesData}
    />
  )
}

export const metadata: Metadata = {
  title: 'Tillgängliga & framtidssäkra webbplatser - Frontend & Wordpress-utvecklare | Tobias Årud',
  description:
    'Webbutvecklare med fokus på tillgänglighet, prestanda och hållbar kod. Bygger framtidssäkra webbplatser i React, Next.js och WordPress.',
  openGraph: mergeOpenGraph({
    title: 'Tillgängliga & framtidssäkra webbplatser | Tobias Årud',
    description:
      'Webbutvecklare med fokus på tillgänglighet, prestanda och hållbar kod. Bygger framtidssäkra webbplatser i React, Next.js och WordPress.',
  }),
}
