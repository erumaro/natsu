import type { CollectionConfig } from 'payload'

export const Competences: CollectionConfig = {
  slug: 'competences',
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
      name: 'intro',
      type: 'textarea',
      required: true,
    },
    {
      name: 'items',
      type: 'array',
      fields: [
        {
          name: 'item',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
}
