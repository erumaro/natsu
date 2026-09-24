import { Section } from '../layout/Section'
import { Heading } from '../layout/Heading'
import { site } from '../../content/site'
import { mailtoHref, safeHref } from '../../utilities/safeHref'

export type FooterLink = {
  label?: string | null
  url?: string | null
  newTab?: boolean | null
}

export type FooterContent = {
  contactHeading?: string | null
  email?: string | null
  links?: FooterLink[] | null
  accessibilityHeading?: string | null
  accessibilityText?: string | null
  accessibilityNote?: string | null
  copyrightName?: string | null
  tagline?: string | null
  builtWith?: string | null
}

const linkClassName = `
  underline underline-offset-4
  transition-colors
  hover:text-falun-600
  focus-visible:outline-none
  focus-visible:ring-2
  focus-visible:ring-falun-600
  focus-visible:ring-offset-2
`

interface FooterProps {
  data?: FooterContent | null
}

export function Footer({ data }: FooterProps) {
  const footer = site.footer
  const email = data?.email || footer.email
  const emailHref = mailtoHref(email)
  const links = (data?.links ?? footer.links).flatMap((link) => {
    const href = safeHref(link.url)
    const label = link.label?.trim()
    if (!href || !label) return []

    return [
      {
        href,
        label,
        newTab: Boolean(link.newTab),
      },
    ]
  })

  return (
    <Section
      as="footer"
      muted
      className="bg-neutral-50 border-t border-neutral-200
      dark:bg-neutral-950 dark:border-neutral-800"
    >
      <div className="grid gap-12 md:grid-cols-2">
        <div>
          <Heading level={3}>{data?.contactHeading || footer.contactHeading}</Heading>

          <address className="mt-5 not-italic text-neutral-700 dark:text-neutral-300 space-y-2">
            <p>
              {emailHref ? (
                <a href={emailHref} className={linkClassName}>
                  {email.replace(/^mailto:/i, '')}
                </a>
              ) : (
                email
              )}
            </p>

            {links.length > 0 && (
              <p className="flex flex-wrap gap-x-2">
                {links.map((link, index) => (
                  <span key={`${link.href}-${link.label}`} className="contents">
                    {index > 0 && <span aria-hidden="true">·</span>}
                    <a
                      href={link.href}
                      className={linkClassName}
                      {...(link.newTab
                        ? { target: '_blank', rel: 'noopener noreferrer' }
                        : {})}
                    >
                      {link.label}
                      {link.newTab && <span className="sr-only"> (öppnas i ny flik)</span>}
                    </a>
                  </span>
                ))}
              </p>
            )}
          </address>
        </div>

        <div>
          <Heading level={3}>
            {data?.accessibilityHeading || footer.accessibilityHeading}
          </Heading>

          <p className="mt-5 text-neutral-700 dark:text-neutral-300 max-w-prose">
            {data?.accessibilityText || footer.accessibilityText}
          </p>

          {(data?.accessibilityNote || footer.accessibilityNote) && (
            <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
              {data?.accessibilityNote || footer.accessibilityNote}
            </p>
          )}
        </div>
      </div>

      <div className="my-14 h-px bg-neutral-200 dark:bg-neutral-800" />

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        <div className="text-center md:text-left text-neutral-600 space-y-1">
          <p>
            © {new Date().getFullYear()} {data?.copyrightName || footer.copyrightName}
          </p>
          {(data?.tagline || footer.tagline) && (
            <p className="text-neutral-500">{data?.tagline || footer.tagline}</p>
          )}
        </div>

        {(data?.builtWith || footer.builtWith) && (
          <div className="text-center md:text-right text-neutral-500">
            <span className="opacity-80">{data?.builtWith || footer.builtWith}</span>
          </div>
        )}
      </div>
    </Section>
  )
}
