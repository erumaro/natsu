import React from 'react'

const links = [
  { href: '/cv/sv/pdf', label: 'PDF (svenska)' },
  { href: '/cv/en/pdf', label: 'PDF (English)' },
  { href: '/cv/sv', label: 'Webbsida (svenska)' },
  { href: '/cv/en', label: 'Webbsida (English)' },
]

export function AdminDownloadLinks() {
  return (
    <div style={{ marginBottom: 'var(--base)' }}>
      <p style={{ marginBottom: 'calc(var(--base) / 2)' }}>
        Förhandsgranska den senast sparade versionen:
      </p>
      <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--base)', listStyle: 'none', padding: 0, margin: 0 }}>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} target="_blank" rel="noopener noreferrer">
              {link.label}
              <span className="sr-only"> (öppnas i ny flik)</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}
