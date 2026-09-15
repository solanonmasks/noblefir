# Images

## Status at a glance

| | Count | |
|---|---|---|
| ✅ Real photography, supplied | 7 | Hero, all four service cards, editorial, closing CTA |
| ◐ Derived by cropping a supplied photo | 4 | The four project tiles |
| ⚠️ Still a placeholder | 1 | **The logo** |

**The logo is the one real gap.** `logo-noble-fir-homes.png` is still a
stand-in graphic, and it appears in the header on every screen and again in
the footer. It should be replaced before the site goes live — ideally with an
**SVG**, which stays sharp at every size. If only a raster version exists, a
PNG with a transparent background at roughly 416 × 376 will do.

---

## What goes where

| Filename | Size | Where it appears | Status |
|---|---|---|---|
| `logo-noble-fir-homes.png` | 416 × 376 | Header (56px tall, 42px scrolled) and footer (74px) | ⚠️ **Placeholder** |
| `hero-kitchen.jpg` | 1920 × 1080 | Hero background, behind the dark scrim | ✅ Real |
| `service-kitchens-bathrooms.jpg` | 760 × 570 | Services card 01 | ✅ Real |
| `service-whole-home.jpg` | 760 × 570 | Services card 02 | ✅ Real |
| `service-condo-strata.jpg` | 760 × 570 | Services card 03 | ✅ Real |
| `service-additions-custom.jpg` | 760 × 570 | Services card 04 | ✅ Real |
| `editorial-interior.jpg` | 1200 × 1000 | "Why homeowners choose us" section | ✅ Real |
| `closing-condo.jpg` | 1920 × 900 | Closing "Let's talk about your home" band | ✅ Real |
| `project-bathroom.jpg` | 750 × 500 | Projects, wide tile 1 | ◐ Cropped from `service-kitchens-bathrooms.jpg` |
| `project-kitchen.jpg` | 800 × 900 | Projects, tall tile 2 | ◐ Cropped from `hero-kitchen.jpg` |
| `project-full-home.jpg` | 504 × 567 | Projects, tall tile 3 | ◐ Cropped from `service-whole-home.jpg` |
| `project-multi-unit.jpg` | 750 × 500 | Projects, wide tile 4 | ◐ Cropped from `service-additions-custom.jpg` |

---

## About the four derived project tiles

No dedicated photos were supplied for the projects section, so each tile was
centre-cropped from the supplied photo that matches its subject. Nothing was
upscaled or invented — each file sits at or below its source resolution, so
what you see is real detail, not stretched pixels.

The trade-off is that **each project tile shows the same photo as one of the
other sections**. It reads fine, and the original design deliberately reused
photos across sections too, but four dedicated project photos would be better:
these are meant to be *specific past jobs*, and repetition undercuts that.

If you supply them later, these are the sizes to export:

| Filename | Size | Subject |
|---|---|---|
| `project-bathroom.jpg` | 1200 × 800 | Bathroom renovation, Vancouver condo |
| `project-kitchen.jpg` | 800 × 900 | Kitchen remodel, Metro Vancouver |
| `project-full-home.jpg` | 800 × 900 | Full home renovation, Metro Vancouver |
| `project-multi-unit.jpg` | 1200 × 800 | Multi-unit custom build — "The Maple" |

---

## How to swap any image

Save the new file over the old one, **keeping exactly the same filename**.
No code changes needed — `index.html` already points at these names.

One extra step if the new file's **dimensions differ**: update the `width` and
`height` attributes on that `<img>` tag in `index.html` to match. They don't
control the displayed size (the stylesheet does) — they reserve the right
amount of space while the image downloads, so the page doesn't jump around as
things load.

---

## Worth doing later

- Export a **WebP or AVIF** version of each photo alongside the JPEG and serve
  both with `<picture>`. Roughly half the file size at the same quality.
- Provide 2–3 widths per image and use `srcset`, so phones don't download the
  full 1920px hero.
- `hero-kitchen.jpg` is currently **529KB**. It is the largest thing the
  browser loads first and it's what Google measures for page speed — getting it
  under ~250KB, as WebP or at higher JPEG compression, is the single biggest
  speed win available on this page.
