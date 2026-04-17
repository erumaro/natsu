import { Section } from "../layout/Section";
import { Heading } from "../layout/Heading";

export function Footer() {
  return (
    <Section
      as="footer"
      muted
      className="bg-neutral-50 border-t border-neutral-200
      dark:bg-neutral-950 dark:border-neutral-800"
    >
      {/* Top Grid: Kontakt + Tillgänglighet */}
      <div className="grid gap-12 md:grid-cols-2">
        {/* Kontakt */}
        <div>
          <Heading level={3}>Kontakt</Heading>

          <address className="mt-5 not-italic text-neutral-700 dark:text-neutral-300 space-y-2">
            <p>
              <a
                href="mailto:hej@example.se"
                className="
                  underline underline-offset-4
                  transition-colors
                  hover:text-falun-600
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-falun-600
                  focus-visible:ring-offset-2
                "
              >
                hej@example.se
              </a>
            </p>

            <p className="flex flex-wrap gap-x-2">
              <a
                href="https://www.linkedin.com/"
                className="
                  underline underline-offset-4
                  transition-colors
                  hover:text-falun-600
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-falun-600
                  focus-visible:ring-offset-2
                "
              >
                LinkedIn
              </a>
              
              <span aria-hidden="true">·</span>

              <a
                href="https://github.com/"
                className="
                  underline underline-offset-4
                  transition-colors
                  hover:text-falun-600
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-falun-600
                  focus-visible:ring-offset-2
                "
              >
                GitHub
              </a>
            </p>
          </address>
        </div>

        {/* Tillgänglighet */}
        <div>
          <Heading level={3}>Tillgänglighet</Heading>

          <p className="mt-5 text-neutral-700 dark:text-neutral-300 max-w-prose">
            Den här webbplatsen är byggd med tillgänglighet som grundprincip. Fokus ligger på semantisk HTML, tangentbordsnavigering, tydliga kontraster och kompatibilitet med skärmläsare.
          </p>

          <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            Upplever du problem eller har förbättringsförslag är du välkommen att höra av dig.
          </p>
        </div>
      </div>

      {/* Divider */}
      <div className="my-14 h-px bg-neutral-200 dark:bg-neutral-800" />

      {/* Bottom Row: Copyright + Byggd med */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
        {/* Left */}
        <div className="text-center md:text-left text-neutral-600 space-y-1">
          <p>© {new Date().getFullYear()} Tobias Årud</p>
          <p className="text-neutral-500">
            Webbutveckling med fokus på tillgänglighet och långsiktig kvalitet.
          </p>
        </div>

        {/* Right */}
        <div className="text-center md:text-right text-neutral-500">
          <span className="opacity-80">
            Byggd med React och Tailwind CSS
          </span>
        </div>
      </div>
    </Section>
  );
}