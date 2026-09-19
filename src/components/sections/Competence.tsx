import { Section } from '../layout/Section'
import { Heading } from '../layout/Heading'
import { site } from '../../content/site'

type CompetenceItemData = {
  title: string
  intro: string
  items?: Array<{ item: string } | string> | null
}

type CompetenceProps = {
  title: string
  intro: string
  items: string[] | Array<{ item: string } | string>
}

interface CompetencesSectionProps {
  data?: CompetenceItemData[]
}

function CompetenceCard({ title, intro, items }: CompetenceProps) {
  // Handle both string array and object array
  const itemsList = Array.isArray(items)
    ? items.map((item) => (typeof item === 'string' ? item : item.item))
    : []

  return (
    <article
      className="
            motion-fade
            rounded-lg
            border
            border-neutral-200
            p-6
            transition
            hover:-translate-y-1
            hover:shadow-lg
            focus-within:shadow-lg
        "
    >
      <Heading level={3}>{title}</Heading>

      <p className="mt-4 text-neutral-700 max-w-prose">{intro}</p>

      <ul className="mt-6 space-y-3 text-neutral-700">
        {itemsList.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </article>
  )
}

export function Competence({ data }: CompetencesSectionProps) {
  const competenceData = data && data.length > 0 ? data : site.competences

  return (
    <Section id="competence" className="motion-fade scroll-mt-24" tabIndex={-1}>
      <Heading level={2}>Kompetens</Heading>

      <div className="mt-12 grid gap-12 md:grid-cols-3">
        {competenceData.map((competence) => (
          <CompetenceCard
            key={competence.title}
            title={competence.title}
            intro={competence.intro}
            items={competence.items ?? []}
          />
        ))}
      </div>
    </Section>
  )
}
