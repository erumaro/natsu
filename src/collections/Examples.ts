import type { CollectionConfig } from 'payload'

export const Examples: CollectionConfig = {
  slug: 'examples',
  orderable: true,
  defaultSort: '_order',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'problem',
      type: 'textarea',
      required: true,
    },
    {
      name: 'solution',
      type: 'textarea',
      required: true,
    },
    {
      name: 'result',
      type: 'textarea',
      required: true,
    },
  ],
}
