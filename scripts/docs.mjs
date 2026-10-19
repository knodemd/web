// Turns the docs (github.com/knodemd/docs) into src/content/docs.json, the pages of knode.md/docs.
// Uses DOCS_DIR when set (a local clone), or clones the latest docs into .docs. Links between docs
// files become site links; everything else goes to GitHub.
import { execFileSync } from 'node:child_process'
import { existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const root = path.resolve(import.meta.dirname, '..')
const repo = 'https://github.com/knodemd/docs'
let dir = process.env.DOCS_DIR
if (!dir) {
  dir = path.join(root, '.docs')
  rmSync(dir, { recursive: true, force: true })
  execFileSync('git', ['clone', '--quiet', '--depth', '1', `${repo}.git`, dir])
}

// 01-install.md -> install
const slugFor = (file) =>
  file === 'README.md' ? '' : file.replace(/^\d+-/, '').replace(/\.md$/, '')

const files = [
  'README.md',
  ...readdirSync(dir)
    .filter((f) => /^\d+-.*\.md$/.test(f))
    .sort(),
].filter((f) => existsSync(path.join(dir, f)))

function rewrite(md) {
  return md.replace(/\]\(([^)\s]+)\)/g, (all, href) => {
    if (/^(https?:|mailto:|#)/.test(href)) return all
    const [target, hash] = href.split('#')
    const resolved = path.posix.normalize(target)
    if (files.includes(resolved)) {
      const slug = slugFor(resolved)
      return `](/docs${slug ? `/${slug}` : ''}${hash ? `#${hash}` : ''})`
    }
    return `](${repo}/blob/main/${resolved}${hash ? `#${hash}` : ''})`
  })
}

const pages = files.map((file) => {
  const raw = readFileSync(path.join(dir, file), 'utf8')
  const heading = raw.match(/^#\s+(.+)$/m)?.[1] ?? file
  const [, number, title] = heading.match(/^(\d+)\s+-\s+(.+)$/) ?? [null, null, heading]
  // the README banner is for GitHub; the site has its own header
  const body = rewrite(raw.replace(/^<img [^>]*>\s*/m, '').replace(/^#\s+.+\n+/m, ''))
  const summary =
    body
      .split('\n\n')
      .find((p) => p.trim() && !/^[#|<>*`-]/.test(p.trim()))
      ?.replace(/[*`[\]]/g, '')
      .replace(/\(\/?[^)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 160) ?? ''
  return { slug: slugFor(file), file, number, title, summary, body }
})

mkdirSync(path.join(root, 'src/content'), { recursive: true })
writeFileSync(path.join(root, 'src/content/docs.json'), JSON.stringify({ repo, pages }, null, 1))
console.log(`docs: ${pages.length} pages from ${process.env.DOCS_DIR ? dir : repo}`)
