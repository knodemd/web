// Writes each page as real HTML once the build is on disk, so the site reads
// without JavaScript and every page answers with its own title. GitHub Pages
// serves 404.html for any address it doesn't know.
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import path from 'node:path'

const handbook = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, '../src/content/handbook.json'), 'utf8'),
)

const dist = path.resolve(import.meta.dirname, '../dist')
const ssr = path.resolve(import.meta.dirname, '../dist-ssr')
const { render } = await import(path.join(ssr, 'entry-server.js'))
const template = readFileSync(path.join(dist, 'index.html'), 'utf8')

const pages = [
  { page: 'home', file: 'index.html' },
  {
    page: 'brand',
    file: 'brand/index.html',
    title: 'Brand - Knode',
    description: 'The Knode brand: logo, colour, type, icons and the brand kit to download.',
  },
  {
    page: 'developers',
    file: 'developers/index.html',
    title: 'Developers - Knode',
    description:
      'The .knode format, a library to read it, a CLI and an MCP server. Designed in public.',
  },
  {
    page: 'plan',
    file: 'plan/index.html',
    title: 'The plan - Knode',
    description:
      'Your second brain for AI: what Knode is, how it works, the .knode file, sync, the repositories and the roadmap.',
  },
  {
    page: 'licenses',
    file: 'licenses/index.html',
    title: 'Licenses - Knode',
    description:
      'Knode is open source under Apache 2.0. Its name and logo are reserved under the Knode Brand License.',
  },
  ...handbook.pages.map((p) => ({
    page: p.slug ? `handbook/${p.slug}` : 'handbook',
    file: p.slug ? `handbook/${p.slug}/index.html` : 'handbook/index.html',
    title: p.slug ? `${p.title} - Knode Handbook` : 'Handbook - Knode',
    description: p.summary || 'How Knode works and how we build it in public.',
  })),
  {
    page: 'not-found',
    file: '404.html',
    title: 'Page not found - Knode',
    description: "This page doesn't exist.",
  },
]

for (const { page, file, title, description } of pages) {
  let html = template.replace(
    '<div id="root"><!--app--></div>',
    `<div id="root" data-page="${page}">${render(page)}</div>`,
  )
  if (title) html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`)
  if (description)
    html = html.replace(/(<meta\s+name="description"\s+content=")[^"]*/, `$1${description}`)
  mkdirSync(path.dirname(path.join(dist, file)), { recursive: true })
  writeFileSync(path.join(dist, file), html)
}
rmSync(ssr, { recursive: true, force: true })
console.log(`prerendered ${pages.length} pages`)
