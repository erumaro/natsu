import path from 'path'
import PDFDocument from 'pdfkit'

import type { ResolvedCV, ResolvedEntry } from './resolve'

// PDF/UA requires every font to be embedded, so the PDF never falls back to
// pdfkit's built-in (non-embedded) Helvetica. These files are traced into the
// server bundle via `outputFileTracingIncludes` in next.config.js.
const FONT_DIR = path.join(process.cwd(), 'node_modules', 'geist', 'dist', 'fonts', 'geist-sans')
const FONTS = {
  regular: path.join(FONT_DIR, 'Geist-Regular.woff2'),
  medium: path.join(FONT_DIR, 'Geist-Medium.woff2'),
  bold: path.join(FONT_DIR, 'Geist-SemiBold.woff2'),
} as const

// All text colours meet WCAG AA (≥ 4.5:1) against white.
const COLORS = {
  heading: '#111827',
  text: '#1f2937',
  muted: '#4b5563',
  rule: '#9ca3af',
}

const BODY_SIZE = 10.5
const LINE_GAP = 2
const BULLET_INDENT = 14

type Struct = ReturnType<PDFKit.PDFDocument['struct']>

type WriteOptions = {
  font?: keyof typeof FONTS
  size?: number
  color?: string
  x?: number
  y?: number
  width?: number
}

/**
 * Renders a single-column, tagged PDF (PDF/UA-1) with real, selectable text in
 * logical reading order. No tables, columns, images, or text in headers/footers,
 * which are the usual reasons ATS parsers drop or scramble content.
 */
export function renderCVPdf(cv: ResolvedCV): Promise<Buffer> {
  const { labels } = cv

  const doc = new PDFDocument({
    size: 'A4',
    margin: 56,
    pdfVersion: '1.7',
    subset: 'PDF/UA',
    tagged: true,
    displayTitle: true,
    lang: labels.langTag,
    font: FONTS.regular,
    info: {
      Title: `${cv.fullName} – ${labels.document}`,
      Author: cv.fullName,
      Subject: [cv.headline, labels.document].filter(Boolean).join(' – '),
      Keywords: cv.skills.flatMap((group) => group.items).join(', '),
    },
  })

  for (const [name, file] of Object.entries(FONTS)) doc.registerFont(name, file)

  const chunks: Buffer[] = []
  const done = new Promise<Buffer>((resolve, reject) => {
    doc.on('data', (chunk: Buffer) => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)
  })

  const left = doc.page.margins.left
  const contentWidth = doc.page.width - left - doc.page.margins.right

  const write = (
    text: string,
    { font = 'regular', size = BODY_SIZE, color = COLORS.text, x = left, y = doc.y, width = contentWidth }: WriteOptions = {},
  ) => {
    doc.font(font).fontSize(size).fillColor(color).text(text, x, y, { width, lineGap: LINE_GAP })
  }

  const measure = (text: string, { font = 'regular', size = BODY_SIZE, width = contentWidth }: WriteOptions = {}) =>
    doc.font(font).fontSize(size).heightOfString(text, { width, lineGap: LINE_GAP })

  // Page breaks only happen between tagged blocks, never inside an open marked-content sequence.
  const ensureSpace = (height: number) => {
    if (doc.y + height > doc.page.height - doc.page.margins.bottom) doc.addPage()
  }

  const leaf = (parent: Struct, type: string, draw: () => void) => {
    parent.add(doc.struct(type as never, draw))
  }

  const rule = () => {
    const y = doc.y + 3
    doc.markContent('Artifact', { type: 'Layout' })
    doc
      .save()
      .moveTo(left, y)
      .lineTo(left + contentWidth, y)
      .lineWidth(0.75)
      .strokeColor(COLORS.rule)
      .stroke()
      .restore()
    doc.endMarkedContent()
    doc.y = y + 8
  }

  const bulletList = (parent: Struct, items: string[]) => {
    if (items.length === 0) return

    const list = doc.struct('L')
    parent.add(list)
    doc.moveDown(0.25)

    const bodyX = left + BULLET_INDENT
    const bodyWidth = contentWidth - BULLET_INDENT

    for (const item of items) {
      ensureSpace(measure(item, { width: bodyWidth }))
      const y = doc.y

      const listItem = doc.struct('LI')
      list.add(listItem)
      leaf(listItem, 'Lbl', () => {
        doc.font('regular').fontSize(BODY_SIZE).fillColor(COLORS.text).text('•', left + 3, y, { lineBreak: false })
      })
      leaf(listItem, 'LBody', () => write(item, { x: bodyX, y, width: bodyWidth }))
      listItem.end()

      doc.moveDown(0.15)
    }

    list.end()
  }

  const root = doc.struct('Document')
  doc.addStructure(root)

  const section = (heading: string, build: (sect: Struct) => void) => {
    const sect = doc.struct('Sect')
    root.add(sect)

    doc.moveDown(1)
    ensureSpace(70)
    leaf(sect, 'H2', () => write(heading, { font: 'bold', size: 13, color: COLORS.heading }))
    rule()
    build(sect)

    sect.end()
  }

  const entry = (parent: Struct, item: ResolvedEntry) => {
    const meta = [item.organization, item.location, item.period].filter(Boolean).join('  ·  ')

    ensureSpace(measure(item.title, { font: 'bold', size: 11.5 }) + measure(meta, { size: 10 }) + 20)

    const div = doc.struct('Div')
    parent.add(div)

    leaf(div, 'H3', () => write(item.title, { font: 'bold', size: 11.5, color: COLORS.heading }))
    if (meta) leaf(div, 'P', () => write(meta, { size: 10, color: COLORS.muted }))

    if (item.description) {
      doc.moveDown(0.25)
      leaf(div, 'P', () => write(item.description))
    }

    bulletList(div, item.highlights)
    div.end()

    doc.moveDown(0.7)
  }

  // Header: name, title and contact details as plain text so parsers can find them.
  const header = doc.struct('Sect')
  root.add(header)

  leaf(header, 'H1', () => write(cv.fullName, { font: 'bold', size: 22, color: COLORS.heading }))
  if (cv.headline) {
    leaf(header, 'P', () => write(cv.headline, { font: 'medium', size: 12.5, color: COLORS.muted }))
  }

  const contact = [
    cv.email && `${labels.email}: ${cv.email}`,
    cv.phone && `${labels.phone}: ${cv.phone}`,
    cv.location && `${labels.location}: ${cv.location}`,
    ...cv.links.map((link) => `${link.label}: ${link.display}`),
  ].filter(Boolean) as string[]

  if (contact.length > 0) {
    doc.moveDown(0.4)
    leaf(header, 'P', () => write(contact.join('  ·  '), { size: 10, color: COLORS.text }))
  }

  header.end()

  if (cv.summary) {
    section(labels.summary, (sect) => leaf(sect, 'P', () => write(cv.summary)))
  }

  if (cv.experience.length > 0) {
    section(labels.experience, (sect) => cv.experience.forEach((item) => entry(sect, item)))
  }

  if (cv.education.length > 0) {
    section(labels.education, (sect) => cv.education.forEach((item) => entry(sect, item)))
  }

  if (cv.skills.length > 0) {
    section(labels.skills, (sect) => {
      for (const group of cv.skills) {
        const items = group.items.join(', ')
        ensureSpace(measure(`${group.category}: ${items}`))

        leaf(sect, 'P', () => {
          doc.fillColor(COLORS.heading)
          if (group.category) {
            doc
              .font('bold')
              .fontSize(BODY_SIZE)
              .text(`${group.category}: `, left, doc.y, { width: contentWidth, lineGap: LINE_GAP, continued: true })
            doc.font('regular').fillColor(COLORS.text).text(items)
          } else {
            write(items)
          }
        })

        doc.moveDown(0.3)
      }
    })
  }

  if (cv.languages.length > 0) {
    section(labels.languages, (sect) =>
      bulletList(
        sect,
        cv.languages.map((item) => [item.language, item.level].filter(Boolean).join(' – ')),
      ),
    )
  }

  if (cv.certifications.length > 0) {
    section(labels.certifications, (sect) =>
      bulletList(
        sect,
        cv.certifications.map((item) => [item.name, item.issuer, item.date].filter(Boolean).join(', ')),
      ),
    )
  }

  root.end()
  doc.end()

  return done
}
