# Noble Fir Homes — homepage

The redesigned homepage for [noblefir.ca](https://www.noblefir.ca/), built from
the design handoff in `Noble Fir website redesign.zip`.

It is a plain HTML, CSS and JavaScript site. **There is no build step and
nothing to install.** Every file is one you can open and read.

---

## Previewing it

**The quick way:** double-click `index.html`. It opens in your browser and
everything works.

**The slightly better way** (matches how it behaves once published):

```bash
npx http-server -p 4173 .
```

Then open <http://127.0.0.1:4173/>. Press `Ctrl+C` in the terminal to stop.

---

## What's in here

```
index.html                 The whole page. All the words live here.
assets/css/styles.css      Everything the page looks like.
assets/js/main.js          The form, tabs, accordion and animations.
assets/images/             Photos and logo (see the README in that folder).
```

Only four things to know your way around. `index.html` is laid out in the same
order as the page, with a comment above each section:

```
1. Announcement bar     6. Services          11. Service areas
2. Sticky header        7. Why us            12. FAQ
3. Hero                 8. Projects          13. Closing CTA
4. Estimate form        9. Testimonial       14. Footer
5. Trust marquee       10. Process           15. Sticky call bar
```

---

## Common changes

### Changing the words

Open `index.html`, use your editor's Find to search for the text you want to
change, and type over it. That's the whole process.

A few things appear more than once, so search for *all* of them:

- The phone number `778-686-0311` appears **7 times** (and as `+17786860311`
  inside the `tel:` links — update both halves).
- The email `info@noblefirhomes.ca` appears **3 times** (the footer link's
  address and its visible text, plus the business details near the top of the
  file).
- The four FAQ questions and answers appear **twice**: once in the visible FAQ
  section, and once near the top of the file inside the `FAQPage` block. That
  second copy is what lets the answers show directly in Google results, so
  keep the two in step.

### Changing the colours

Open `assets/css/styles.css`. The first block is a list of every colour used:

```css
--ink:        #16181A;  /* near-black: main text, top bar, footer */
--ink-panel:  #1B1E1C;  /* green-shifted charcoal: hero + projects bands */
--paper:      #FFFCFA;  /* warm off-white: page background */
--paper-warm: #F4F0EA;  /* alternating section background */
--fir:        #2F4A3A;  /* deep green accent, on light backgrounds */
--sage:       #A7C0AE;  /* light green accent, on dark backgrounds */
```

Change one value there and it updates everywhere on the site at once.

### Swapping in the real photos

Every image is currently a placeholder. See
[`assets/images/README.md`](assets/images/README.md) — it lists each filename,
the size it should be, and where on the page it appears. Save the real photo
over the placeholder using the same filename and nothing else needs touching.

### Two behaviour switches

Near the top of `assets/js/main.js`:

```js
var SHOW_CALL_BAR = true;   // the sticky green bar along the bottom
var ONE_STEP_FORM = false;  // true = one long form instead of two steps
```

`ONE_STEP_FORM` is worth A/B testing. Two steps usually gets more submissions
overall; one step can do better on visitors who already intend to book.

---

## Connecting the estimate form

**Right now the form does not send anywhere.** Fill it in and it shows the
thank-you message, but nothing reaches you. This is deliberate so the page can
be clicked through safely before it's live.

To make it real, the quickest option is [Formspree](https://formspree.io)
(free tier is fine for this volume):

1. Sign up and create a form. It gives you a URL like
   `https://formspree.io/f/abcdwxyz`.
2. In `index.html`, find this line (around line 217):

   ```html
   <form id="estimate-form" novalidate data-endpoint="">
   ```

3. Paste your URL inside the quotes:

   ```html
   <form id="estimate-form" novalidate data-endpoint="https://formspree.io/f/abcdwxyz">
   ```

That's it. Submissions will arrive by email.

The form already handles the rest: it checks the name, email and phone before
sending, shows a "Sending…" state, shows an error with the phone number if the
send fails, and carries a hidden honeypot field that silently absorbs spam bots.

**Before going live, send yourself a test submission** and confirm it arrives.

### Newsletter signup

The footer signup currently just changes the button to "Subscribed ✓" without
storing the address. Point it at Mailchimp, Buttondown or similar when you're
ready — the handler is `initSubscribe` in `assets/js/main.js`.

---

## Publishing it

Because this is plain files, almost anything will host it. Easiest first:

- **Netlify** — go to <https://app.netlify.com/drop> and drag this whole folder
  onto the page. It's live in about ten seconds on a free URL, and you can
  point `noblefir.ca` at it afterwards.
- **GitHub Pages** — in this repository, Settings → Pages → deploy from the
  `main` branch, root folder.
- **Vercel / Cloudflare Pages** — connect the repository; no build command and
  no output directory needed.

After publishing, update the two `https://www.noblefir.ca/` URLs near the top
of `index.html` (`canonical` and `og:url`) if the address is different.

---

## Undoing a change

Every change is tracked by git, so nothing is ever permanently lost.

```bash
git diff                  # see what you've changed but not yet saved
git checkout -- index.html   # throw away your changes to one file
git log --oneline         # list every saved version
```

To go back to how things were before this redesign, the previous state is the
`main` branch.

---

## Worth doing before launch

Carried over from the design handoff, in rough priority order:

1. **Connect the form** (above). Without it the page cannot do its job.
2. **Swap in the real photography** and ask the client for an **SVG logo** —
   only a raster one is published today.
3. **Replace the testimonial.** The current quote is placeholder copy. Use a
   real, attributed review — ideally pulled from the company's Google reviews.
4. **Confirm the typefaces.** The live Wix site's fonts could not be read, so
   `Jost` and `Newsreader` were chosen to match the logo's letterforms. If the
   client has real brand fonts, swap them in `index.html` and in the
   `--font-sans` / `--font-serif` values in `styles.css`.
5. **Link the project tiles and city cells** to their real pages on the site.
   They all point at the estimate form at the moment, which is fine for
   conversion but leaves SEO value on the table.
6. **Add analytics.** The code already fires `estimate_start`,
   `estimate_step_2`, `estimate_submit` and `phone_click` events — they just
   need Google Analytics or Tag Manager installed to receive them.
7. **Self-host the fonts.** They currently load from Google Fonts, which is one
   extra connection on first load and a privacy consideration in some
   jurisdictions.

## Notes on how it's built

- **Accessibility.** One `h1` and real section `h2`s; the FAQ and process tabs
  are keyboard operable with correct `aria-expanded` / `aria-selected`; there's
  a skip link; focus rings are visible; tap targets are at least 44px.
- **Reduced motion.** Anyone whose system asks for less motion gets the page
  with all animation switched off. Please keep that.
- **Works without JavaScript.** If the script fails to load, every section is
  still visible and readable — the form shows as one long form, all process
  steps show at once, and all FAQ answers are open.
- **No dependencies.** No frameworks, no package.json, nothing to keep updated
  or patch for security. This should still work untouched in ten years.
