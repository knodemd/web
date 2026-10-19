// Turns the handbook (github.com/knodemd/handbook) into src/content/handbook.json, the pages of
// knode.md/handbook. Uses HANDBOOK_DIR when set (a local clone), or clones the latest handbook
// into .handbook. Links between handbook files become site links; everything else goes to GitHub.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const repo = 'https://github.com/knodemd/handbook'
let dir = process.env.HANDBOOK_DIR
if (!dir) {
  dir = path.join(root, '.handbook')
  rmSync(dir, { recursive: true, force: true })
  execFileSync('git', ['clone', '--quiet', '--depth', '1', `${repo}.git`, dir])
}

// 01-what-is-knode.md -> what-is-knode, decisions/0003-licences.md -> decisions/0003-licences
const slugFor = (file) =>
  file === 'README.md'
    ? ''
    : file === 'decisions/README.md'
      ? 'decisions'
      : file.startsWith('decisions/')
        ? file.replace(/\.md$/, '')
        : file.replace(/^\d+-/, '').replace(/\.md$/, '')

const files = [
  'README.md',
  ...readdirSync(dir)
    .filter((f) => /^\d+-.*\.md$/.test(f))
    .sort(),
  'decisions/README.md',
  ...readdirSync(path.join(dir, 'decisions'))
    .filter((f) => /^\d{4}-.*\.md$/.test(f))
    .sort()
    .map((f) => `decisions/${f}`),
]

function rewrite(md, file) {
  const base = path.posix.dirname(file)
  return md.replace(/\]\(([^)\s]+)\)/g, (all, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all
    const [target, hash] = href.split('#')
    let resolved = path.posix.normalize(path.posix.join(base, target)).replace(/\/$/, '')
    if (files.includes(`${resolved}/README.md`)) resolved = `${resolved}/README.md`
    if (files.includes(resolved)) {
      const slug = slugFor(resolved)
      return `](/handbook${slug ? `/${slug}` : ''}${hash ? `#${hash}` : ''})`
    }
    return `](${repo}/blob/main/${resolved}${hash ? `#${hash}` : ''})`
  })
}

const pages = files.map((file) => {
  const raw = readFileSync(path.join(dir, file), 'utf8')
  const heading = raw.match(/^#\s+(.+)$/m)?.[1] ?? file
  const [, number, title] = heading.match(/^(\d+)\s+-\s+(.+)$/) ?? [null, null, heading]
  const kind =
    file === 'README.md' ? 'index' : file.startsWith('decisions/') ? 'decision' : 'chapter'
  // the README banner is for GitHub; the site has its own header
  const body = rewrite(raw.replace(/^<img [^>]*>\s*/m, '').replace(/^#\s+.+\n+/m, ''), file)
  const summary =
    body
      .split('\n\n')
      .find((p) => p.trim() && !/^[#|<>*-]/.test(p.trim()))
      ?.replace(/[*`[\]]/g, '')
      .replace(/\(\/?[^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160) ?? ''
  return { slug: slugFor(file), file, kind, number, title, summary, body }
})

mkdirSync(path.join(root, 'src/content'), { recursive: true })
writeFileSync(
  path.join(root, 'src/content/handbook.json'),
  JSON.stringify({ repo, pages }, null, 1),
)
console.log(`handbook: ${pages.length} pages from ${process.env.HANDBOOK_DIR ? dir : repo}`)
