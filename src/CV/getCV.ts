import configPromise from '@payload-config'
import { headers } from 'next/headers'
import { getPayload } from 'payload'

import type { Cv } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'

/**
 * Returns the CV if it is published, or if the request comes from a logged-in
 * admin (so the CV can be previewed before it is made public).
 */
export async function getViewableCV(): Promise<Cv | null> {
  const cv = (await getCachedGlobal('cv', 0)()) as Cv | null

  if (!cv?.fullName) return null
  if (cv.published) return cv

  const payload = await getPayload({ config: configPromise })
  const { user } = await payload.auth({ headers: await headers() })

  return user ? cv : null
}
