# Sparoah Elle Landing Page — Version 1.1

Deployment-ready static site for `https://sparoahelle.com`. Version 1.1 preserves every approved
Version 1 strategy, brand, child-safety, privacy, founder-positioning, and truthfulness decision.
Only pre-launch corrections were made.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Main landing page |
| `privacy.html` | Launch-stage privacy notice |
| `404.html` | Branded not-found page (new in 1.1) |
| `styles.css` | Responsive visual design |
| `script.js` | Mobile navigation and footer year |
| `favicon.svg` | Primary browser icon |
| `favicon.ico` | Legacy browser icon (new in 1.1) |
| `apple-touch-icon.png` | iOS home-screen / Safari icon, 180x180 (new in 1.1) |
| `icon-512.png` | Organization logo reference for structured data (new in 1.1) |
| `og-image.png` | Social sharing image, 1200x630 |
| `robots.txt`, `sitemap.xml` | Search-engine files |

## What changed in Version 1.1

1. **Truthfulness.** The six experience components are now visibly labeled
   *"Planned components of The Power Within,"* and the Quest description reads
   "is designed to give" rather than "gives." Nothing on the page now reads as a shipped product.
2. **Accessibility — contrast.** `--gold-deep` darkened from `#8f692f` to `#85602c`. The
   *Quest #1* eyebrow previously measured 4.16:1 against its section background, below the
   WCAG AA 4.5:1 minimum for small text. All body and label text now passes AA.
3. **Accessibility — screen readers.** The decorative hero orbit is now `aria-hidden`; its six
   steps were being announced twice, once in the hero and again in "How a Quest works."
4. **Mobile navigation.** The menu now closes on `Escape` (returning focus to the button) and on
   an outside click, not only on link selection.
5. **Icons.** Added `.ico` and `apple-touch-icon.png`. Version 1 shipped an SVG icon only, which
   Safari and iOS home-screen bookmarks do not use.
6. **Link previews.** Added `og:site_name`, `og:locale`, `og:image:alt`, and `twitter:image:alt`.
   Added `logo` and `slogan` to the Organization structured data.
7. **404 page.** A mistyped URL now lands on a branded page instead of a bare host error.

## Still required before publishing

1. ~~**Confirm both mailboxes receive mail before deploying.**~~ **Done 2026-08-15.** Test messages
   to `hello@sparoahelle.com` and `privacy@sparoahelle.com` were both delivered successfully. Calls
   to action use `hello@` (7 `mailto:` links: `index.html` ×5, `privacy.html` ×1, `404.html` ×1) and
   `privacy@` (1 link, the privacy notice contact section). These remain the only contact routes on
   the site, so re-test if either mailbox is ever migrated or renamed.
2. **Confirm the initial audience.** The page states girls ages 7-11 in the hero eyebrow.
3. **Confirm founder naming.** The page identifies Gregory Douglas as founder.
4. **Do not add "LLC"** until the exact legal entity name is registered and active.
5. **Review the privacy notice with counsel** before collecting payments, using analytics,
   embedding a waitlist form, or collecting personalization information.
6. **Update `sitemap.xml` `lastmod`** to the actual publish date.

## Deployment

Run `./deploy.sh` from the project root. It runs the pre-flight checks, stages an explicit
allowlist of the 13 public files, and deploys to Azure Static Web Apps. See `CLAUDE.md` for why
`swa deploy ./` must not be used directly, and for the rule about never deleting a live app.

### Current live state (as of 2026-08-15)

| Address | Status |
| --- | --- |
| `https://sparoahelle.com` | **Live** — canonical, valid certificate |
| `https://www.sparoahelle.com` | **Live** — valid certificate |

Both domains are bound and serving. `http://` redirects to `https://` on both.

**One step remains, and it can only be done in the portal.** `https://www.sparoahelle.com`
currently serves the site directly rather than redirecting to the apex, so the site answers at two
addresses. The `<link rel="canonical">` tag points search engines at the apex, but to get a real
redirect, open the Static Web App → **Custom domains**, select `sparoahelle.com`, and click **Set
default**. Azure then redirects all other bound domains to it. The Azure CLI does not expose this
setting.

### Host requirements (host-agnostic)

Upload the **contents** of this folder, not the enclosing folder. The web root must contain
`index.html` directly.

- Connect both `sparoahelle.com` and `www.sparoahelle.com`
- Redirect `www` to root; `https://sparoahelle.com/` is the canonical address declared in the markup
- Enable HTTPS and force HTTP to HTTPS
- Confirm the host serves `404.html` for unknown paths

### Post-launch verification checklist

- [x] `https://sparoahelle.com` loads over HTTPS with a valid certificate
- [x] `http://` redirects to `https://` on both apex and `www`
- [ ] `www.` redirects to `https://sparoahelle.com` — needs **Set default** in the portal
- [ ] Every nav link scrolls to the correct section
- [ ] All email CTAs open a mail client with the correct subject
- [ ] `privacy.html` loads and links back home
- [ ] A deliberately wrong URL shows the branded 404 page
- [ ] Favicon renders in a browser tab
- [ ] `robots.txt` and `sitemap.xml` load
- [ ] Link preview renders correctly (test by pasting the URL into a message to yourself)
- [ ] Mobile: hamburger opens, closes on link tap, closes on Escape, no horizontal scrolling
- [ ] Capture desktop and mobile screenshots for records

## Intentionally excluded

No child account or child-facing chatbot. No analytics or tracking pixels. No embedded form until
a secure adult-only workflow is approved. No unsupported educational, psychological, or
developmental outcome claims. No depiction of a specific child. No claim of endorsement,
sponsorship, or affiliation with Good Soil, T.D. Jakes, Wells Fargo, or any other organization.

## Known limitation, not a blocker

The serif typeface stack relies on fonts installed locally on the reader's device
(Iowan Old Style, Palatino, Georgia). On Android and most Linux devices none are present and the
page falls back to a generic serif, which reads noticeably plainer. Fixing this properly means
self-hosting an open-source serif inside this package — deliberately not a Google Fonts CDN link,
which would introduce a third-party request the privacy notice does not disclose. Worth doing for
Version 2; not worth delaying launch over.
