# D'Party — Atlanta Dessert Catering Website

A responsive, trilingual (EN / ES / PT) marketing site for **D'Party**, a dessert &
event-treats business serving Atlanta, GA. Built with plain HTML, CSS and vanilla
JavaScript — no build step, no frameworks.

## Deploy

This folder is ready to deploy as-is — no build step, no dependencies to install.
It's host-agnostic (the form works the same everywhere via Web3Forms — see below),
so any of these work:

**Currently live on GitHub Pages:** https://gabip3.github.io/dparty-website/
(repo: `gabip3/dparty-website`, deployed from the `master` branch root via
Settings → Pages. Push to `master` and it redeploys automatically in ~1 minute.)

**Netlify (drag & drop):**
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop)
2. Drag this entire `Pudim` folder onto the page
3. Done — Netlify gives you a live URL in seconds
4. `netlify.toml` sets basic security headers and long-term caching for `/assets/*`

**Netlify (connect a Git repo, best for ongoing edits):**
1. In Netlify: **Add new site → Import an existing project** → pick the
   `dparty-website` GitHub repo
2. Build settings: leave the build command **empty** and publish directory as `.`
   (already configured in `netlify.toml`)

## Languages

- On the **first visit**, a welcome screen asks the visitor to choose **English,
  Español or Português**. The choice is saved (localStorage) and the screen never
  shows again unless the browser data is cleared.
- Language can be changed anytime from the **EN · ES · PT** switcher in the header.
- Choosing a language triggers a celebratory **confetti burst** (skipped for visitors
  who prefer reduced motion).
- The **globe icon** in the header reopens the welcome language screen anytime.
- Flags in the welcome screen are inline **SVG** (they render on every device — emoji
  flags don't show on Windows). To change which flag represents Spanish, edit the
  `.lang-gate__flag` SVG for `data-lang="es"` in `index.html`.

## Contact channel (SMS vs WhatsApp)

Because the US audience prefers texting, the contact buttons adapt to the language:

- **English → SMS** ("Text Us", opens the phone's Messages app, gold button).
- **Spanish / Portuguese → WhatsApp** (green button, prefilled message).

Numbers and prefilled messages live in `js/main.js` (`SMS_NUMBER`, `SMS_MSG`,
`WA_NUMBER`, `WA_MSG`). The icon and channel switch automatically with the language.
- Every visible string lives inline on its element as `data-en` / `data-es` / `data-pt`
  (placeholders use `data-*-ph`, aria-labels use `data-*-aria`). Edit those attributes
  to tweak any translation. Contact messages and form errors live in `js/main.js`
  (`SMS_MSG`, `WA_MSG`, `SUCCESS`, `ERRORS`, `SUBMIT_FAIL`).

## Files

```
index.html          All page content + SEO meta + JSON-LD schema
css/styles.css       Design system (CSS variables at the top) + all styling
js/main.js           Language switch, contact links, form, animations
netlify.toml         Netlify build/publish config + security headers
assets/              Live images used by the site (logo, favicon, etc.)
assets/_originals/   Raw logo exports kept for reference — not used by the site,
                     safe to ignore or delete
```

## Run locally

Open `index.html` directly, or serve the folder (recommended, so paths resolve cleanly):

```bash
npx http-server -p 5678 -c-1
# then visit http://127.0.0.1:5678
```

## What to replace (search these comments in the code)

| Item | Where | Look for |
|------|-------|----------|
| **Logo** | `index.html` nav | `REPLACE logo` |
| **Product photos** | `index.html` hero + `#treats` | `REPLACE:` inside `.frame` / `.card__media` |
| **Instagram images** | `index.html` `#gallery` | `REPLACE each placeholder` |
| **About photo** | `index.html` `#about` | `REPLACE:` inside `.about__media` |
| **Social share / OG image** | `<head>` | `og:image` / `twitter:image` |
| **Canonical + domain URLs** | `<head>` | `CANONICAL PLACEHOLDER`, `dparty-atlanta.com` |
| **Service area wording** | `index.html` footer | `SERVICE AREA` |
| **Phone / WhatsApp numbers & messages** | `js/main.js` | `SMS_NUMBER`, `WA_NUMBER` |

### Replacing an image placeholder

Each placeholder is a styled block with a `data-ph` label. Replace it with a real `<img>`,
for example:

```html
<!-- before -->
<figure class="card__media" role="img" aria-label="...">
  <span class="card__ph" data-ph="Creamy Pudding"></span>
</figure>

<!-- after -->
<figure class="card__media">
  <img src="assets/treat-pudding.jpg"
       alt="Creamy vanilla pudding in glass cups for an Atlanta event"
       loading="lazy" width="600" height="440">
</figure>
```

Keep the descriptive `alt` text — it helps local SEO and accessibility.

### The form (Web3Forms — already wired, works everywhere)

The event inquiry form (`#inquiryForm`) validates in the browser and submits for real
via **[Web3Forms](https://web3forms.com)**, which works from any static host (GitHub
Pages, Netlify, anywhere) since it's just an API call — no server needed on our side:

- A hidden `access_key` input on the `<form>` determines which inbox receives
  submissions. Get your own free key at web3forms.com (just an email address) and
  swap the value there to redirect where emails go.
- `js/main.js` posts the form data to `https://api.web3forms.com/submit` with
  `fetch()` and shows the existing bilingual success/error message — no page reload.
- A visually-hidden `bot-field` input (see `.hp-field` in `styles.css`) is a spam
  honeypot, checked client-side before submitting — leave it as-is.
- **Local testing note:** this works even from a plain static server (e.g.
  `http-server`), since Web3Forms is a remote API, not tied to any specific host.
- Submissions currently email whichever address the access key above was
  registered with. To see/manage them, log into web3forms.com with that address.

## Brand tokens

All colors, spacing, radii and fonts are defined as CSS variables at the top of
`css/styles.css` under `:root`. Change them there to re-skin the whole site.

- **Display (headings):** Baloo 2 — playful, rounded, matches the party-treats brand
- **Sans (body):** Hanken Grotesk
- **Script (accents only):** Parisienne

## Notes

- Fully responsive (tested at 375px → desktop), no horizontal scroll.
- Respects `prefers-reduced-motion` (petals/pulse/animations disabled).
- Accessible: skip link, focus states, ARIA labels, semantic headings, 44px+ touch targets.
- SEO: title/description, Open Graph, Twitter cards, FoodEstablishment + FAQPage schema.
