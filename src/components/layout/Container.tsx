import { ReactNode } from "react";

type Props = {
    children: ReactNode
}

export function Container({ children }: Props) {
    return (
        <div className="mx-auto w-full max-w-5xl px-6">
            {children}
        </div>
    )
}