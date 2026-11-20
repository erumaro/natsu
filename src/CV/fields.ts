import type { Field } from 'payload'

type TranslatedOptions = {
  label: string
  type?: 'text' | 'textarea'
  required?: boolean
  description?: string
}

/**
 * A group with a Swedish and an English value side by side. Swedish is the
 * primary language; an empty English value falls back to the Swedish one.
 */
export function translated(
  name: string,
  { label, type = 'text', required = false, description }: TranslatedOptions,
): Field {
  return {
    name,
    type: 'group',
    label,
    admin: { hideGutter: true, description },
    fields: [
      {
        type: 'row',
        fields: [
          { name: 'sv', type, label: 'Svenska', required, admin: { width: '50%' } },
          { name: 'en', type, label: 'English', admin: { width: '50%' } },
        ],
      },
    ],
  } as Field
}

export const monthField = (name: string, label: string, required = false): Field => ({
  name,
  type: 'date',
  label,
  required,
  admin: {
    width: '50%',
    date: { pickerAppearance: 'monthOnly', displayFormat: 'MMM yyyy' },
  },
})
