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

1. **Confirm the contact address.** All calls to action use
   `gregory.w.douglas@cheopsconsulting.com` so they work immediately. Replace with
   `hello@sparoahelle.com` and `privacy@sparoahelle.com` once those mailboxes or aliases are active.
   The address appears in `index.html` (4 places), `privacy.html` (2), and `404.html` (1).
2. **Confirm the initial audience.** The page states girls ages 7-11 in the hero eyebrow.
3. **Confirm founder naming.** The page identifies Gregory Douglas as founder.
4. **Do not add "LLC"** until the exact legal entity name is registered and active.
5. **Review the privacy notice with counsel** before collecting payments, using analytics,
   embedding a waitlist form, or collecting personalization information.
6. **Update `sitemap.xml` `lastmod`** to the actual publish date.

## Deployment requirements (host-agnostic)

Upload the **contents** of this folder, not the enclosing folder. The web root must contain
`index.html` directly.

- Connect both `sparoahelle.com` and `www.sparoahelle.com`
- Redirect `www` to root; `https://sparoahelle.com/` is the canonical address declared in the markup
- Enable HTTPS and force HTTP to HTTPS
- Confirm the host serves `404.html` for unknown paths

### Post-launch verification checklist

- [ ] `https://sparoahelle.com` loads over HTTPS with a valid certificate
- [ ] `http://` and `www.` both redirect to `https://sparoahelle.com`
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
