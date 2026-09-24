'use client'

import { RowLabelProps, useRowLabel } from '@payloadcms/ui'

type FooterLinkRow = {
  label?: string | null
}

export const RowLabel: React.FC<RowLabelProps> = () => {
  const data = useRowLabel<FooterLinkRow>()

  const label = data?.data?.label
    ? `Länk ${data.rowNumber !== undefined ? data.rowNumber + 1 : ''}: ${data.data.label}`
    : 'Länk'

  return <div>{label}</div>
}
