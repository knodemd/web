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

## Run it locally

```sh
npm install
npm run dev       # http://localhost:5173
npm run build     # type-check, build and prerender into dist/
npm run preview   # serve dist/
```

## Contributing

Found something wrong or want to suggest a change? [Open an issue](https://github.com/knodemd/web/issues/new/choose)
or a pull request. Read the [contributing guide](https://github.com/knodemd/.github/blob/main/CONTRIBUTING.md) first.
Merging into `main` publishes the site.

## Licence

Code under [Apache 2.0](LICENSE). The brand (name, logo, icons, favicons and the Knode typefaces) is
reserved under the Knode Brand Licence in
[knodemd/brand](https://github.com/knodemd/brand).
