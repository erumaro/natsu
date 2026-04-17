import { Section } from "../layout/Section";
import { Heading } from "../layout/Heading";
import { site } from "../../content/site";

type CompetenceProps = {
    title: string
    intro: string
    items: string[]
}

function CompetenceCard({ title, intro, items }: CompetenceProps) {
    return(
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

            <p className="mt-4 text-neutral-700 max-w-prose">
                {intro}
            </p>

            <ul className="mt-6 space-y-3 text-neutral-700">
                {items.map((item) => (
                    <li key={item}>• {item}</li>
                ))}
            </ul>
        </article>
    )
}

export function Competence() {
    return (
        <Section id="competence" className="motion-fade scroll-mt-24" tabIndex={-1}>
            <Heading level={2}>Kompetens</Heading>

            <div className="mt-12 grid gap-12 md:grid-cols-3">
                {site.competences.map((competence) => (
                    <CompetenceCard
                        key={competence.title}
                        {...competence}
                    />
                ))}
            </div>
        </Section>
    )
}