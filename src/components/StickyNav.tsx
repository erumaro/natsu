import { useEffect, useRef, useState } from 'react';

const sections = [
  { id: 'process', label: 'Så jobbar jag' },
  { id: 'competence', label: 'Teknik & kompetens' },
  { id: 'examples', label: 'Exempel & resonemang' },
];

export default function StickyNav() {
  const [active, setActive] = useState<string>('competence');
  const [style, setStyle] = useState({ width: 0, left: 0 });

  const refs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActive(id);
          }
        },
        {
          rootMargin: '-35% 0px -55% 0px',
        }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach(o => o.disconnect());
  }, []);

  // 🔥 Flytta underline
  useEffect(() => {
    const el = refs.current[active];
    if (!el) return;

    setStyle({
      width: el.offsetWidth,
      left: el.offsetLeft,
    });
  }, [active]);
  return (
    <nav className="sticky top-0 z-40 border-b border-neutral-200 backdrop-blur">
      <div className="relative mx-auto max-w-5xl px-6">
        <ul className="relative flex h-14 items-center gap-8 text-sm font-medium">
          {sections.map(({ id, label }) => (
            <li key={id}>
              <a
                ref={(el) => {refs.current[id] = el}}
                href={`#${id}`}
                className={`
                  relative inline-block py-2
                  transition-colors
                  ${
                    active === id
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white'
                  }
                `}
                aria-current={active === id ? 'true' : undefined}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* 🔥 Sliding underline */}
        <span
          className="absolute bottom-0 h-[2px] bg-falun-600 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            width: style.width,
            transform: `translateX(${style.left}px)`,
          }}
        />
      </div>
    </nav>
  );
}