# Sparoah Elle Landing Page — correction release, 2026-08-23

Deployment-ready static site for `https://sparoahelle.com`. The current release is a bounded
post-launch **correction** of the live Version 1.2 site — not a redesign, replatform, or restart.
It preserves every approved strategy, brand, child-safety, privacy, founder-positioning, and
truthfulness decision.

**Governing source: `docs/specs/spec-website-correction.md`.** That specification supersedes
conflicting copy guidance in the older website-review and Version 1.2 requirement documents. The
superseded wording is left in those files for traceability — do not restore it from them.
Earlier requirements: `docs/specs/Sparoah_Elle_Website_v1.2_Enhancement_Requirements_for_Claude_Code.md`.
Original baseline: `docs/specs/Sparoah_Elle_Website_Handoff.md`.

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

## What changed in the correction release (2026-08-23)

Implements `docs/specs/spec-website-correction.md`. Files changed: `index.html`, `styles.css`,
`privacy.html`, `sitemap.xml`, `README.md`, `CLAUDE.md`, `.gitignore`, plus a new `tests/` folder.
`script.js`, `404.html`, `robots.txt`, `staticwebapp.config.json`, `og-image.png`, and every icon
are unchanged.

| Ref | Change |
| --- | --- |
| WEB-CORR-001 | **Unsupported confidence language removed** everywhere it appeared: the hero lede, `<meta name="description">`, and the Organization JSON-LD `description`. No public file now contains the word. |
| WEB-CORR-002 | Hero lede replaced with the approved idea-agency sentence. Hero primary CTA relabelled **Request Founding Family Information**; it still scrolls to `#founding-families` rather than opening a mail client. Eyebrow, H1, Quest definition, trust chips, and the secondary CTA are untouched. |
| WEB-CORR-003 | **Duplicate six-step presentation removed.** The hero Queen band carried `01 Discover`–`06 Serve` chips around *The Queen Within*; those six chips are gone, leaving the seal and its display line. The Queen definition now assigns *dignity* and *courage* to distinct ideas. The journey appears once on the page. |
| WEB-CORR-004 | Parent-emotional bridge and the quotation untouched. **One owner-directed deviation:** the opening line reads *"As her eighth birthday approached"* rather than *"Before her birthday"* — see below. |
| WEB-CORR-005 | `recognize a good idea` → `explore an idea she cares about`. The duplicated app/chatbot comparison replaced with a positive shared-path sentence. **`tangible` → `lasting`** in the completion keepsake. Planned components **de-numbered**: the `01`–`06` `<article>` blocks are now a semantic `<ul>` with a decorative dot, because the components are a set and not a sequence. Added the visible qualification *"These components are planned for the Founding Family Pilot and may be refined through family feedback."* No component was removed or renamed. |
| WEB-CORR-006 | The six-step journey is preserved verbatim and is now the only numbered six-part sequence on the page. |
| WEB-CORR-007 | Contribution framework unified to **Idea → Action → Contribution**, replacing `Discovery → Action → Contribution`, `From gift to action to contribution`, and `from discovery to contribution`. Stewardship vocabulary (*gifts*, *bless*) is retained in the surrounding copy. |
| WEB-CORR-008 | Human review now explicitly reads **"reviewed by a person"**. `purchasing decision` replaced with **"We market to adults, not to children. Parents and caregivers decide whether and how a child participates."** — there is no purchase flow to reference. The AI-companion boundary and the `on this site` child-account language are unchanged. |
| WEB-CORR-009 | Founder paragraph split in two, with Gregory as the grammatical subject of the mission sentence. No new credential, no photograph, `SE` seal retained. |
| WEB-CORR-010 | Navigation label shortened to **Founding Family Pilot**. All three CTAs now read **Request Founding Family Information**. `Joining the list` → `Requesting information`. Added reply-expectation microcopy and a **visible `hello@sparoahelle.com` fallback** so the address is readable with no registered mail handler. The prefilled subject and body are byte-for-byte unchanged. |
| WEB-CORR-011 | `privacy.html` home links (logo, *Return home*, footer brand) now target `/` instead of `index.html`. The notice body and its effective date are unchanged. |
| WEB-CORR-012 | `og:title`/`twitter:title` corrected to sentence case. One approved description now used across `meta`, `og`, `twitter`, and JSON-LD. Canonical URLs, `og:image`, and alt text unchanged. JSON-LD parses and declares no Product, Review, Rating, Offer, or Event type. |
| WEB-CORR-013 | Verified: **no analytics or advertising code exists in the repository.** See the scope note below. |
| WEB-CORR-014 | No horizontal overflow at 320/390/768/1024/1440 px. Menu, Escape, outside-click, skip link, focus order, and anchor offsets all still work. Two contrast fixes were required — see below. |

### Confirmed *not* added

No form, no analytics, no advertising pixel, no session replay, no payments, no accounts, no
chatbot, no child-data collection, no founder or child photograph, no testimonial, no pricing,
no legal suffix, no advisor or Good Soil claim, no new infrastructure, no framework, and no new
runtime dependency. `form-action 'none'` remains in the CSP.

### Origin-story child-identity protection (2026-08-23)

Governed by **`docs/specs/Origin Story — Child Identity and Age Clarification.md`**, approved
2026-08-23. It supersedes WEB-CORR-004's "leave the founding story unchanged" instruction for this
one passage.

The origin story now opens:

> As Gregory's daughter approached her eighth birthday, he offered her two summer experiences:
> gymnastics and a children's AI class. When asked what she wanted, she chose both—and explained why:

**Why:** the founding story stays authentic, but the site no longer confirms that the distinctive
word *Sparoah* is a specific minor's real first name. The brand may be inspired by her spark
without her identity becoming a public business asset. *Eighth* is spelled out rather than *8th*.

**Audit result:** the child was named in exactly **one** place across all deployable files — this
sentence. Every other occurrence of *Sparoah* in `index.html`, `privacy.html` and `404.html` is
the brand name *Sparoah Elle*, including the URL-encoded `Sparoah%20Elle` inside the `mailto:`
body. `og-image.png` carries the brand name and tagline only; no asset filename references her.

Unchanged: the quotation, the transition to the founding insight, Gregory's role, the brand name,
and the third-person institutional voice. No current age, birth date, surname, school, location,
schedule, photograph, handle, or contact detail was added anywhere — including metadata,
JSON-LD, alt text, and HTML comments.

Five assertions in `tests/verify.mjs` enforce this, the strongest being that **every occurrence of
"Sparoah" in a deployable file must be part of the brand name**. That guard fails on any future
edit that names the child, wherever it appears.

### Two accessibility fixes the correction required

1. `.cta-actions p` was ivory at 75% opacity. Under the CTA card's pale radial highlight that
   measures **4.0:1** — below AA. Raised to 92%, now **5.2:1**. The new microcopy sits in that
   same column, so this had to be fixed rather than inherited.
2. The visible email fallback is white and **underlined**, not gold: gold-pale measured 4.05:1
   against the same highlight, and an underline also keeps the link from being signalled by
   colour alone. Its tap target is 45 px tall.

### Test results

Two dependency-free Node suites, both passing:

| Suite | Covers | Result |
| --- | --- | --- |
| `node tests/verify.mjs` | Spec §11.1 static validation and §11.2 copy/policy assertions | **77 passed, 0 failed** |
| `node tests/browser.mjs` | Spec §11.3 rendering, §11.4 interaction, §11.5 accessibility | **29 passed, 0 failed** |

`tests/browser.mjs` drives locally installed Edge or Chrome over the DevTools protocol using
Node's built-in `WebSocket`. It adds no npm dependency, deliberately: the site ships none and the
CSP forbids external origins. It writes screenshots to `tests/screenshots/` (gitignored) at
1440×1000, 1024×768, 768×1024, 390×844, and 320×800, plus the privacy page at two widths.

Measured: no horizontal overflow at any of the five widths; 7 in-page anchors all land below the
sticky header; the `mailto:` recipient, subject, and body decode intact; 32 contrast samples all
meet AA, lowest **4.75:1**; no console errors on either page.

### Scope of the analytics verification

`tests/verify.mjs` proves the **repository** ships no tracking code, and the CSP is
`default-src 'self'`. It cannot prove anything about the host. Whether Azure Static Web Apps
injects anything at the edge is **unverified** and would need a check against the live response.

### Not deployed

**This correction release has not been deployed.** Every result above comes from the working tree
rendered over `file://`. No `./deploy.sh` run, no DNS or HTTPS check, and no live-site assertion
was made. `sitemap.xml` `lastmod` is set to 2026-08-23 for both URLs, matching the content change.

## What changed in Version 1.2

1. **Plain-language Quest definition (REQ-002).** A one-sentence definition now sits in the hero,
   directly under the lede, so a visitor understands the branded term before reaching the
   six-component list. It names no delivery format — see the open decision below.
2. **Parent-centered bridge (REQ-003).** The founding story now closes on the parent's own
   experience: seeing the spark without a clear way to help an idea forward without taking it over.
3. **Receives vs. does (REQ-004).** The Quest card list is headed **"What your family receives"**
   with *"Planned components of The Power Within"* retained beneath it, and the journey eyebrow now
   reads **"What your family does together."** The planned-status qualifier is deliberate: the
   handoff and `CLAUDE.md` require components stay visibly unshipped, which outranks the bare
   REQ-004 wording in the spec's own decision order.
4. **Service culmination (REQ-005).** A callout closing the journey section presents
   Discovery → Action → Contribution as an ordered list, so service reads as the arc's end rather
   than merely step six. No community-impact or measured-outcome claim is made.
   *(Superseded: WEB-CORR-007 unified the arc to Idea → Action → Contribution on 2026-08-23.)*
5. **Founder trust bridge (REQ-006).** One sentence connects operating discipline to being worthy
   of a child's trust and a family's time. No new credentials or advisors.
6. **CTA journey (REQ-007).** The navigation, hero, and Quest-card CTAs now scroll to
   `#founding-families` instead of opening a mail client. The final CTA there is the only email
   action, and its prefilled body now states the sender is an adult who has not included a child's
   personal information. New copy states plainly that joining does not guarantee selection or
   enroll a child.
7. **Sticky-header anchor offset (REQ-013).** The site had no `scroll-margin-top`, so anchor
   targets landed underneath the sticky header. Latent before — three CTAs now scroll — so it is
   fixed here.

Unchanged by design: metadata and structured data (already consistent with the visible page),
`script.js`, `privacy.html`, `staticwebapp.config.json`, the palette, and the type system.

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
   to action use `hello@` (5 `mailto:` links after WEB-CORR-010: `index.html` ×3 — the final CTA,
   the visible address fallback beside it, and the footer — plus `privacy.html` ×1 and `404.html`
   ×1) and `privacy@` (1 link, the privacy notice contact section). These remain the only contact
   routes on the site, so re-test if either mailbox is ever migrated or renamed.
2. **Confirm the initial audience.** The page states girls ages 7-11 in the hero eyebrow.
3. **Confirm founder naming.** The page identifies Gregory Douglas as founder.
4. **Do not add "LLC"** until the exact legal entity name is registered and active.
5. **Review the privacy notice with counsel** before collecting payments, using analytics,
   embedding a waitlist form, or collecting personalization information.
6. **Update `sitemap.xml` `lastmod`** to the actual publish date.

## Open owner decisions carried into Version 1.2

These are recorded, not guessed. Version 1.2 was implemented so that none of them had to be
resolved to ship.

| Ref | Decision | Status |
| --- | --- | --- |
| DEC-001 | Final Quest delivery format — physical, printable, digital, facilitated, hybrid, one-time, or subscription | **Unresolved.** The site uses the generic Quest definition only. No kit, box, workbook, app, portal, printable, session, or subscription language appears anywhere. |
| DEC-002 | Public Sparoah Elle email activation | **Resolved 2026-08-15.** Both mailboxes active and delivery-tested. |
| DEC-003 | Adult intake form timing | **Out of scope.** Version 1.2 adds no form. Implement only under `docs/specs/adult-intake.md` with separate authorization. |
| DEC-004 | Product mockup | **None supplied.** No placeholder, stock photo, or invented rendering was added. The hero orbit remains, but WEB-CORR-003 removed its six step chips so the journey is presented once. |
| DEC-005 | Public faith positioning | **Unchanged.** No prayer text, verse, or faith badge added. Alignment is expressed through operating boundaries. |
| DEC-006 | Audience validation | **Unchanged.** Girls ages 7–11 remains the approved pilot assumption. |

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

### Running the tests

```bash
node tests/verify.mjs    # static validation + copy/policy assertions
node tests/browser.mjs   # rendering, interaction, accessibility (needs Edge or Chrome)
```

Both must pass before `./deploy.sh`. Neither installs anything.

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
