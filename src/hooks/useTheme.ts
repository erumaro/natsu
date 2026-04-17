import { useEffect, useState } from "react";

type Theme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

function getInitialTheme(): Theme {
    if(typeof window === 'undefined') return 'light'

    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null
    if(stored) return stored

    const prefersDark = window.matchMedia(
        '(prefers-color-scheme: dark)'
    ).matches

    return prefersDark ? 'dark' : 'light'
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem(STORAGE_KEY, theme)
    }, [theme])

    const toggleTheme = () => 
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

    return { theme, toggleTheme }
}