export const site = {
  hero: {
    title: 'Tillgängliga och framtidssäkra webbplatser',
    intro:
      'Jag bygger moderna webbplatser med fokus på tillgänglighet, prestanda och långsiktig kvalitet. Jag trivs särskilt i komplexa problem där analys, utforskande och genomtänkta lösningar gör verklig skillnad.',
    stack: ['WordPress', 'Next.js', 'React', 'PHP', 'WCAG'],
    ctaPrimary: 'Så jobbar jag',
    ctaSecondary: 'Teknik & kompetens',
  },

  competences: [
    {
      title: 'Frontend',
      intro: 'Robust och tillgänglig frontend med tydlig struktur och lång livslängd.',
      items: ['React & Next.js', 'Tillgänglig komponentarkitektur', 'Responsiva och prestandaoptimerade gränssnitt'],
    },
    {
      title: 'Backend',
      intro: 'Backendlösningar som är begripliga, stabila och enkla att vidareutveckla.',
      items: ['PHP', 'WordPress (headless och traditionellt)', 'API-design och integrationer'],
    },
    {
      title: 'Tillgänglighet',
      intro: 'Tillgänglighet integrerad i hela utvecklingsprocessen, inte som ett tillägg.',
      items: ['WCAG 2.1', 'Semantisk HTML', 'Tangentbordsnavigering och skärmläsarstöd'],
    },
  ],

  examples: [
    {
      title: 'Tillgänglig filtrering i React',
      problem:
        'Många filterkomponenter saknar korrekt fokus och feedback.',
      solution:
        'Semantiska formulär, aria-live och tydlig fokusordning.',
      result:
        'Fullt tangentbordsstöd och förbättrad skärmläsarupplevelse.',
    },
    {
      title: 'Headless arkitektur utan onödig komplexitet',
      problem:
        'Headless-lösningar blir ofta överkonstruerade.',
      solution:
        'Tydlig ansvarsfördelning och minimal API-yta.',
      result:
        'Enklare kodbas och snabbare vidareutveckling.',
    },
  ],

  contact: {
    heading: 'Kontakta mig',
    intro:
      'Har du ett uppdrag, en fråga eller vill du bolla ett problem? Skicka ett meddelande så återkommer jag.',
    confirmation: 'Tack. Jag har tagit emot ditt meddelande och återkommer så snart jag kan.',
    submitLabel: 'Skicka meddelande',
    unavailable:
      'Formuläret är inte tillgängligt just nu. Mejla mig så återkommer jag.',
  },

  footer: {
    contactHeading: 'Kontakt',
    email: 'hej@example.se',
    links: [
      { label: 'LinkedIn', url: 'https://www.linkedin.com/', newTab: true },
      { label: 'GitHub', url: 'https://github.com/', newTab: true },
    ],
    accessibilityHeading: 'Tillgänglighet',
    accessibilityText:
      'Den här webbplatsen är byggd med tillgänglighet som grundprincip. Fokus ligger på semantisk HTML, tangentbordsnavigering, tydliga kontraster och kompatibilitet med skärmläsare.',
    accessibilityNote:
      'Upplever du problem eller har förbättringsförslag är du välkommen att höra av dig.',
    copyrightName: 'Tobias Årud',
    tagline: 'Webbutveckling med fokus på tillgänglighet och långsiktig kvalitet.',
    builtWith: 'Byggd med React och Tailwind CSS',
  },

  process: [
    {
      step: '01',
      title: 'Förstå sammanhanget',
      description: 'Jag börjar med att sätta mig in i målgrupp, användningssituation och tekniska förutsättningar. Ofta handlar det om att reda ut komplexitet och ifrågasätta antaganden innan lösningar formuleras.',
    },
    {
      step: '02',
      title: 'Struktur och design',
      description: 'Informationsarkitektur, komponentstruktur och tillgänglighet sätts tidigt. En tydlig struktur gör lösningar lättare att bygga, testa och förvalta över tid.',
    },
    {
      step: '03',
      title: 'Bygga hållbart',
      description: 'Jag utvecklar med fokus på läsbar kod, prestanda och tillgänglighet. Målet är lösningar som fungerar lika bra idag som om flera år.',
    },
    {
      step: '04',
      title: 'Följa upp',
      description: 'Tillgänglighet, prestanda och användbarhet följs upp och justeras vid behov. Små förbättringar över tid ger ofta störst effekt.',
    },
  ],
}