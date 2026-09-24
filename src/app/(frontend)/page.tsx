import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import App from '@/App'
import type { ContactSectionData } from '@/components/sections/Contact'
import type { Competence, Contact, Example, Footer, Hero, Process } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import type { Metadata } from 'next'

function toPublicContact(contact: Contact | null | undefined): ContactSectionData | undefined {
  if (!contact) return undefined

  const form = contact.form
  const publicForm =
    form && typeof form !== 'string'
      ? {
          id: form.id,
          fields: form.fields,
          submitButtonLabel: form.submitButtonLabel,
          confirmationType: form.confirmationType,
          confirmationMessage: form.confirmationMessage,
          redirect: form.redirect,
        }
      : null

  return {
    heading: contact.heading,
    intro: contact.intro,
    form: publicForm,
  }
}

async function getHomeContent() {
  try {
    const payload = await getPayload({ config: configPromise })

    const [heroResult, processResult, competencesResult, examplesResult, footerData, contactData] =
      await Promise.all([
        payload.find({
          collection: 'hero',
          limit: 1,
          pagination: false,
        }),
        payload.find({
          collection: 'process',
          sort: ['_order', 'createdAt'],
          limit: 100,
          pagination: false,
        }),
        payload.find({
          collection: 'competences',
          sort: ['_order', 'createdAt'],
          limit: 100,
          pagination: false,
        }),
        payload.find({
          collection: 'examples',
          sort: ['_order', 'createdAt'],
          limit: 100,
          pagination: false,
        }),
        getCachedGlobal('footer', 0)(),
        getCachedGlobal('contact', 1)(),
      ])

    return {
      heroData: (heroResult.docs[0] as Hero | undefined) ?? undefined,
      processData: processResult.docs as Process[],
      competenceData: competencesResult.docs as Competence[],
      examplesData: examplesResult.docs as Example[],
      footerData: footerData as Footer,
      contactData: toPublicContact(contactData as Contact),
    }
  } catch (error) {
    console.error('Failed to load home content from Payload:', error)
    return {
      heroData: undefined,
      processData: undefined,
      competenceData: undefined,
      examplesData: undefined,
      footerData: undefined,
      contactData: undefined,
    }
  }
}

export default async function HomePage() {
  const { heroData, processData, competenceData, examplesData, footerData, contactData } =
    await getHomeContent()

  return (
    <App
      heroData={heroData}
      processData={processData}
      competenceData={competenceData}
      examplesData={examplesData}
      footerData={footerData}
      contactData={contactData}
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
