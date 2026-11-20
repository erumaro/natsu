import type { Cv } from '@/payload-types'

import { type CVLabels, type CVLang, cvLabels } from './labels'

type Translated = { sv?: string | null; en?: string | null } | null | undefined

export type ResolvedEntry = {
  title: string
  organization: string
  location: string
  period: string
  /** Machine-readable start/end (YYYY-MM) for <time> elements. */
  startISO?: string
  endISO?: string
  description: string
  highlights: string[]
}

export type ResolvedCV = {
  lang: CVLang
  labels: CVLabels
  fullName: string
  headline: string
  email: string
  phone: string
  location: string
  links: { label: string; url: string; display: string }[]
  summary: string
  experience: ResolvedEntry[]
  education: ResolvedEntry[]
  skills: { category: string; items: string[] }[]
  languages: { language: string; level: string }[]
  certifications: { name: string; issuer: string; date: string }[]
  hidePhoneOnWeb: boolean
}

const pick = (value: Translated, lang: CVLang) =>
  value?.[lang]?.trim() || value?.sv?.trim() || ''

const toLines = (text: string) =>
  text
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[•\-–*]\s*/, '').trim())
    .filter(Boolean)

const toList = (text: string) =>
  text
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)

// Month-only dates are stored as local midnight, so format in the editor's time zone
// to avoid e.g. 1 January turning into December of the previous year.
const TIME_ZONE = 'Europe/Stockholm'

function formatMonth(value: string | null | undefined, labels: CVLabels) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat(labels.langTag, {
    month: 'long',
    year: 'numeric',
    timeZone: TIME_ZONE,
  }).format(date)
}

function isoMonth(value: string | null | undefined) {
  if (!value) return undefined
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return undefined
  const parts = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    timeZone: TIME_ZONE,
  }).formatToParts(date)
  const year = parts.find((p) => p.type === 'year')?.value
  const month = parts.find((p) => p.type === 'month')?.value
  return year && month ? `${year}-${month}` : undefined
}

function formatPeriod(
  start: string | null | undefined,
  end: string | null | undefined,
  current: boolean,
  labels: CVLabels,
) {
  const from = formatMonth(start, labels)
  const to = current ? labels.present : formatMonth(end, labels)
  if (from && to) return `${from} – ${to}`
  return from || to
}

export function displayUrl(url: string) {
  return url.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '')
}

export function resolveCV(cv: Cv, lang: CVLang): ResolvedCV {
  const labels = cvLabels[lang]

  return {
    lang,
    labels,
    fullName: cv.fullName.trim(),
    headline: pick(cv.headline, lang),
    email: cv.email?.trim() ?? '',
    phone: cv.phone?.trim() ?? '',
    location: pick(cv.location, lang),
    links: (cv.links ?? []).map((link) => ({
      label: link.label.trim(),
      url: link.url.trim(),
      display: displayUrl(link.url.trim()),
    })),
    summary: pick(cv.summary, lang),
    experience: (cv.experience ?? []).map((item) => ({
      title: pick(item.role, lang),
      organization: item.organization.trim(),
      location: item.location?.trim() ?? '',
      period: formatPeriod(item.startDate, item.endDate, Boolean(item.current), labels),
      startISO: isoMonth(item.startDate),
      endISO: item.current ? undefined : isoMonth(item.endDate),
      description: pick(item.description, lang),
      highlights: toLines(pick(item.highlights, lang)),
    })),
    education: (cv.education ?? []).map((item) => ({
      title: pick(item.degree, lang),
      organization: item.school.trim(),
      location: item.location?.trim() ?? '',
      period: formatPeriod(item.startDate, item.endDate, false, labels),
      startISO: isoMonth(item.startDate),
      endISO: isoMonth(item.endDate),
      description: pick(item.description, lang),
      highlights: [],
    })),
    skills: (cv.skills ?? [])
      .map((group) => ({
        category: pick(group.category, lang),
        items: toList(pick(group.items, lang)),
      }))
      .filter((group) => group.items.length > 0),
    languages: (cv.languages ?? []).map((item) => ({
      language: pick(item.language, lang),
      level: pick(item.level, lang),
    })),
    certifications: (cv.certifications ?? []).map((item) => ({
      name: pick(item.name, lang),
      issuer: item.issuer?.trim() ?? '',
      date: formatMonth(item.date, labels),
    })),
    hidePhoneOnWeb: cv.hidePhoneOnWeb ?? true,
  }
}

/** ASCII file name, e.g. "Tobias-Arud-CV-sv.pdf". */
export function pdfFileName(cv: ResolvedCV) {
  const base = cv.fullName
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Za-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `${base || 'CV'}-CV-${cv.lang}.pdf`
}
