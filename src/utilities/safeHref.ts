const SAFE_PROTOCOLS = new Set(['http:', 'https:', 'mailto:', 'tel:'])

export function safeHref(value: string | null | undefined): string | null {
  if (!value) return null

  const url = value.trim()
  if (!url) return null
  if (url.startsWith('/') && !url.startsWith('//')) return url

  try {
    const parsed = new URL(url)
    if (SAFE_PROTOCOLS.has(parsed.protocol)) return url
  } catch {
    return null
  }

  return null
}

export function mailtoHref(email: string | null | undefined): string | null {
  if (!email) return null

  const trimmed = email.trim()
  if (!trimmed) return null

  return safeHref(trimmed.startsWith('mailto:') ? trimmed : `mailto:${trimmed}`)
}
