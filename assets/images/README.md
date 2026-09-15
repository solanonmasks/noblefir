# Images

Every file in this folder is a **placeholder**. They are the right size and
shape, so the layout is correct, but they are not the real photography.

## How to swap in the real photos

1. Get the original files from the client (ask for full resolution, plus an
   **SVG version of the logo** — only a raster one is published today).
2. Crop/resize each one to the dimensions in the table below.
3. Save it over the placeholder, **keeping exactly the same filename**.

That's it. No code changes needed anywhere — `index.html` already points at
these names.

## What goes where

| Filename | Size | Where it appears | Original on the live Wix site |
|---|---|---|---|
| `logo-noble-fir-homes.png` | 416 × 376 | Header (56px tall, 42px once scrolled) and footer (74px) | `71ef83_46bafb72928f414ab089b1e68a3b05e1~mv2.webp` |
| `hero-kitchen.jpg` | 1920 × 1080 | Hero background, behind the dark scrim | `71ef83_569513e235664c91a9efd4303963ee11~mv2.png` |
| `service-kitchens-bathrooms.jpg` | 760 × 570 | Services card 01 | `71ef83_676772f171944a449b08510ea13761db~mv2.jpg` |
| `service-whole-home.jpg` | 760 × 570 | Services card 02 | `71ef83_3abf36655af04898bcd6bf7aa0c80954~mv2.jpg` |
| `service-condo-strata.jpg` | 760 × 570 | Services card 03 | `71ef83_66c0438feb28426d8f8cd916efbb4bc8~mv2.webp` |
| `service-additions-custom.jpg` | 760 × 570 | Services card 04 | `71ef83_9fb885efa8bf439da214744ddd0edd05~mv2.jpg` |
| `editorial-interior.jpg` | 1200 × 1000 | "Why homeowners choose us" section | `71ef83_0239e4f39c5b4faa964a3fc969bfc372~mv2.jpg` |
| `project-bathroom.jpg` | 1200 × 800 | Projects, wide tile 1 | `71ef83_48598fb1ee7a41a9becb001cf9f2d874~mv2.jpg` |
| `project-kitchen.jpg` | 800 × 900 | Projects, tall tile 2 | `71ef83_676772f171944a449b08510ea13761db~mv2.jpg` |
| `project-full-home.jpg` | 800 × 900 | Projects, tall tile 3 | `71ef83_3abf36655af04898bcd6bf7aa0c80954~mv2.jpg` |
| `project-multi-unit.jpg` | 1200 × 800 | Projects, wide tile 4 | `71ef83_9fb885efa8bf439da214744ddd0edd05~mv2.jpg` |
| `closing-condo.jpg` | 1920 × 900 | Closing "Let's talk about your home" band | `71ef83_66c0438feb28426d8f8cd916efbb4bc8~mv2.webp` |

Each "original" above is the image id on `static.wixstatic.com`. The full URL
is `https://static.wixstatic.com/media/<id>`. Four photos are used twice at
two different crops, which is why some ids repeat.

## Why these are placeholders

The Wix CDN could not be reached from the environment this site was built in
(`static.wixstatic.com` is blocked by network policy there), so the originals
could not be downloaded automatically. Self-hosting them is the right call
regardless — hot-linking Wix is slow and can break without warning.

## Worth doing later

- Export a **WebP or AVIF** version of each photo alongside the JPEG and serve
  both with `<picture>`. Roughly half the file size at the same quality.
- Provide 2–3 widths per image and use `srcset`, so phones don't download the
  1920px hero.
- Keep `hero-kitchen.jpg` under ~250KB. It is the largest thing the browser
  loads first, and it's what Google measures for page speed.
