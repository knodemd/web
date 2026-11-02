<img src="https://raw.githubusercontent.com/knodemd/brand/main/09%20Banners/README%20Headers/PNG/readme-web.png" alt="Knode web" width="100%">

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
| `public/install.sh` | The installer served at `https://knode.md/install.sh`, tested by `sh scripts/test-install.sh` |
| `scripts/releases.mjs` | Fetches published GitHub release notes at build time for `/changelog`; drafts are omitted and notes are sorted newest first |

## Run it locally

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check, build and prerender into dist/
npm run preview   # serve dist/
```

`npm test` checks release-note filtering, ordering, pagination and failure handling. The site
refreshes published release notes on its daily build or a manual deployment. Visitors make no
GitHub API requests and remote images in notes are not automatically loaded. For an offline
build, set `RELEASES_FILE` to a local GitHub releases JSON array; `GITHUB_TOKEN`, when provided,
is used only by the build script and is never written to site data.

## Contributing

Found something wrong or want to suggest a change? [Open an issue](https://github.com/knodemd/web/issues/new/choose)
or a pull request. Read the [contributing guide](https://github.com/knodemd/.github/blob/main/CONTRIBUTING.md) first.
Merging into `main` publishes the site.

## Licence

Code under [Apache 2.0](LICENSE). The brand (name, logo, icons, favicons and the Knode typefaces) is
reserved under the Knode Brand Licence in
[knodemd/brand](https://github.com/knodemd/brand).
