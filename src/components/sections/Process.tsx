import { Section } from "../layout/Section";
import { Heading } from "../layout/Heading";
import { site } from '../../content/site';

type ProccessStepProps = {
    step: string,
    title: string,
    description: string
}

function ProccessStep({ step, title, description }: ProccessStepProps) {
    return(
        <li className="motion-fade">
            <span className="text-sm text-falun-600 font-medium">
                {step}
            </span>

            <Heading level={3} className="mt-2">
                {title}
            </Heading>

            <p className="mt-4 max-w-prose text-neutral-700">
                {description}
            </p>
        </li>
    )
}

export function Process() {
    return(
        <Section id="process" muted className="motion-fade scroll-mt-24" tabIndex={-1}>
            <Heading level={2}>Så jobbar jag</Heading>

            <ol className="mt-12 space-y-12">
                {site.process.map((step) => (
                    <ProccessStep
                        key={step.step}
                        {...step}
                    />
                ))}
            </ol>
        </Section>
    )
}