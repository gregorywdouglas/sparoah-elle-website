# Website Review & Developer Handoff — 2026-09-21

External review of `https://sparoahelle.com`, vendored for traceability, with the
disposition of each item recorded against it.

Implemented 2026-09-22. Photography, video and form items were excluded from that
pass by instruction. Nothing here overrides `CLAUDE.md`, the origin-story spec, or
`docs/specs/spec-website-correction.md`; where the review conflicted with those,
the constraint won and the reason is recorded below.

---

## Disposition

### Built

| # | Item | Where |
| --- | --- | --- |
| 1 | Pilot scope stated in the Founding Family section | `index.html` — "a small, limited group", rolling review. No cap was ever confirmed, so no number is published. |
| 2 | "What happens next" block beside the CTA | `index.html` — `.cta-next`, three expectations. No reply-time promise: no service level has been committed to. |
| 3 | Quest #1 context and commitment | `index.html` — `.quest-scope`. Says length and pace are being shaped with founding families rather than naming a duration. |
| 5 | Font fallback | `styles.css` — `--serif` now carries Georgia, Noto Serif and Liberation Serif behind the Palatino names, so Android and Linux stop falling through to an unstyled serif. |
| 6 | FAQ | `index.html` — `#questions`, six answers, above the pilot CTA, linked from the nav. |
| 8 | Design tokens | `styles.css` — 7-step type scale + 3 fluid display sizes, 3 weights, 3 radii, one spacing scale. Enforced by `tests/verify.mjs`. |
| 9 (part) | Referral / share link | `index.html` — `.share-link`, a `mailto:` with no recipient, below the pilot context. |
| 10 | COPPA-aware children's privacy | `privacy.html` — `.children-privacy`. **Held from deploy**, see below. |
| Logo (part) | Icon weight and tagline colour | `styles.css`, `favicon.svg` — seal stroke 1.8 → 2.8, favicon strokes raised so they survive 16px, tagline moved off the cool grey onto `--warm-muted`. |

### Excluded from this pass by instruction

Items 4, 7, 11 and 14, and the lead-magnet half of item 9: all photography, the
founder portrait, the founder video, and anything requiring a form or a form-routing
test. The six generated images are not in the repository.

### Declined, with reason

| # | Item | Reason |
| --- | --- | --- |
| 5 / Design | Replace Iowan Old Style with Fraunces, Canela or Freight Display via Google Fonts | The CSP is `default-src 'self'` with no external origins, and the privacy notice states the site loads no third-party resources. A licensed face can be **self-hosted** later — that needs a licence decision and a `font-src` line, not a CDN link. The fallback fix above is what was safe to do now. |
| Design / Colour | Add a dedicated CTA highlight colour; commit to or drop the rose | Primary and secondary CTAs are already distinct (filled ink vs. outlined). `--rose` and `--plum` are not used once each — the review appears to have counted computed text colours; both appear in the hero glow, the orbit gradient, the quest-section wash and the CTA card. Introducing a new accent would require re-measuring the AA work described in `CLAUDE.md`. |
| Logo | Redraw the icon as a clear 3-point crown | `CLAUDE.md` brand rules: no cartoon crowns. The `SE` seal is also a temporary launch mark, not the final logo, so a redraw belongs in the identity work rather than here. Legibility was addressed through stroke weight instead. |
| 9 | Lead magnet — "get a free sample Quest story" | The sample does not exist, and the company is pre-MVP with no fulfilment path. Offering it would be a claim of a deliverable the company cannot produce, and delivering it would need a form. |
| 12 | Testimonial / social-proof section shell | `tests/verify.mjs` bans testimonial and endorsement framing, and an empty shell would trip the empty-container assertion. Build it when there is pilot evidence to put in it. |
| 13 | Verify analytics / conversion tracking is installed | Deliberately absent. The privacy notice says the site uses no analytics and the CSP enforces it; `tests/verify.mjs` fails the build on eighteen tracking patterns. |

### Open items still needing a real answer

Cost, Quest length and pilot cap are now published as *undecided* rather than
guessed. When the real answers exist, update the FAQ and the pinned assertions in
`tests/verify.mjs` in the same commit.

**Geography and shipping scope for the completion keepsake — `DEC-007`, tagged
PENDING PRODUCT LAUNCH (2026-09-22).** The review listed this as a pre-publish
question. It is not one. It sits downstream of `DEC-001`, the undecided Quest
delivery format: there is no shipping scope to settle until it is known whether
anything ships. The site carries no shipping claim to correct — the keepsake is
described only as "a lasting reminder that her ideas, voice, effort, and
contribution matter", and `tests/verify.mjs` already fails on `shipped`, `kit` and
`box`. Revisit alongside `DEC-001` at product launch. Tracked in `README.md`.

### Legal review — cleared

The children's-privacy section in `privacy.html` was **reviewed and approved by
attorney Derrick Deyon**, recorded 2026-09-22. The `LEGAL-REVIEW-PENDING` marker has
been removed and `deploy.sh` no longer aborts.

The gate remains in `deploy.sh` for future use: it aborts on any `LEGAL-REVIEW-PENDING`
comment in the markup, and `tests/verify.mjs` asserts it stays in place whether or not
anything is currently held. Editing the approved wording voids the approval — re-add
the marker beside the block and get it re-reviewed rather than shipping an edited
version under the old sign-off.

The attorney's name is recorded here and in `README.md`, not in `privacy.html`: that
file is published, and the copy guard forbids naming a reviewer in the notice.

Points the review had flagged for counsel, which the approval covers:

- Whether collecting a child's first name for personalization requires Verifiable
  Parental Consent under COPPA, or is exempt because it is collected from the parent
  and not retained against the child's identity.
- Whether shipping a completion keepsake (name and address on a label) counts as
  personal information under COPPA and needs explicit consent language.
- State-level children's privacy provisions (California CCPA/CPRA minors) if serving
  California users.

---

## Original review

**Prepared:** September 21, 2026
**Site reviewed:** https://sparoahelle.com

### Executive summary

The site is well-positioned and well-written for a pre-launch parenting brand — clear
niche, strong trust messaging, tasteful cream/gold palette. The highest-leverage gaps
are: no real photography of people (currently all icons/abstract graphics),
inconsistent design tokens (32 font sizes, 7 border-radius values), a single
high-commitment CTA with no lighter capture option, and missing content that reduces
friction for skeptical parents (FAQ, pilot cap/timeline, COPPA-specific privacy
language).

### Priority punch list

Quick wins: state the pilot cap/deadline; add a "what happens after you submit"
block; clarify Quest #1's context and time commitment; replace the "SE" monogram with
a founder portrait; fix the `Iowan Old Style` font fallback, which is an Apple system
font and will not render on Windows/Android/Linux.

Medium effort: add an FAQ addressing AI/data/cost/age objections; place the six
generated images into their mapped sections; consolidate the type scale, spacing
scale and border-radius values; add a secondary low-commitment capture path and a
referral/share link; add COPPA-aware children's privacy language.

Bigger lift: founder video (60–90 sec); real testimonials once the pilot completes;
verify analytics and mobile load speed; confirm the founding-family form routes to a
monitored inbox.

### Design system notes

**Typography.** 32 distinct font sizes across the page, 9 font-weights (400–900), and
an Apple-only display font. Consolidate to a 7-step scale — `14 / 16 / 18 / 22 / 28 /
40 / 56px` — and three weights: 400 body, 600 subheads, 700 headlines.

**Colour.** Keep `#1b1715`, `#fffdf9` / `#fbf7ef`, `#85602c`, `#3c3430`, `#e8d6ab`.
`#a86473` and `#6d3546` read as underused. Add a CTA/highlight colour distinct from
the near-black buttons.

**Spacing and radius.** Standardize to an 8px spacing scale — `8 / 16 / 24 / 32 / 48 /
64 / 96 / 128px` — and three radii: `999px` pills, `20px` cards, `50%` avatars.

> Implementation note: the spacing scale as built is 4px-based — `4 / 8 / 12 / 16 /
> 24 / 32 / 48 / 64 / 96 / 128`. A pure 8px grid would have moved several optically
> tuned values (the 44px tap-target padding, the 12px header gaps) by up to 3px. It
> contains the review's scale as a subset.

**Logo.** The icon is not legible as a crown; its line weight does not match the
wordmark; the tagline is a pale grey rather than a brand warm brown; test the icon at
16×16 and 32×32 before finalizing.

### Copy drafts

The review supplied drafts for the pilot cap, the "what happens next" block, Quest #1
context, the FAQ, a lead magnet, a referral/share mailto, and a COPPA children's
privacy section. What shipped differs from the drafts wherever a draft assumed a fact
the company does not have — a 20-family cap, a 2–3 day reply, a one-to-two-week Quest
duration, a price — or used wording the copy guardrails ban (the share body's "not
another app handing kids off to AI" trips the banned duplicate-comparison rule). The
shipped wording is what `tests/verify.mjs` now pins.
