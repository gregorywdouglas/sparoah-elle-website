# Sparoah Elle Website — Project Context

Static one-page marketing site for `https://sparoahelle.com`. Currently Version 1.1.
Immediate objective: publish a polished, truthful, mobile-responsive site before submitting the
2026 Good Soil Seed Capital Pitch Competition application.

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

## Truthfulness constraints (non-negotiable)

The company is pre-revenue with no completed pilots. The site must never imply otherwise.

Do not add or allow copy that:
- Claims customers, revenue, completed pilots, testimonials, or measurable outcomes
- Implies endorsement, sponsorship, or affiliation with Good Soil, T.D. Jakes, Wells Fargo, or
  any other organization
- Presents Sparoah (the child) as legal operator, founder, CEO, or competition representative
- Adds "LLC" or other legal suffixes — the entity is not yet registered and confirmed active
- Guarantees confidence, learning, development, healing, or family outcomes
- Describes AI as replacing parents, advisors, or human review
- Overstates founder expertise in child development, education, psychology, or consumer products

Product components are **planned**, not shipped, and must stay visibly labeled as such.

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

Maintain WCAG AA. `--gold-deep` is `#85602c` specifically because the previous `#8f692f` measured
4.16:1 against the quest-section background, below the 4.5:1 minimum for small text. Re-check
contrast if you change any color token.

## Contact addresses

Migrated off `gregory.w.douglas@cheopsconsulting.com` on 2026-08-12. Delivery to both mailboxes was
tested and confirmed on 2026-08-15. Current state:

- **`hello@sparoahelle.com`** — 4 `mailto:` links: the final Founding Family CTA and the footer link
  in `index.html`, the footer link in `privacy.html`, the footer link in `404.html`. Display name
  **`Sparoah Elle`**.
- **`privacy@sparoahelle.com`** — 1 occurrence: the privacy notice contact section only. Display name
  **`Sparoah Elle Privacy`**.

Since Version 1.2, the navigation, hero, and Quest-card CTAs link to `#founding-families` instead of
opening a mail client, so the final CTA in that section is the **only** place on the page that starts
an email. Do not reintroduce a `mailto:` above that section — REQ-007 exists so a visitor sees the
pilot context and the adult-only notice before an email client opens.

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

## Before any deploy

- Run the verification checklist in `README.md`
- Confirm no new external network requests were introduced
- Confirm no copy drifted into claiming traction the company does not have
