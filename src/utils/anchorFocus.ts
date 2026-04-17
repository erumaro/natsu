export function focusHashTarget(hash: string) {
    const el = document.querySelector(hash) as HTMLElement | null;
    if(!el) return;

    el.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
    requestAnimationFrame(() => {
        el.focus({ preventScroll: true });
    });
}