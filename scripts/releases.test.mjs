import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchReleases, normalizeReleases } from './releases.mjs'

const release = (tag, date, extra = {}) => ({
  tag_name: tag,
  published_at: date,
  html_url: `https://github.com/knodemd/knode/releases/tag/${tag}`,
  body: '## Changed\n\nA useful change.',
  ...extra,
})

test('sorts published stable and pre-releases by publication date, excluding drafts', () => {
  const result = normalizeReleases([
    release('v0.1.0', '2026-10-01T10:00:00Z'),
    release('v0.3.0', '2026-12-01T10:00:00Z', { draft: true }),
    release('v0.2.0-rc.1', '2026-11-01T10:00:00Z', { prerelease: true }),
    release('unpublished', null),
  ])
  assert.deepEqual(
    result.map((r) => r.tag),
    ['v0.2.0-rc.1', 'v0.1.0'],
  )
  assert.equal(result[0].prerelease, true)
  assert.equal(result[1].name, 'v0.1.0')
  assert.match(result[1].body, /useful change/)
})

test('represents no published releases without inventing a version', () => {
  assert.deepEqual(normalizeReleases([]), [])
  assert.equal(normalizeReleases([release('v1', '2026-11-01', { body: null })])[0].body, '')
})

test('refuses malformed metadata and unexpected release destinations', () => {
  assert.throws(() => normalizeReleases({ message: 'error' }))
  assert.throws(() => normalizeReleases([release('v1', 'invalid-date')]))
  assert.throws(() =>
    normalizeReleases([release('v1', '2026-11-01', { html_url: 'https://other.test/release' })]),
  )
})

test('fetches additional pages and keeps build credentials out of generated data', async () => {
  const calls = []
  const result = await fetchReleases(async (url, options) => {
    calls.push({ url, options })
    return {
      ok: true,
      json: async () =>
        calls.length === 1
          ? Array.from({ length: 100 }, (_, i) => release(`v0.${i}.0`, '2026-10-01'))
          : [release('v1.0.0', '2026-11-01')],
    }
  }, 'fixture-token')
  assert.equal(calls.length, 2)
  assert.match(calls[1].url, /page=2$/)
  assert.equal(calls[0].options.headers.Authorization, 'Bearer fixture-token')
  assert.equal(result.length, 101)
  assert.equal(result[0].tag, 'v1.0.0')
  assert.doesNotMatch(JSON.stringify(result), /fixture-token/)
})

test('fails a build on API errors rather than reporting a false empty history', async () => {
  await assert.rejects(
    fetchReleases(async () => ({ ok: false, status: 403 }), ''),
    /403/,
  )
})
