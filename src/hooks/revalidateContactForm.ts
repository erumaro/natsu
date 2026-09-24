import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

export const revalidateContactForm: CollectionAfterChangeHook = ({
  req: { context, payload },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating contact form')

    revalidateTag('global_contact')
  }
}
