import type { GlobalConfig } from 'payload'

import { authenticated } from '@/access/authenticated'

import { monthField, translated } from './fields'
import { revalidateCV } from './hooks/revalidateCV'

export const CV: GlobalConfig = {
  slug: 'cv',
  label: 'CV',
  admin: {
    group: 'CV',
    description:
      'CV på svenska och engelska. Engelska fält som lämnas tomma visar den svenska texten. Spara innan du laddar ner PDF:en.',
  },
  // Contact details live here, so the REST/GraphQL API stays private.
  // The /cv pages read through the local API and check `published` themselves.
  access: {
    read: authenticated,
    update: authenticated,
  },
  fields: [
    {
      name: 'downloads',
      type: 'ui',
      admin: {
        components: {
          Field: '@/CV/AdminDownloadLinks#AdminDownloadLinks',
        },
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Personuppgifter',
          fields: [
            { name: 'fullName', type: 'text', label: 'Namn', required: true },
            translated('headline', {
              label: 'Titel',
              description: 'T.ex. "Frontendutvecklare" / "Frontend Developer".',
            }),
            {
              type: 'row',
              fields: [
                { name: 'email', type: 'email', label: 'E-post', admin: { width: '50%' } },
                { name: 'phone', type: 'text', label: 'Telefon', admin: { width: '50%' } },
              ],
            },
            translated('location', { label: 'Ort', description: 'T.ex. "Stockholm".' }),
            {
              name: 'links',
              type: 'array',
              label: 'Länkar',
              labels: { singular: 'Länk', plural: 'Länkar' },
              admin: {
                description:
                  'Skrivs ut som text (t.ex. linkedin.com/in/namn) så att både ATS-system och människor kan läsa dem.',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'label',
                      type: 'text',
                      label: 'Etikett',
                      required: true,
                      admin: { width: '30%', placeholder: 'LinkedIn' },
                    },
                    {
                      name: 'url',
                      type: 'text',
                      label: 'URL',
                      required: true,
                      admin: { width: '70%', placeholder: 'https://www.linkedin.com/in/...' },
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Profil',
          fields: [
            translated('summary', {
              label: 'Sammanfattning',
              type: 'textarea',
              description:
                'Några meningar om vem du är och vad du söker. Använd gärna nyckelord från annonserna du söker.',
            }),
          ],
        },
        {
          label: 'Erfarenhet',
          fields: [
            {
              name: 'experience',
              type: 'array',
              label: 'Arbetslivserfarenhet',
              labels: { singular: 'Anställning', plural: 'Anställningar' },
              admin: { description: 'Lägg den senaste först.' },
              fields: [
                translated('role', { label: 'Roll', required: true }),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'organization',
                      type: 'text',
                      label: 'Arbetsgivare',
                      required: true,
                      admin: { width: '50%' },
                    },
                    { name: 'location', type: 'text', label: 'Ort', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    monthField('startDate', 'Start', true),
                    {
                      ...monthField('endDate', 'Slut'),
                      admin: {
                        width: '50%',
                        date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
                        condition: (_, siblingData) => !siblingData?.current,
                      },
                    },
                  ],
                },
                { name: 'current', type: 'checkbox', label: 'Pågående' },
                translated('description', { label: 'Beskrivning', type: 'textarea' }),
                translated('highlights', {
                  label: 'Punkter',
                  type: 'textarea',
                  description: 'En punkt per rad. Börja gärna med ett verb och ett mätbart resultat.',
                }),
              ],
            },
          ],
        },
        {
          label: 'Utbildning',
          fields: [
            {
              name: 'education',
              type: 'array',
              label: 'Utbildning',
              labels: { singular: 'Utbildning', plural: 'Utbildningar' },
              admin: { description: 'Lägg den senaste först.' },
              fields: [
                translated('degree', { label: 'Utbildning / examen', required: true }),
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'school',
                      type: 'text',
                      label: 'Skola',
                      required: true,
                      admin: { width: '50%' },
                    },
                    { name: 'location', type: 'text', label: 'Ort', admin: { width: '50%' } },
                  ],
                },
                {
                  type: 'row',
                  fields: [monthField('startDate', 'Start'), monthField('endDate', 'Slut')],
                },
                translated('description', { label: 'Beskrivning', type: 'textarea' }),
              ],
            },
          ],
        },
        {
          label: 'Kompetenser',
          fields: [
            {
              name: 'skills',
              type: 'array',
              label: 'Kompetenser',
              labels: { singular: 'Kompetensgrupp', plural: 'Kompetensgrupper' },
              fields: [
                translated('category', {
                  label: 'Kategori',
                  required: true,
                  description: 'T.ex. "Frontend" eller "Tillgänglighet" / "Accessibility".',
                }),
                translated('items', {
                  label: 'Kompetenser',
                  type: 'textarea',
                  required: true,
                  description:
                    'Kommaseparerade. Skriv ut både förkortning och fullt namn när det är vanligt i annonser, t.ex. "WCAG 2.2".',
                }),
              ],
            },
            {
              name: 'languages',
              type: 'array',
              label: 'Språk',
              labels: { singular: 'Språk', plural: 'Språk' },
              fields: [
                translated('language', { label: 'Språk', required: true }),
                translated('level', { label: 'Nivå', description: 'T.ex. "Modersmål" / "Native".' }),
              ],
            },
            {
              name: 'certifications',
              type: 'array',
              label: 'Certifieringar och kurser',
              labels: { singular: 'Certifiering', plural: 'Certifieringar' },
              fields: [
                translated('name', { label: 'Namn', required: true }),
                {
                  type: 'row',
                  fields: [
                    { name: 'issuer', type: 'text', label: 'Utfärdare', admin: { width: '50%' } },
                    monthField('date', 'Datum'),
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Publicering',
          fields: [
            {
              name: 'published',
              type: 'checkbox',
              label: 'Visa CV:t publikt på /cv',
              defaultValue: false,
              admin: {
                description:
                  'När rutan är urkryssad kan bara inloggade användare se webbsidan och ladda ner PDF:en.',
              },
            },
            {
              name: 'hidePhoneOnWeb',
              type: 'checkbox',
              label: 'Dölj telefonnumret på webbsidan',
              defaultValue: true,
              admin: {
                description: 'Telefonnumret finns alltid med i PDF:en.',
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCV],
  },
}
