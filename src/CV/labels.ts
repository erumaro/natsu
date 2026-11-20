export const cvLangs = ['sv', 'en'] as const

export type CVLang = (typeof cvLangs)[number]

export const isCVLang = (value: string): value is CVLang =>
  (cvLangs as readonly string[]).includes(value)

// Section headings use the conventional names ATS parsers look for.
export const cvLabels = {
  sv: {
    langTag: 'sv-SE',
    languageName: 'Svenska',
    document: 'CV',
    summary: 'Profil',
    experience: 'Arbetslivserfarenhet',
    education: 'Utbildning',
    skills: 'Kompetenser',
    languages: 'Språk',
    certifications: 'Certifieringar',
    present: 'nu',
    email: 'E-post',
    phone: 'Telefon',
    location: 'Ort',
    contact: 'Kontaktuppgifter',
    downloadPdf: 'Ladda ner CV som PDF',
    otherLanguage: 'Read in English',
  },
  en: {
    langTag: 'en-GB',
    languageName: 'English',
    document: 'CV',
    summary: 'Summary',
    experience: 'Experience',
    education: 'Education',
    skills: 'Skills',
    languages: 'Languages',
    certifications: 'Certifications',
    present: 'Present',
    email: 'Email',
    phone: 'Phone',
    location: 'Location',
    contact: 'Contact details',
    downloadPdf: 'Download CV as PDF',
    otherLanguage: 'Läs på svenska',
  },
} as const satisfies Record<CVLang, Record<string, string>>

export type CVLabels = (typeof cvLabels)[CVLang]
