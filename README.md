# knode.md

The Knode website, served by GitHub Pages at [knode.md](https://knode.md).

A single static page: hand-written HTML and CSS, no build step, no framework, no trackers and no
third-party requests. Fonts (Knode Block, Knode Line, Geist, Geist Mono), icons, favicons and the
link preview come from [knodemd/brand](https://github.com/knodemd/brand).

| Path | What |
|---|---|
| `index.html` | The landing page |
| `404.html` | Page not found |
| `assets/css/site.css` | All styles: three inks, dark and light themes |
| `assets/fonts/` | Self-hosted WOFF2 fonts (SIL Open Font License, see `OFL-*.txt`) |
| `assets/img/` | Brand graphics |
| `CNAME` | The custom domain, `knode.md` |
| favicons, `site.webmanifest`, `og-image.png`, `robots.txt`, `sitemap.xml` | Browser and search metadata |

## Run it locally

```sh
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Deploy

Merging into `main` publishes the site (Settings → Pages → Deploy from branch `main`, folder `/`).

DNS for `knode.md` lives in Cloudflare, set to *DNS only* (grey cloud) so GitHub can issue the certificate:

| Type | Name | Content |
|---|---|---|
| A | `@` | 185.199.108.153 |
| A | `@` | 185.199.109.153 |
| A | `@` | 185.199.110.153 |
| A | `@` | 185.199.111.153 |
| AAAA | `@` | 2606:50c0:8000::153 |
| AAAA | `@` | 2606:50c0:8001::153 |
| AAAA | `@` | 2606:50c0:8002::153 |
| AAAA | `@` | 2606:50c0:8003::153 |
| CNAME | `www` | knodemd.github.io |

## Licence

Code under the [MIT licence](LICENSE). Brand assets follow the licences in [knodemd/brand](https://github.com/knodemd/brand).
