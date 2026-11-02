// GitHub release notes are fetched at build time; visitors never contact GitHub's API.
import { readFileSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export function normalizeReleases(data) {
  if (!Array.isArray(data)) throw new Error('Expected a GitHub releases array')
  return data
    .filter((release) => !release.draft && release.published_at)
    .map((release) => {
      if (
        typeof release.tag_name !== 'string' ||
        !Number.isFinite(Date.parse(release.published_at)) ||
        typeof release.html_url !== 'string' ||
        !release.html_url.startsWith('https://github.com/knodemd/knode/releases/tag/')
      )
        throw new Error('Invalid published release metadata')
      return {
        tag: release.tag_name,
        name: release.name || release.tag_name,
        date: release.published_at,
        url: release.html_url,
        prerelease: Boolean(release.prerelease),
        body: release.body || '',
      }
    })
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date) || a.tag.localeCompare(b.tag))
}

export async function fetchReleases(fetcher = fetch, token = process.env.GITHUB_TOKEN) {
  const headers = { Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  if (token) headers.Authorization = `Bearer ${token}`
  const releases = []
  for (let page = 1; ; page++) {
    const response = await fetcher(
      `https://api.github.com/repos/knodemd/knode/releases?per_page=100&page=${page}`,
      { headers, signal: AbortSignal.timeout(30000) },
    )
    if (!response.ok) throw new Error(`GitHub releases request failed (${response.status})`)
    const batch = await response.json()
    if (!Array.isArray(batch)) throw new Error('Expected a GitHub releases array')
    releases.push(...batch)
    if (batch.length < 100) break
  }
  return normalizeReleases(releases)
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const releases = process.env.RELEASES_FILE
    ? normalizeReleases(JSON.parse(readFileSync(process.env.RELEASES_FILE, 'utf8')))
    : await fetchReleases()
  writeFileSync(
    new URL('../src/content/releases.json', import.meta.url),
    JSON.stringify(releases, null, 2) + '\n',
  )
  console.log(`releases: ${releases.length} published versions`)
}
