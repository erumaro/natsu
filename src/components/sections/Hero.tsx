'use client'

import { Section } from '../layout/Section'
import { Heading } from '../layout/Heading'
import { useTheme } from '../../hooks/useTheme'
import { focusHashTarget } from '../../utils/anchorFocus'
import { site } from '../../content/site'

interface HeroData {
  title: string
  intro: string
  stack?: Array<{ skill: string } | string> | null
  ctaPrimary: string
  ctaSecondary: string
}

interface HeroProps {
  data?: HeroData
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="
        rounded-md border border-neutral-200
        px-3 py-2 text-sm
        transition-colors
        hover:bg-neutral-50
        dark:border-neutral-700 dark:hover:bg-neutral-800
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-falun-600
        focus-visible:ring-offset-2
      "
      aria-label="Växla färgläge"
    >
      {theme === 'dark' ? 'Ljust läge' : 'Mörkt läge'}
    </button>
  )
}

export function Hero({ data }: HeroProps) {
  const heroData = data || site.hero

  // Handle stack items - could be string or object with 'skill' property
  const stackItems = Array.isArray(heroData.stack)
    ? heroData.stack.map((item) => (typeof item === 'string' ? item : item.skill))
    : []

  return (
    <Section as="header">
      {/* Top bar */}
      <div className="mb-10 flex justify-end">
        <ThemeToggle />
      </div>

      {/* Heading */}
      <Heading level={1}>{heroData.title}</Heading>

      {/* Intro */}
      <p className="mt-5 max-w-prose text-lg text-neutral-700 dark:text-neutral-300">
        {heroData.intro}
      </p>

      {/* Stack */}
      <p className="mt-5 text-sm text-neutral-500 dark:text-neutral-400">
        {stackItems.join(' · ')}
      </p>

      {/* CTA */}
      <div className="mt-10 flex flex-wrap gap-4">
        <a
          href="#process"
          className={`
            interactive-lift
            inline-flex items-center justify-center
            rounded-lg bg-falun-600 px-6 py-3
            text-neutral-0
            hover:bg-falun-700
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-falun-600
            focus-visible:ring-offset-2
          `}
          onClick={(e) => {
            e.preventDefault()
            focusHashTarget('#process')
          }}
        >
          {heroData.ctaPrimary}
        </a>

        <a
          href="#competence"
          className={`
            interactive-lift
            inline-flex items-center justify-center
            rounded-lg border border-neutral-200
            px-6 py-3
            hover:bg-neutral-50
            dark:border-neutral-700 dark:hover:bg-neutral-800
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-falun-600
            focus-visible:ring-offset-2
          `}
          onClick={(e) => {
            e.preventDefault()
            focusHashTarget('#competence')
          }}
        >
          {heroData.ctaSecondary}
        </a>
      </div>
    </Section>
  )
}
