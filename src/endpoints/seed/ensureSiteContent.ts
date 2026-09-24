import type { Payload } from 'payload'

import { site } from '@/content/site'

import { homeContactForm } from './home-contact-form'

export async function ensureSiteContent(payload: Payload) {
  try {
    const existingForms = await payload.find({
      collection: 'forms',
      depth: 0,
      limit: 1,
      overrideAccess: true,
      pagination: false,
      where: {
        title: {
          equals: homeContactForm.title,
        },
      },
    })

    const form =
      existingForms.docs[0] ??
      (await payload.create({
        collection: 'forms',
        data: homeContactForm,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
      }))

    const contact = await payload.findGlobal({
      slug: 'contact',
      depth: 0,
      overrideAccess: true,
    })

    const linkedFormId = typeof contact.form === 'string' ? contact.form : contact.form?.id

    if (!linkedFormId || !contact.heading) {
      await payload.updateGlobal({
        slug: 'contact',
        depth: 0,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
        data: {
          heading: contact.heading || site.contact.heading,
          intro: contact.intro || site.contact.intro,
          form: linkedFormId || form.id,
        },
      })
    }

    const footer = await payload.findGlobal({
      slug: 'footer',
      depth: 0,
      overrideAccess: true,
    })

    if (!footer.email || footer.links == null) {
      await payload.updateGlobal({
        slug: 'footer',
        depth: 0,
        overrideAccess: true,
        context: {
          disableRevalidate: true,
        },
        data: {
          contactHeading: footer.contactHeading || site.footer.contactHeading,
          email: footer.email || site.footer.email,
          links: footer.links?.length ? footer.links : site.footer.links,
          accessibilityHeading: footer.accessibilityHeading || site.footer.accessibilityHeading,
          accessibilityText: footer.accessibilityText || site.footer.accessibilityText,
          accessibilityNote: footer.accessibilityNote || site.footer.accessibilityNote,
          copyrightName: footer.copyrightName || site.footer.copyrightName,
          tagline: footer.tagline || site.footer.tagline,
          builtWith: footer.builtWith || site.footer.builtWith,
        },
      })
    }
  } catch (error) {
    payload.logger.error({ err: error, msg: 'Failed to ensure homepage contact content' })
  }
}
