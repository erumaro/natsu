import { ReactNode, HTMLAttributes } from "react";

type Level = 1 | 2 | 3

type Props = {
    level: Level,
    children: ReactNode
} & HTMLAttributes<HTMLElement>

export function Heading({ level, children, className, ...props }: Props) {
    const Tag = `h${level}` as const

    const styles = {
        1: 'text-5xl font-semibold tracking-tight',
        2: 'text-3xl font-semibold tracking-tight',
        3: 'text-xl font-medium',
    }

    return (
        <Tag className={[styles[level], className].filter(Boolean).join(' ')} {...props}>
            {children}
        </Tag>
    )
}