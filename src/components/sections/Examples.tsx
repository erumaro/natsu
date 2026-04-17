import { Section } from "../layout/Section";
import { Heading } from "../layout/Heading";
import { site } from '../../content/site'

type ExampleProps = {
    title: string
    problem: string
    solution: string
    result?: string
}

function Example({ title, problem, solution, result }: ExampleProps) {
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

            <dl className="mt-6 space-y-3 text-neutral-700 max-w-prose">
                <div>
                    <dt className="text-sm font-medium text-neutral-900">
                        Problem
                    </dt>
                    <dd>{problem}</dd>
                </div>

                <div>
                    <dt className="text-sm font-medium text-neutral-900">
                        Lösning
                    </dt>
                    <dd>{solution}</dd>
                </div>

                {result && (
                    <div>
                        <dt className="text-sm font-medium text-neutral-900">
                            Resultat
                        </dt>
                        <dd>{result}</dd>
                    </div>
                )}
            </dl>
        </article>
    )
}

export function Examples() {
    return (
        <Section id="examples" muted className="motion-fade scroll-mt-24" tabIndex={-1}>
            <Heading level={2}>Exempel & resonemang</Heading>

            <div className="mt-12 grid gap-8 md:grid-cols-2">
                {site.examples.map((example, index) => (
                    <Example 
                        key={example.title ?? index}
                        {...example}
                    />
                ))}
            </div>
        </Section>
    )
}