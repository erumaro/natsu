import type { GlobalConfig } from 'payload'

import { site } from '@/content/site'

import { revalidateContact } from './hooks/revalidateContact'

export const Contact: GlobalConfig = {
  slug: 'contact',
  label: 'Kontaktformulär',
  admin: {
    group: 'Startsida',
    description:
      'Rubrik och ingress visas ovanför formuläret. Själva fälten, knapptexten, bekräftelsen och eventuella e-postutskick redigeras under Formulär. Inskickade meddelanden sparas under Meddelanden.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'heading',
      type: 'text',
      label: 'Rubrik',
      required: true,
      defaultValue: site.contact.heading,
    },
    {
      name: 'intro',
      type: 'textarea',
      label: 'Ingress',
      defaultValue: site.contact.intro,
    },
    {
      name: 'form',
      type: 'relationship',
      relationTo: 'forms',
      label: 'Formulär',
      admin: {
        description: 'Välj vilket formulär som visas i kontaktsektionen.',
      },
    },
  ],
  hooks: {
    afterChange: [revalidateContact],
  },
}
