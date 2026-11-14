import data from './releases.json'

export type Release = {
  tag: string
  name: string
  date: string
  url: string
  prerelease: boolean
  body: string
}

export const releases = data as Release[]
