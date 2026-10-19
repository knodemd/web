// The docs pages, generated at build time by scripts/docs.mjs from knodemd/docs.
import data from './docs.json'

export type DocsPage = {
  slug: string
  file: string
  number: string | null
  title: string
  summary: string
  body: string
}

export const docsRepo: string = data.repo
export const docsPages = data.pages as DocsPage[]
export const docsPage = (slug: string) => docsPages.find((p) => p.slug === slug)
