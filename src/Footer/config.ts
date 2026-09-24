import type { GlobalConfig } from 'payload'

import { site } from '@/content/site'

import { revalidateFooter } from './hooks/revalidateFooter'

export const Footer: GlobalConfig = {
  slug: 'footer',
  label: 'Sidfot',
  admin: {
    group: 'Startsida',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Kontakt',
          fields: [
            {
              name: 'contactHeading',
              type: 'text',
              label: 'Rubrik',
              required: true,
              defaultValue: site.footer.contactHeading,
            },
            {
              name: 'email',
              type: 'email',
              label: 'E-post',
              required: true,
              defaultValue: site.footer.email,
            },
            {
              name: 'links',
              type: 'array',
              label: 'Länkar',
              maxRows: 6,
              defaultValue: site.footer.links,
              admin: {
                initCollapsed: true,
                components: {
                  RowLabel: '@/Footer/RowLabel#RowLabel',
                },
              },
              fields: [
                {
                  name: 'label',
                  type: 'text',
                  label: 'Text',
                  required: true,
                },
                {
                  name: 'url',
                  type: 'text',
                  label: 'Adress',
                  required: true,
                  admin: {
                    description: 'https://…, mailto:…, tel:… eller en intern sökväg som börjar med /.',
                  },
                  validate: (value: string | null | undefined) => {
                    if (!value) return 'Ange en adress.'

                    const url = value.trim()
                    if (url.startsWith('/') && !url.startsWith('//')) return true

                    try {
                      const parsed = new URL(url)
                      if (['http:', 'https:', 'mailto:', 'tel:'].includes(parsed.protocol)) return true
                    } catch {
                      // Invalid URL, handled below.
                    }

                    return 'Ange en giltig adress (https, mailto, tel eller en intern sökväg).'
                  },
                },
                {
                  name: 'newTab',
                  type: 'checkbox',
                  label: 'Öppna i ny flik',
                  defaultValue: true,
                },
              ],
            },
          ],
        },
        {
          label: 'Tillgänglighet',
          fields: [
            {
              name: 'accessibilityHeading',
              type: 'text',
              label: 'Rubrik',
              required: true,
              defaultValue: site.footer.accessibilityHeading,
            },
            {
              name: 'accessibilityText',
              type: 'textarea',
              label: 'Text',
              required: true,
              defaultValue: site.footer.accessibilityText,
            },
            {
              name: 'accessibilityNote',
              type: 'textarea',
              label: 'Kort notis',
              defaultValue: site.footer.accessibilityNote,
            },
          ],
        },
        {
          label: 'Nederkant',
          fields: [
            {
              name: 'copyrightName',
              type: 'text',
              label: 'Namn',
              required: true,
              defaultValue: site.footer.copyrightName,
              admin: {
                description: 'Visas efter året, till exempel “© 2026 Tobias Årud”.',
              },
            },
            {
              name: 'tagline',
              type: 'textarea',
              label: 'Kort beskrivning',
              defaultValue: site.footer.tagline,
            },
            {
              name: 'builtWith',
              type: 'text',
              label: 'Byggd med',
              defaultValue: site.footer.builtWith,
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
