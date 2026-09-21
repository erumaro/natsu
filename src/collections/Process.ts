import type { CollectionConfig } from 'payload'

export const Process: CollectionConfig = {
  slug: 'process',
  orderable: true,
  defaultSort: '_order',
  access: {
    read: () => true,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['step', 'title'],
  },
  fields: [
    {
      name: 'step',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
  ],
}
