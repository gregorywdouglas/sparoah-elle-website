# Sparoah Elle Website — Project Context

Static one-page marketing site for `https://sparoahelle.com`. The live baseline is Version 1.2;
the working tree carries the 2026-08-23 correction release and the 2026-09-22 review-handoff
release, **neither of which is deployed**.

The children's-privacy section in `privacy.html` was reviewed and approved by attorney Derrick
Deyon, recorded 2026-09-22, so the hold marker is gone and `deploy.sh` runs. The gate itself
stays: `deploy.sh` aborts on any `LEGAL-REVIEW-PENDING` comment in the markup. **Editing that
approved wording voids the review** — re-add the marker beside the block and get it re-reviewed
rather than shipping an edited version under the old approval. The disposition of
the whole 2026-09-21 external review, including what was declined and why, is in
`docs/reviews/2026-09-21-website-review-developer-handoff.md`. Do not re-litigate those refusals:
the crown redraw, the Google Fonts swap, the sample-story lead magnet, the testimonial shell and
the analytics check were each declined against a standing constraint.

Two approved specifications govern current site copy, in this order:

1. `docs/specs/Origin Story — Child Identity and Age Clarification.md` — governs the origin-story
   passage and child-identity protection. Supersedes WEB-CORR-004 for that passage.
2. `docs/specs/spec-website-correction.md` — governs everything else.

Both supersede conflicting wording in the older review and Version 1.2 requirement documents. Those
keep the old language for traceability, so never restore copy from them.

The 2026 Good Soil application window has passed and is no longer the controlling deadline. The
current phase is post-launch, pre-MVP validation and pilot readiness.

## Read this before changing anything

This site is deliberately constrained. Several things that look like omissions or oversights are
decisions. Do not "improve" them without asking:

- **No analytics, tracking pixels, or third-party scripts.** The privacy notice states this. The
  CSP in `staticwebapp.config.json` enforces `default-src 'self'` with no external origins. Adding
  a Google Fonts link, an analytics snippet, or a CDN dependency breaks both.
- **No embedded form.** Calls to action are `mailto:` links by design, until a secure adult-only
  intake workflow with approved consent language and data-retention process exists.
- **No child-facing functionality.** No child account, no chatbot, no child photo or likeness.
- **No inline `style=` attributes or inline `<script>`.** The CSP blocks them. Put styles in
  `styles.css`. The JSON-LD block in `index.html` is a data block, not executable script, and is fine.

Do not shorten, anonymise further, expand, or rewrite the founding story beyond the approved
identity wording. The quotation *"Because I want to start my own company."* and the transition
*"That answer revealed something bigger…"* are preserved exactly.

## Truthfulness constraints (non-negotiable)

The company is pre-revenue with no completed pilots. The site must never imply otherwise.

Do not add or allow copy that:
- Claims customers, revenue, completed pilots, testimonials, or measurable outcomes
- Implies endorsement, sponsorship, or affiliation with Good Soil, T.D. Jakes, Wells Fargo, or
  any other organization
- Names the child, or presents her as legal operator, founder, CEO, or competition representative —
  see **Child identity** above
- Adds "LLC" or other legal suffixes — the entity is not yet registered and confirmed active
- Guarantees confidence, learning, development, healing, or family outcomes
- Describes AI as replacing parents, advisors, or human review
- Overstates founder expertise in child development, education, psychology, or consumer products

Product components are **planned**, not shipped, and must stay visibly labeled as such. They are a
set, not a sequence: they are rendered as an unnumbered `<ul>` on purpose (WEB-CORR-005), so the
numbered six-step journey stays the only ordered sequence on the page. Do not renumber them, and do
not reintroduce a second presentation of the six steps anywhere else.

Do not describe the Quest as a kit, box, workbook, printable, portal, app, live class, subscription,
shipped product, facilitated session, or hybrid product. The final delivery format is undecided.

Geography and shipping scope for the completion keepsake is `DEC-007` in `README.md`, tagged
**PENDING PRODUCT LAUNCH** on 2026-09-22. It is not a pre-pilot blocker and does not need a site
change: it is downstream of the undecided delivery format, and no shipping claim appears anywhere
on the site. Do not raise it as outstanding work, and do not add shipping, region, or delivery
copy to answer it. Revisit only when the delivery format itself is decided.

## Child identity (approved 2026-08-23)

The child is **never named on the public site.** The origin story refers to her as
**"Gregory's daughter"**, never as "Sparoah". The brand may be inspired by her spark without her
identity becoming a public business asset, and the site must not confirm that the distinctive word
*Sparoah* is a specific minor's real first name.

- The approved opening is: *"As Gregory's daughter approached her eighth birthday, he offered her
  two summer experiences: gymnastics and a children's AI class."* **"Eighth" is spelled out**, never
  "8th".
- Keep the section in **third-person institutional voice**. Do not use "my daughter" and do not
  convert it to a first-person Founder's Note without a separately approved release.
- Never add current age, birth date, surname, full legal name, school or grade, location, schedule,
  recurring activities, photograph, video, voice, social account, contact details, or health,
  educational, behavioural or family information — in visible copy **or** in metadata, Open Graph
  and X/Twitter tags, JSON-LD, alt text, image filenames, HTML or JS comments, or any documentation
  that gets deployed.
- Her birthday and age are a restrained one-time origin story, not a recurring promotional device.
  Do not build content around "she was only eight", her birthday, or her ambitions. Future content
  belongs on Gregory's founder journey, parent insight, building the Quest, protection by design,
  stewardship and service, and verified pilot evidence.
- Every use of **Sparoah Elle** as the company and brand name is preserved and unaffected.

`tests/verify.mjs` enforces this: **every occurrence of "Sparoah" in a deployable file must be part
of the brand name.** As of 2026-08-23 the child was named in exactly one place — the origin-story
sentence — and that is now fixed. The guard fails on any future edit that reintroduces her name.

## Brand rules

- Public name is **Sparoah Elle** — never hyphenated. `SparoahElle` only in domains and identifiers.
- Tagline: *Every Quest builds the Queen within.*
- "Queen" means dignity, wisdom, courage, creativity, responsibility, compassion, stewardship,
  service. Explanatory phrase: *Not status. Stewardship.* Never superiority or status.
- Avoid cartoon crowns, Pharaoh imagery, pyramids, hieroglyphics, or a child mascot.
- The `SE` seal is a temporary launch mark, not the final logo.
- Palette: deep charcoal/brown, ivory, muted gold. Premium and warm, not childish.
- Founder is displayed as **Gregory Douglas**.

## Accessibility

Maintain WCAG AA. Three colour values are load-bearing and were each set to fix a measured failure:

- `--gold-deep` is `#85602c` because the previous `#8f692f` measured 4.16:1 against the
  quest-section background, below the 4.5:1 minimum for small text.
- `.cta-actions p` is ivory at **92%**, not the 75% used elsewhere on that card. The CTA card has a
  pale radial highlight in its top-right corner — exactly where the actions column sits — and 75%
  measures 4.0:1 against it. The email fallback link is white and underlined for the same reason:
  `--gold-pale` measures 4.05:1 there.

- `.cta-next-label` is ivory, not `--gold-pale`. It sits in the same highlight, where gold
  measures 4.0:1. Gold is fine on the card's darker left column (`.cta-card .eyebrow`, 6.5:1) —
  the two are not interchangeable.

Re-check contrast if you change any colour token, and re-run `node tests/browser.mjs`, which
measures 40 text samples against the worst-case rendered background.

`--warm-muted` (`#6b5a4a`) replaced the off-palette cool grey `#6f625d` on the tagline and the
trust line. It is a palette value, not a neutral — do not reintroduce a grey for muted text.

## Design tokens

Since 2026-09-22 `styles.css` carries a named scale for type, weight, spacing and radius, and
`tests/verify.mjs` fails on any raw `font-size`, `font-weight` or `border-radius` outside it.
Use a token or add one deliberately; do not reach for a one-off value.

- **Type:** seven steps (`--text-xs` … `--text-2xl`), plus three fluid display sizes
  (`--display-1/2/3`) redefined at the 620px breakpoint rather than overridden per rule. Fluid
  sizes are `clamp()`s built from those tokens and a `vw` middle term.
- **Weight:** three — `--weight-body` 400, `--weight-medium` 600, `--weight-bold` 700.
- **Radius:** three — `--radius-pill`, `--radius-card`, `--radius-round`.
- **Spacing:** 4px base, 8px grid from `--space-md` up. A few optical values stay raw and are
  commented where they are (the `.includes-list` dot offsets, the menu-button geometry).

## Contact addresses

Migrated off `gregory.w.douglas@cheopsconsulting.com` on 2026-08-12. Delivery to both mailboxes was
tested and confirmed on 2026-08-15. Current state:

- **`hello@sparoahelle.com`** — 5 `mailto:` links: in `index.html`, the final Founding Family CTA,
  the visible address fallback directly beneath it, and the footer link; plus the footer link in
  `privacy.html` and the footer link in `404.html`. Display name **`Sparoah Elle`**.
- **`privacy@sparoahelle.com`** — 1 occurrence: the privacy notice contact section only. Display name
  **`Sparoah Elle Privacy`**.

Since Version 1.2, the navigation, hero, and Quest-card CTAs link to `#founding-families` instead of
opening a mail client. Do not reintroduce a `mailto:` above that section — REQ-007 exists so a
visitor sees the pilot context and the adult-only notice before an email client opens.

Inside that section there are now two `hello@` links: the prefilled CTA button and, beneath it, the
visible `Or email us directly at hello@sparoahelle.com.` fallback. The fallback is required by
WEB-CORR-010 so the address is readable when no mail handler is registered — do not remove it as a
duplicate. Only the button carries the prefilled subject and body.

Both are Microsoft 365 shared mailboxes. Do not add "Team", "Office", "Support", or "Data Protection
Officer" to either display name — one person operates both, and naming a department that does not
exist is a false statement in the From line. No legal suffix in a display name, before or after
entity registration.

Never reintroduce a personal or Cheops address into public site copy. If a new CTA is added, it uses
`hello@`. See `docs/specs/adult-intake.md` §11.2.

## Deployment

Host: **Azure Static Web Apps, Free plan.** Registrar: **Network Solutions**, with DNS delegated to
**Azure DNS** (Network Solutions supports no ALIAS/ANAME record, so the apex domain cannot be bound
without it).

Live resources, all in resource group `rg-sparoah-elle-prod`:

| Resource | Purpose |
| --- | --- |
| `stapp-sparoah-elle-site` | The live Static Web App (East US 2), `nice-moss-08e76d60f.7.azurestaticapps.net` |
| `sparoahelle.com` DNS zone | Apex ALIAS A record targets the app by resource ID; `www` is a CNAME |

Deploy with:

```bash
./deploy.sh
```

Do not run `swa deploy ./` by hand. `StaticSitesClient` refuses to run when the shell's working
directory is the artifact folder, failing with an "unknown exception" that is only visible under
`--verbose=silly`. `deploy.sh` stages to a temp directory and deploys from its parent to avoid this.

`deploy.sh` also publishes an explicit allowlist of 13 files rather than the whole folder. Deploying
the folder wholesale would publish `CLAUDE.md`, `README.md`, `deploy.sh`, and
`docs/specs/adult-intake.md` at their own public URLs. Add new public assets to `PUBLIC_FILES`.

Never commit the deployment token. It belongs in a local `.env` file, which is gitignored. The token
is per-app: recreating the app invalidates it, and a fresh one comes from
`az staticwebapp secrets list --name <app> --resource-group rg-sparoah-elle-prod --query "properties.apiKey" -o tsv`.
Write it without a BOM — PowerShell's `Set-Content -Encoding utf8` adds one and bash cannot then
source the file.

`https://sparoahelle.com/` is canonical and is declared in the markup, `sitemap.xml`, and `robots.txt`.

Update `sitemap.xml` `lastmod` whenever content changes materially.

### Never delete a Static Web App you still need

On this subscription, deleting a Static Web App takes hours and sometimes a full day. Throughout,
the resource still exists but rejects all deployments with `The matching Static Web App is being
deleted`, and it holds its custom-domain reservations, so those hostnames cannot be bound anywhere
else. Two apps were lost this way on 2026-08-12 and 2026-08-13.

If an app must be replaced, create the replacement and cut DNS over to it **first**, and only then
delete the old one.

## Tests

Two dependency-free Node suites live in `tests/`. They are deliberately dependency-free: the site
ships no third-party code and the CSP forbids external origins, so the tests must not add any.

```bash
node tests/verify.mjs    # static validation + copy/policy assertions
node tests/browser.mjs   # rendering, interaction, accessibility (drives Edge or Chrome over CDP)
```

`tests/verify.mjs` enforces the truthfulness rules above as executable assertions — the banned
words, the exact `mailto:` subject and body, the mailbox allowlist, the absence of a form or
analytics, and metadata/JSON-LD alignment. If you intentionally change approved copy, update the
assertion in the same commit so the guardrail keeps meaning something.

`tests/screenshots/` is generated output and is gitignored.

## Before any deploy

- Both test suites pass
- Run the verification checklist in `README.md`
- Confirm no new external network requests were introduced
- Confirm no copy drifted into claiming traction the company does not have
