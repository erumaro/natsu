import type { RequiredDataFromCollectionSlug } from 'payload'

import { site } from '@/content/site'

const confirmation = (text: string) => ({
  root: {
    type: 'root',
    children: [
      {
        type: 'paragraph',
        children: [
          {
            type: 'text',
            detail: 0,
            format: 0,
            mode: 'normal',
            style: '',
            text,
            version: 1,
          },
        ],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        textFormat: 0,
        version: 1,
      },
    ],
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  },
})

export const homeContactForm: RequiredDataFromCollectionSlug<'forms'> = {
  title: 'Kontakt',
  confirmationType: 'message',
  confirmationMessage: confirmation(site.contact.confirmation),
  submitButtonLabel: site.contact.submitLabel,
  fields: [
    {
      name: 'namn',
      blockName: 'namn',
      blockType: 'text',
      label: 'Namn',
      required: true,
      width: 100,
    },
    {
      name: 'email',
      blockName: 'email',
      blockType: 'email',
      label: 'E-post',
      required: true,
      width: 100,
    },
    {
      name: 'meddelande',
      blockName: 'meddelande',
      blockType: 'textarea',
      label: 'Meddelande',
      required: true,
      width: 100,
    },
  ],
}
