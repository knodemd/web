<img src="https://raw.githubusercontent.com/knodemd/brand/main/09%20Banners/Repository%20Previews/PNG/repo-preview-web.png" alt="Knode web" width="100%">

# knode.md

The Knode website, served by GitHub Pages at [knode.md](https://knode.md).

Vite, React, TypeScript and Tailwind, the same stack as the rest of our sites. Every page is
prerendered at build time, so it reads without JavaScript. No trackers and no third-party requests:
fonts (Knode Block, Knode Line, Geist, Geist Mono), icons and favicons are served from this site and
come from [knodemd/brand](https://github.com/knodemd/brand).

| Path | What |
|---|---|
| `src/pages/` | The landing page and the 404 |
| `src/components/` | Navbar (sticky), footer, buttons, icons, logo |
| `src/brand/` | Icon and logo data copied from the brand kit |
| `src/index.css` | Tailwind, the three inks and both themes |
| `scripts/prerender.mjs` | Writes `index.html` and `404.html` as real HTML after the build |
| `public/` | Fonts, favicons, link preview, `CNAME`, `robots.txt`, `sitemap.xml` |

## Run it locally

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check, build and prerender into dist/
npm run preview   # serve dist/
```

## Deploy

Merging into `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes `dist/`
to GitHub Pages (Settings, Pages, Source: GitHub Actions).

DNS for `knode.md` lives in Cloudflare, set to *DNS only* (grey cloud) so GitHub can issue the certificate:

| Type | Name | Content |
|---|---|---|
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| CNAME | `www` | knodemd.github.io |

## Licence

Code under [Apache 2.0](LICENSE). The brand (name, logo, icons, favicons and the Knode typefaces) is
reserved under the Knode Brand Licence in
[knodemd/brand](https://github.com/knodemd/brand).
