import { getViewableCV } from '@/CV/getCV'
import { isCVLang } from '@/CV/labels'
import { renderCVPdf } from '@/CV/pdf'
import { pdfFileName, resolveCV } from '@/CV/resolve'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params
  if (!isCVLang(lang)) return new Response('Not found', { status: 404 })

  const cv = await getViewableCV()
  if (!cv) return new Response('Not found', { status: 404 })

  const resolved = resolveCV(cv, lang)
  const pdf = await renderCVPdf(resolved)
  const fileName = pdfFileName(resolved)

  return new Response(new Uint8Array(pdf), {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
      'Content-Language': resolved.labels.langTag,
      'Cache-Control': 'no-store',
      ...(cv.published ? {} : { 'X-Robots-Tag': 'noindex' }),
    },
  })
}
