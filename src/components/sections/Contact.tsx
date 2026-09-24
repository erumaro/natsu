import { Section } from '../layout/Section'
import { Heading } from '../layout/Heading'
import { site } from '../../content/site'
import { mailtoHref } from '../../utilities/safeHref'

import { ContactForm, type PublicContactForm } from './ContactForm'

export type ContactSectionData = {
  heading?: string | null
  intro?: string | null
  form?: PublicContactForm | null
}

interface ContactProps {
  data?: ContactSectionData | null
  fallbackEmail?: string | null
}

export function Contact({ data, fallbackEmail }: ContactProps) {
  const heading = data?.heading || site.contact.heading
  const intro = data?.intro || site.contact.intro
  const email = fallbackEmail || site.footer.email
  const emailHref = mailtoHref(email)

  return (
    <Section id="contact" className="motion-fade scroll-mt-24" tabIndex={-1} aria-labelledby="contact-heading">
      <Heading level={2} id="contact-heading">
        {heading}
      </Heading>

      {intro && (
        <p className="mt-5 max-w-prose text-neutral-700 dark:text-neutral-300">{intro}</p>
      )}

      <div className="mt-10">
        {data?.form ? (
          <ContactForm form={data.form} />
        ) : (
          <p className="max-w-prose text-neutral-700 dark:text-neutral-300">
            {site.contact.unavailable}{' '}
            {emailHref ? (
              <a
                href={emailHref}
                className="underline underline-offset-4 hover:text-falun-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-falun-600 focus-visible:ring-offset-2"
              >
                {email.replace(/^mailto:/i, '')}
              </a>
            ) : null}
          </p>
        )}
      </div>
    </Section>
  )
}
