// The handbook pages, generated at build time by scripts/handbook.mjs from knodemd/handbook.
import data from './handbook.json'

export type HandbookPage = {
  slug: string
  file: string
  kind: 'index' | 'chapter' | 'decision'
  number: string | null
  title: string
  summary: string
  body: string
}

export const handbookRepo: string = data.repo
export const handbookPages = data.pages as HandbookPage[]
export const handbookPage = (slug: string) => handbookPages.find((p) => p.slug === slug)
