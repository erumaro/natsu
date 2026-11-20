import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { Container } from '@/components/layout/Container'
import { getViewableCV } from '@/CV/getCV'
import { cvLabels, isCVLang, type CVLang } from '@/CV/labels'
import { type ResolvedEntry, resolveCV } from '@/CV/resolve'

type Args = { params: Promise<{ lang: string }> }

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section aria-labelledby={id} className="mt-12">
      <h2 id={id} className="border-b border-neutral-300 pb-2 text-2xl font-semibold tracking-tight">
        {title}
      </h2>
      <div className="mt-6">{children}</div>
    </section>
  )
}

function Entry({ item }: { item: ResolvedEntry }) {
  return (
    <article>
      <h3 className="text-lg font-semibold text-neutral-900">{item.title}</h3>
      <p className="text-neutral-700">
        {[item.organization, item.location].filter(Boolean).join(', ')}
        {item.period && (
          <>
            {' · '}
            <time dateTime={item.startISO}>{item.period}</time>
          </>
        )}
      </p>
      {item.description && <p className="mt-2 max-w-prose text-neutral-800">{item.description}</p>}
      {item.highlights.length > 0 && (
        <ul className="mt-2 max-w-prose list-disc space-y-1 pl-5 text-neutral-800">
          {item.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
      )}
    </article>
  )
}

export default async function CVPage({ params }: Args) {
  const { lang } = await params
  if (!isCVLang(lang)) notFound()

  const doc = await getViewableCV()
  if (!doc) notFound()

  const cv = resolveCV(doc, lang)
  const { labels } = cv
  const otherLang: CVLang = lang === 'sv' ? 'en' : 'sv'
  const showPhone = cv.phone && !cv.hidePhoneOnWeb

  return (
    <main lang={labels.langTag} className="py-16 text-neutral-900">
      <Container>
        <nav aria-label={labels.document} className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <a
            href={`/cv/${lang}/pdf`}
            className="rounded-md bg-neutral-900 px-4 py-2 font-medium text-white underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            {labels.downloadPdf}
          </a>
          <Link
            href={`/cv/${otherLang}`}
            hrefLang={cvLabels[otherLang].langTag}
            lang={cvLabels[otherLang].langTag}
            className="underline underline-offset-4"
          >
            {labels.otherLanguage}
          </Link>
        </nav>

        <article className="mt-12">
          <header>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{cv.fullName}</h1>
            {cv.headline && <p className="mt-2 text-xl text-neutral-700">{cv.headline}</p>}

            <h2 className="sr-only">{labels.contact}</h2>
            <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-neutral-800">
              {cv.email && (
                <li>
                  {labels.email}:{' '}
                  <a href={`mailto:${cv.email}`} className="underline underline-offset-4">
                    {cv.email}
                  </a>
                </li>
              )}
              {showPhone && (
                <li>
                  {labels.phone}:{' '}
                  <a href={`tel:${cv.phone.replace(/[^\d+]/g, '')}`} className="underline underline-offset-4">
                    {cv.phone}
                  </a>
                </li>
              )}
              {cv.location && (
                <li>
                  {labels.location}: {cv.location}
                </li>
              )}
              {cv.links.map((link) => (
                <li key={link.url}>
                  {link.label}:{' '}
                  <a href={link.url} className="underline underline-offset-4" rel="me noopener">
                    {link.display}
                  </a>
                </li>
              ))}
            </ul>
          </header>

          {cv.summary && (
            <Section id="cv-summary" title={labels.summary}>
              <p className="max-w-prose text-lg text-neutral-800">{cv.summary}</p>
            </Section>
          )}

          {cv.experience.length > 0 && (
            <Section id="cv-experience" title={labels.experience}>
              <div className="space-y-8">
                {cv.experience.map((item, index) => (
                  <Entry key={`${item.organization}-${index}`} item={item} />
                ))}
              </div>
            </Section>
          )}

          {cv.education.length > 0 && (
            <Section id="cv-education" title={labels.education}>
              <div className="space-y-8">
                {cv.education.map((item, index) => (
                  <Entry key={`${item.organization}-${index}`} item={item} />
                ))}
              </div>
            </Section>
          )}

          {cv.skills.length > 0 && (
            <Section id="cv-skills" title={labels.skills}>
              <dl className="space-y-3">
                {cv.skills.map((group) => (
                  <div key={group.category}>
                    <dt className="font-semibold">{group.category}</dt>
                    <dd className="text-neutral-800">{group.items.join(', ')}</dd>
                  </div>
                ))}
              </dl>
            </Section>
          )}

          {cv.languages.length > 0 && (
            <Section id="cv-languages" title={labels.languages}>
              <ul className="list-disc space-y-1 pl-5 text-neutral-800">
                {cv.languages.map((item) => (
                  <li key={item.language}>{[item.language, item.level].filter(Boolean).join(' – ')}</li>
                ))}
              </ul>
            </Section>
          )}

          {cv.certifications.length > 0 && (
            <Section id="cv-certifications" title={labels.certifications}>
              <ul className="list-disc space-y-1 pl-5 text-neutral-800">
                {cv.certifications.map((item) => (
                  <li key={item.name}>{[item.name, item.issuer, item.date].filter(Boolean).join(', ')}</li>
                ))}
              </ul>
            </Section>
          )}
        </article>
      </Container>
    </main>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { lang } = await params
  if (!isCVLang(lang)) return {}

  const doc = await getViewableCV()
  if (!doc) return {}

  const cv = resolveCV(doc, lang)

  return {
    title: `${cv.fullName} – ${cv.labels.document}`,
    description: cv.headline || undefined,
    alternates: {
      languages: {
        'sv-SE': '/cv/sv',
        'en-GB': '/cv/en',
      },
    },
    robots: doc.published ? undefined : { index: false, follow: false },
  }
}
