import { ReactNode, HTMLAttributes, ElementType } from "react";
import { Container } from "./Container";

type Props = {
    children: ReactNode
    as?: ElementType
    muted?: boolean
} & HTMLAttributes<HTMLElement>

export function Section({
    children,
    as: Component = 'section',
    muted = false,
    className,
    ...props
}: Props) {
    return(
        <Component
            className={[
                'py-24',
                muted ? 'bg-neutral-50' : '',
                className // ← viktigt!
            ].join(' ')}
            {...props}
        >
            <Container>{children}</Container>
        </Component>
    )
}