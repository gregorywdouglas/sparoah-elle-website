---
title: Sparoah Elle Website Correction Specification
filename: spec-website-correction.md
status: Approved for implementation
spec_version: 1.0
date: 2026-08-23
production_url: https://sparoahelle.com/
release_type: Small post-launch correction release
---

# Sparoah Elle Website Correction Specification

## 1. Purpose

This specification defines the **single, bounded correction release** for the existing Sparoah Elle website.

Claude Code must implement the approved corrections in the current repository without redesigning the site, changing the product strategy, adding unapproved functionality, or reopening settled copy decisions.

The website is already live and is the production baseline. The goal of this release is to:

1. Remove unsupported or format-implying language.
2. Correct structural repetition.
3. Make the adult next step match the action that actually occurs.
4. Strengthen precision in the family-trust and founder sections.
5. Align visible copy, metadata, structured data, and contact mechanics.
6. Preserve every approved child-safety, privacy, truthfulness, brand, and founder-positioning boundary.
7. Finish the website correction cycle so the business can move into product definition, parent discovery, and pilot preparation.

This is **not** another brand review. Claude Code must implement the decisions in this document rather than proposing alternate copy merely to demonstrate creativity.

---

## 2. Current business context

- The website is live at `https://sparoahelle.com/`.
- The 2026 Good Soil application window has passed and is no longer the controlling deadline.
- The current phase is post-launch, pre-MVP validation, and pilot readiness.
- `hello@sparoahelle.com` and `privacy@sparoahelle.com` have received external email successfully.
- The current Founding Family `mailto:` path has preserved:
  - Subject: `Founding Family Interest`
  - Body: `I am an adult interested in learning more about the Sparoah Elle Founding Family Pilot. I have not included personal information about a child.`
- The CHEOPS signature shown in test evidence was inserted by the sending Outlook profile. It was not inserted by the website and is not a website defect.
- The site remains intentionally email-based.
- The current privacy notice states that the site does not use an embedded form, advertising tracker, or analytics tool.
- The site does not collect child information, accept payments, create child accounts, or provide a child-facing chatbot.

---

## 3. Governing precedence

Use this order when requirements conflict:

1. **This specification**
2. `01_Sparoah_Elle_Updated_Handoff_v2.0.md`, when present
3. Current-state and decision-log documents, when present
4. The current repository implementation and verified live-site evidence
5. Older website requirements and review documents
6. Claude Code recommendations

This specification supersedes conflicting recommendations in earlier website-review or Version 1.2 requirement documents.

Claude Code must not silently restore older copy that this specification replaces.

---

## 4. Foundational decision framework

Every change must reflect:

- **Protection before personalization**
- **Truth before appearance**
- **Stewardship before scale**
- **Service before status**
- **Human relationship before passive technology consumption**
- **Clarity before persuasion**

The public website does not need to display the foundational prayer or add religious language to demonstrate alignment. Alignment must be visible through truthful claims, restrained data practices, parent leadership, service, and responsible execution.

No conversion improvement may weaken child safety, privacy, or truthfulness.

---

## 5. Release decisions

The following decisions are final for this release.

### 5.1 Keep the existing architecture

- Preserve the existing static HTML, CSS, and JavaScript implementation.
- Preserve the one-page homepage and separate `privacy.html`.
- Do not migrate to React, Vue, Angular, a CMS, or another frontend framework.
- Do not change hosting, DNS, registrar, or cloud architecture under this scope.
- Do not add a backend or API.

### 5.2 Keep the email-based adult contact path

- Preserve the `mailto:` workflow.
- Do not build an embedded form.
- Do not implement the future adult-only intake workflow.
- Do not create a database, verification token, consent ledger, retention job, or admin interface.
- Do not change the privacy notice to claim that those controls exist.
- Keep `hello@sparoahelle.com` for general and Founding Family inquiries.
- Keep `privacy@sparoahelle.com` for privacy inquiries.

### 5.3 Preserve the temporary `SE` brand seal

- Do not remove the `SE` seal merely because Gregory Douglas's initials are different.
- The seal is a temporary Sparoah Elle brand mark, not Gregory's personal monogram.
- Do not add a founder photograph in this release.
- Do not add a child photograph, family stock photograph, or child mascot.

### 5.4 Preserve the current origin story

Do not shorten, anonymize, expand, or rewrite the founding story in this release.

Do not add more personal information about Sparoah.

### 5.5 Keep the direct AI boundary

Preserve this sentence unchanged in the family-promise section:

> Children are not handed over to an open-ended AI companion.

Remove only the separate, repetitive app/chatbot comparison from the Quest section.

### 5.6 Preserve the current product-format uncertainty

Do not describe the Quest as a:

- physical kit
- box
- workbook
- printable product
- digital portal
- app
- live class
- subscription
- shipped product
- facilitated session
- hybrid product

Do not invent pricing, dates, cohort size, fulfillment, availability, or pilot time commitments.

### 5.7 No new review cycle

Claude Code must not:

- produce another general copy review;
- propose a redesigned message hierarchy;
- rewrite the whole page;
- substitute different wording for the exact approved copy in this specification;
- reopen decisions marked final.

If a requirement cannot be implemented because the repository differs materially from the recorded live state, report the conflict precisely and stop only the affected change.

---

## 6. Scope

### 6.1 In scope

- Homepage copy corrections defined in this specification
- Homepage structural simplification
- CTA wording and adult-contact expectation setting
- Metadata and JSON-LD alignment
- Canonical home-link correction on the privacy page
- Accessibility and responsive regression protection
- Verification that no analytics or tag-manager code ships
- README or release-note updates
- A deployment-ready static package, if the repository already uses packaging

### 6.2 Out of scope

Do not implement:

- Adult-only intake form
- Child enrollment
- Child questionnaire
- Free-text intake
- File uploads
- Analytics
- Advertising pixels
- Session replay
- Third-party CAPTCHA
- Payments
- Accounts or authentication
- AI chatbot
- Personalization collection
- Product mockups not already approved
- Founder photograph
- Child photography
- Testimonials
- Pilot results
- Pricing
- Legal suffixes
- Advisor claims
- Good Soil references
- Public prayer, Bible verses, Christian badges, or performative faith copy
- DNS, registrar, hosting, or production-resource changes
- A framework migration

---

## 7. Approved copy and structural requirements

## WEB-CORR-001 — Global truthfulness search

**Priority:** Critical

Search all deployable public files and active metadata for:

- `confidence`
- `tangible`
- `recognize a good idea`
- `Join the Founding Family List`
- `Discovery`
- `From gift to action to contribution`
- `from discovery to contribution`
- `another app`
- `open-ended chatbot`
- `are reviewed`
- `purchasing decision`

Also inspect:

- `<meta name="description">`
- Open Graph tags
- X/Twitter tags
- JSON-LD
- visible copy
- `og-image.png` source or embedded text, when applicable
- `README.md` and current release documentation

Historical or superseded review documents may retain old language for traceability. Public deployable files and active source-of-truth documentation must not.

### Acceptance criteria

- No public surface makes an unsupported confidence claim.
- No public surface describes the keepsake as tangible or otherwise commits to a delivery format.
- JSON-LD remains valid JSON after any edit.
- No old CTA label remains in public navigation or public action copy, except where quoted in historical documentation.

---

## WEB-CORR-002 — Hero copy

**Priority:** Critical

### Preserve unchanged

- Eyebrow:
  > Parent-led Quest experiences for girls ages 7–11
- H1:
  > Every girl carries an idea worth exploring.
- Quest definition:
  > A Quest is a guided family experience that combines a personalized story, parent-child conversation, a creative challenge, reflection, and an act of service.
- Trust chips:
  - Parent-led
  - Human-reviewed
  - Privacy-conscious
- Secondary CTA:
  > Explore the First Quest

### Replace the hero support sentence with

> Sparoah Elle gives parents a guided way to help a girl explore an idea, bring it to life, and use what she creates to serve someone else.

This replaces any hero sentence that claims or implies that the Quest produces confidence.

### CTA behavior

- The hero primary CTA must continue to scroll to the Founding Family section rather than opening an email client immediately.
- Hero primary label:
  > Request Founding Family Information

### Acceptance criteria

- The hero contains no unsupported confidence, developmental, educational, psychological, or family-outcome claim.
- The Quest definition remains visible and unchanged.
- The primary CTA reaches the contextual Founding Family section.
- The secondary CTA still reaches the first Quest section.
- The hero remains readable at 320-pixel width without overflow.

---

## WEB-CORR-003 — Queen section

**Priority:** High

### Remove the duplicate six-step chips

Delete the Queen-band presentation of:

- Discover
- Talk
- Create
- Reflect
- Share
- Serve

The canonical six-step journey must remain only in the full journey section later on the page.

Do not replace the removed chips with new copy or another framework.

### Preserve unchanged

- Display line:
  > Dignity. Wisdom. Courage. Service.
- Explanatory heading:
  > Not status. Stewardship.

### Replace the Queen definition with

> Not status. Stewardship. The Queen within is the dignity to know her worth, the courage to act on her ideas, the wisdom to choose well, the creativity to build, and the compassion to use her gifts in service to others.

Avoid rendering `Not status. Stewardship.` twice if it is already a separate visible heading. In that case, the definition may begin:

> The Queen within is the dignity to know her worth, the courage to act on her ideas, the wisdom to choose well, the creativity to build, and the compassion to use her gifts in service to others.

### Presentation

- Preserve the current premium visual treatment.
- Rebalance spacing after the chips are removed.
- Do not add new icons, virtues, decorative crowns, or replacement chips.
- Do not remove the `SE` seal elsewhere on the site.

### Acceptance criteria

- The six-step journey appears once on the homepage.
- Dignity and courage are assigned to distinct ideas.
- Creativity and service remain part of the definition.
- The section does not become visually empty or introduce excessive whitespace on mobile.

---

## WEB-CORR-004 — Founding story

**Priority:** Preserve

Do not edit the founding-story copy.

Preserve the parent-emotional bridge exactly as currently published:

> Parents often see the spark—the questions, sketches, plans, and possibilities—but do not always have a clear way to help an idea move forward without taking it over. A Quest gives families an intentional path to listen, encourage, and help one idea take its next meaningful step.

Do not replace `do not always have a clear way` with `do not always know how`.

### Acceptance criteria

- The existing story and quotation remain unchanged.
- No additional child details are added.
- No child photograph is introduced.
- The current parent bridge remains word-for-word unchanged.

---

## WEB-CORR-005 — The Power Within product description

**Priority:** High

### Replace the current product description with

> A personalized, parent-led experience designed to help a girl explore an idea she cares about, bring it to life, and discover how her gifts can make a difference.

This replaces `recognize a good idea`.

### Replace the duplicated negative app/chatbot sentence with

> Each Quest is designed to give a parent and girl a clear path to read, talk, imagine, create, reflect, and serve together.

The family-promise section remains the single authoritative location for the explicit AI-companion boundary.

### Preserve unchanged

- Product name:
  > The Power Within
- Badge:
  > Founding Family Pilot — Now Forming
- Heading:
  > More than an activity. A shared journey.
- Heading:
  > What your family receives
- Subheading:
  > Planned components of *The Power Within*
- All six approved component names, including:
  > A completion keepsake

### Add the approved qualification beneath the planned-components subheading

> These components are planned for the Founding Family Pilot and may be refined through family feedback.

### Keepsake correction

Replace:

> A tangible reminder that her ideas, voice, effort, and contribution matter.

With:

> A lasting reminder that her ideas, voice, effort, and contribution matter.

Do not remove or rename `completion keepsake`.

### De-number planned components

The six planned components are a set, not a sequence.

- Remove visible `01`–`06` numbering.
- Prefer semantic unordered-list or card-list markup.
- Preserve the component order unless the existing layout requires a different accessible flow.
- Do not add replacement numbering, letters, or step language.

### Acceptance criteria

- No adult quality filter such as `good idea` remains.
- The copy does not imply a finalized physical, digital, or fulfillment format.
- The planned nature of the components is visible.
- Components are visibly distinct from the numbered Quest journey.
- The explicit chatbot boundary is not repeated in this product section.
- No component is removed.

---

## WEB-CORR-006 — Six-step journey

**Priority:** Preserve with structural distinction

Preserve the canonical steps and their existing order:

1. Discover
2. Talk
3. Create
4. Reflect
5. Share
6. Serve

Preserve the section label:

> What your family does together

Preserve the heading:

> Designed for connection, not passive consumption.

Do not introduce a second presentation of this journey elsewhere.

Do not revise the Reflect description under this release unless a repository conflict prevents the structural correction. The correction release is not authorization for a broader journey rewrite.

### Acceptance criteria

- The journey is the only numbered six-part sequence on the page.
- The planned components are visually and semantically distinct from the journey.
- Existing anchor navigation still exposes the section heading below the sticky header.

---

## WEB-CORR-007 — Contribution framework

**Priority:** High

Unify all versions of the three-part contribution arc.

### Ordered arc

Use:

1. Idea
2. Action
3. Contribution

### Heading

Use:

> From idea to action to contribution.

### Supporting paragraph

Use:

> Every Quest moves from idea to action to contribution. The service step invites a girl to use what she discovered or created to encourage, help, or bless someone beyond herself.

### Preservation requirement

Do not remove the words `gifts`, `bless`, or other stewardship language from unrelated approved copy merely because `gift` is removed from this framework heading.

### Acceptance criteria

- `Discovery → Action → Contribution` no longer appears as this framework.
- `From gift to action to contribution` no longer appears as this framework heading.
- `from discovery to contribution` no longer appears in the framework paragraph.
- The contribution section does not claim completed service outcomes or measured community impact.

---

## WEB-CORR-008 — Family promise

**Priority:** Critical

### Preserve unchanged

- Section heading:
  > Childhood should be protected while possibility is expanded.
- Parent-led commitment
- Minimal-information commitment
- Sentence:
  > Children are not handed over to an open-ended AI companion.
- Current `on this site` language concerning child accounts, if present

### Human-review correction

Replace passive wording with:

> Child-facing personalized materials are reviewed by a person before they reach a family.

### Direct-marketing correction

Use:

> We market to adults, not to children. Parents and caregivers decide whether and how a child participates.

This copy must appear beneath the `No direct marketing to children` heading.

Do not use `purchasing decision` in this release because there is no public purchase flow.

### Acceptance criteria

- Every trust-card body directly supports its heading.
- Human review explicitly means review by a person.
- The site does not claim to be AI-free.
- The site does not imply a current purchase path.
- No child account, child marketing, or chatbot boundary is weakened.

---

## WEB-CORR-009 — Founder section

**Priority:** High

### Preserve

- Gregory Douglas as the adult founder
- Enterprise technology architect positioning
- More than 25 years of experience
- The existing founder-section heading
- The temporary `SE` brand seal
- The absence of a child photograph
- The absence of a legal suffix
- The boundary against overstating child-development, educational, psychological, or consumer-product expertise

### Replace the founder paragraph with two paragraphs

> Sparoah Elle was founded by Gregory Douglas, an enterprise technology architect with more than 25 years of experience designing complex systems and turning ideas into disciplined execution.

> He brings that same discipline to a more personal mission: creating safe, thoughtful experiences that help girls explore what they can build and who they can bless. For Gregory, that means building something worthy of a child’s trust and a family’s time.

### Prohibitions

- Do not add a founder photograph.
- Do not remove the `SE` seal.
- Do not add `CEO`, `LLC`, child-development expert, educator, psychologist, or advisor claims.
- Do not describe Gregory's technology experience as child-development expertise.

### Acceptance criteria

- Gregory remains the grammatical subject of the mission statement.
- The paragraph is split for readability without creating excessive whitespace.
- Founder credibility remains relevant to family trust and responsible execution.
- No unapproved credential is introduced.

---

## WEB-CORR-010 — Founding Family CTA and adult email path

**Priority:** Critical

### Navigation label

Replace the current long navigation label with:

> Founding Family Pilot

The navigation item must continue to anchor to the Founding Family section.

### In-page labels

Use:

> Request Founding Family Information

for:

- the hero primary CTA;
- the Quest-section Founding Family link;
- the final email CTA.

The hero and Quest-section links may scroll to the contextual Founding Family section. The final CTA opens the verified `mailto:` link.

### Replace enrollment-implying copy

Replace:

> Joining the list does not guarantee selection or enroll a child.

With:

> Requesting information does not guarantee selection or enroll a child.

### Preserve adult-protection language

Preserve:

> Please provide only your own contact information.

Preserve:

> Adults only. Please do not email personal information about a child.

### Add expectation-setting microcopy

Add near the final CTA:

> We’ll reply with adult-only pilot details and next steps. No child information is needed at this stage.

### Add a visible fallback

Add near the final CTA:

> Or email us directly at hello@sparoahelle.com.

The displayed address must be an actual `mailto:` link.

### Preserve exact mailto mechanics

Recipient:

```text
hello@sparoahelle.com
```

Subject:

```text
Founding Family Interest
```

Body:

```text
I am an adult interested in learning more about the Sparoah Elle Founding Family Pilot. I have not included personal information about a child.
```

Do not add a child questionnaire, free-text prompt, age field, or personalization request to the email body.

### Acceptance criteria

- No public CTA says `Join the Founding Family List`.
- The navigation label remains concise and truthful.
- The final action opens a correctly encoded email draft.
- The subject and body remain intact after the change.
- The email address is visible even if a browser has no registered mail handler.
- The page states that requesting information does not enroll a child or guarantee selection.
- No form or database is introduced.

---

## WEB-CORR-011 — Privacy page

**Priority:** Critical

Preserve the privacy-notice body and its effective date unless the repository contains a factual conflict that must be reported.

The site remains email-based and must continue to state that it does not currently use an embedded form, advertising tracker, or analytics tool.

### Canonical home links

Where the logo or `Return home` link points to `/index.html`, change it to:

```text
/
```

Preserve:

```text
https://sparoahelle.com/privacy.html
```

as the privacy-page canonical URL.

### Contact

Preserve:

```text
privacy@sparoahelle.com
```

### Prohibitions

Do not add claims about:

- form consent;
- age verification;
- email verification;
- database retention;
- automated deletion;
- analytics;
- payments;
- child data;
- legal certification;
- attorney approval.

### Acceptance criteria

- The privacy notice describes the deployed site accurately.
- Home links resolve to the canonical root URL.
- The privacy contact remains functional.
- No unimplemented data practice is described.

---

## WEB-CORR-012 — Metadata and structured data

**Priority:** Critical

### HTML title

Preserve:

```text
Sparoah Elle | Parent-Led Quests for Girls
```

### Open Graph and X/Twitter title

Use the same sentence-case title in both:

```text
Sparoah Elle | Every Quest builds the Queen within
```

Do not title-case `Builds`, `Queen`, or `Within` beyond normal sentence case.

### Description

Use this exact description consistently for:

- `<meta name="description">`
- `og:description`
- `twitter:description`
- Organization or WebSite JSON-LD `description`, when present

```text
Parent-led Quest experiences for girls ages 7–11 that help families explore ideas through conversation, creation, reflection, meaningful action, and service.
```

### Preserve

- Canonical homepage URL:
  `https://sparoahelle.com/`
- `og:url`:
  `https://sparoahelle.com/`
- `og:type`:
  `website`
- `og:site_name`:
  `Sparoah Elle`
- `og:locale`:
  `en_US`
- Existing large social image
- Existing image alternative text, provided it remains accurate
- `twitter:card`:
  `summary_large_image`

### X/Twitter tags

Do not delete explicit X/Twitter tags merely because Open Graph fallback exists. Keep them and align them intentionally.

### JSON-LD

- Inspect all JSON-LD blocks.
- Remove or replace any `confidence` description.
- Preserve valid JSON.
- Do not add Product, Review, Rating, Offer, Event, or Organization-affiliation claims that are not supported.
- Do not add price, availability, customer counts, testimonials, or Good Soil references.

### Acceptance criteria

- No metadata or JSON-LD contains `confidence`.
- Meta, Open Graph, X/Twitter, and structured-data descriptions are intentionally aligned.
- Titles use the approved casing.
- Canonical URLs remain correct.
- JSON-LD parses successfully.

---

## WEB-CORR-013 — Analytics and tracking verification

**Priority:** Critical

Search the repository and deployable output for unapproved tracking, including common patterns such as:

- `googletagmanager`
- `gtag(`
- `google-analytics`
- `GTM-`
- `clarity`
- `plausible`
- `segment`
- `mixpanel`
- `hotjar`
- `facebook pixel`
- `fbq(`
- `cloudflareinsights`
- `beacon.min.js`
- session replay
- advertising pixels

### Requirements

- Do not add analytics.
- Remove unapproved analytics code if it exists in the repository.
- If tracking is injected by the hosting platform and is not represented in the repository, report it as a deployment-environment conflict rather than claiming it was removed.
- Do not change the privacy notice to accommodate analytics under this release.

### Acceptance criteria

- No analytics or advertising-tracking code exists in the deployable repository output.
- The release report clearly distinguishes repository verification from host-level behavior.
- The privacy notice remains factually consistent with the code being shipped.

---

## WEB-CORR-014 — Accessibility and responsive preservation

**Priority:** Critical

Preserve:

- semantic HTML;
- skip link;
- logical heading hierarchy;
- keyboard-operable mobile navigation;
- visible focus indicators;
- Escape-key close behavior;
- outside-click close behavior;
- sticky-header anchor offsets;
- reduced-motion behavior, when present;
- descriptive social-image alternative text;
- existing responsive design system.

### Requirements

- Removed content must not leave broken heading order or empty containers.
- Components changed from numbered to unnumbered must remain understandable to screen readers.
- New microcopy must wrap at 320-pixel width.
- Visible email fallback must have a usable tap target.
- Do not encode meaning through color alone.
- Do not introduce horizontal scrolling.
- Do not hide protective microcopy on mobile.

### Acceptance criteria

- No horizontal overflow at 320, 390, 768, and 1440 pixels.
- Mobile menu remains functional by keyboard and pointer.
- Anchor links expose section headings below the sticky header.
- Tab order remains logical.
- Focus indicators remain visible.
- Heading levels do not skip illogically because of removed chips or added text.
- No browser-console errors are introduced.

---

## WEB-CORR-015 — Documentation and release notes

**Priority:** High

Update `README.md` or the repository's existing release documentation to record:

- date of the correction release;
- files changed;
- the removal of unsupported confidence language;
- `tangible` → `lasting`;
- removal of the duplicate journey presentation;
- de-numbering of planned components;
- CTA label and expectation-setting changes;
- preservation of the email-based workflow;
- confirmation that no form, analytics, payments, child accounts, or child-data collection were added;
- metadata and JSON-LD alignment;
- test results;
- unresolved host-level verification, if any.

Do not rewrite historical handoff files merely to erase the history of earlier decisions.

Place this specification in the repository and identify it as the governing website-correction source.

### Acceptance criteria

- Future contributors can identify why the changed copy differs from older handoff language.
- The old `confidence` and `good idea` wording cannot be silently reintroduced from an advisory document.
- The release notes do not claim production deployment unless deployment actually occurred.

---

## 8. Preserve list

The following must remain unchanged unless another requirement in this specification explicitly changes a related sentence:

- `Sparoah Elle`
- `Every Quest builds the Queen within.`
- `Every girl carries an idea worth exploring.`
- `Not status. Stewardship.`
- `Parent-led Quest experiences for girls ages 7–11`
- The hero Quest definition
- The founding story and quotation
- The current parent-emotional bridge
- `The Power Within`
- `Founding Family Pilot — Now Forming`
- The six canonical Quest steps
- `What your family receives`
- `What your family does together`
- `Designed for connection, not passive consumption.`
- `Childhood should be protected while possibility is expanded.`
- `Children are not handed over to an open-ended AI companion.`
- The minimal-information commitment
- The `on this site` child-account language
- Gregory Douglas as founder
- The temporary `SE` seal
- The absence of a child photograph
- The absence of a form
- The absence of analytics
- The absence of payments
- The absence of customer, revenue, pilot-result, scientific-validation, endorsement, or Good Soil claims
- The absence of `LLC`
- The absence of added religious vocabulary
- `hello@sparoahelle.com`
- `privacy@sparoahelle.com`
- The exact Founding Family `mailto:` subject and body
- The privacy-notice body, except canonical home-link corrections
- `robots.txt`
- `sitemap.xml`
- `favicon.svg`
- `og-image.png`

---

## 9. Explicitly rejected changes

Claude Code must not implement any of the following:

- Replace the `mailto:` path with a form
- Add free text for adults to describe a child
- Add child age, name, school, health, family, image, audio, or video fields
- Remove or soften the explicit AI-companion boundary
- Replace `What your family receives`
- Remove `completion keepsake`
- Remove or anonymize the origin story
- Remove the `SE` seal
- Add a founder photograph
- Widen the current `on this site` child-account language
- Elevate `From "I wonder" to "I made this"` into the hero under this release
- Add explicit faith language
- Add a product mockup that implies a final format
- Add analytics to measure CTA performance
- Add scarcity, countdowns, urgency, exclusivity, or status language
- Add unsupported outcome language
- Add legal, scientific, advisor, customer, partner, or affiliation claims
- Change hosting, DNS, cloud architecture, or deployment resources
- Rewrite the website from scratch

---

## 10. Expected file impact

Claude Code must inspect the repository before assuming these filenames, but the likely changes are:

| File | Expected change |
|---|---|
| `index.html` | Copy, structure, CTA labels, visible email fallback, metadata, JSON-LD |
| `styles.css` | Minimal spacing/layout updates after chip removal, unnumbered component treatment, microcopy wrapping |
| `script.js` | No change expected unless tests reveal a regression |
| `privacy.html` | Change `/index.html` home links to `/`; no body rewrite |
| `README.md` | Release notes and governing-spec reference |
| `robots.txt` | No change expected |
| `sitemap.xml` | No change expected unless URLs are incorrect |
| `staticwebapp.config.json` or host config | No change expected |
| `og-image.png` | No change expected unless it contains superseded copy |
| `spec-website-correction.md` | Add this specification unchanged |

Do not create unnecessary files.

---

## 11. Required tests

Claude Code must run all tests available in the repository and add lightweight tests where reasonable.

### 11.1 Static validation

- HTML parses successfully.
- CSS parses successfully.
- JavaScript parses successfully.
- XML files parse successfully.
- SVG parses successfully.
- JSON-LD parses successfully.
- All referenced local files exist.
- No duplicate IDs.
- No empty `href`.
- No broken in-page anchor.
- Heading hierarchy remains logical.
- `index.html` remains at the deployable root.

### 11.2 Copy and policy assertions

Automated search or assertions must verify:

- No public deployable file contains unsupported `confidence` copy.
- No public deployable file contains `tangible reminder`.
- No public CTA contains `Join the Founding Family List`.
- The exact `mailto:` subject and body remain present.
- `hello@sparoahelle.com` and `privacy@sparoahelle.com` remain correct.
- The adult-only microcopy remains present.
- `Requesting information does not guarantee selection or enroll a child.` is present.
- `reviewed by a person` is present.
- `We market to adults, not to children.` is present.
- No form element is introduced on the homepage.
- No analytics patterns listed in WEB-CORR-013 are present.
- No `LLC`, customer, revenue, testimonial, endorsement, or Good Soil claim is introduced.

### 11.3 Browser rendering

Render and inspect at minimum:

- 1440 × 1000
- 1024 × 768
- 768 × 1024
- 390 × 844
- 320 × 800

Verify:

- hero layout;
- Queen section after chip removal;
- component cards after de-numbering;
- journey section;
- contribution framework;
- founder paragraph;
- Founding Family CTA and visible email;
- privacy page;
- footer.

### 11.4 Interaction

Test:

- skip link;
- desktop navigation;
- mobile menu open;
- mobile menu close;
- Escape close;
- outside-click close;
- navigation-anchor positioning;
- hero CTA to Founding Family section;
- Quest CTA to Founding Family section;
- final `mailto:` recipient;
- final `mailto:` subject;
- final `mailto:` body;
- privacy link;
- return-home link.

### 11.5 Accessibility

Run the available accessibility audit and manually verify:

- keyboard navigation;
- focus visibility;
- logical heading structure;
- link purpose;
- tap-target size;
- contrast;
- screen-reader semantics for component list and journey list;
- no hidden protective microcopy;
- no layout meaning conveyed only by number styling or color.

### 11.6 Production-independent verification

Claude Code may verify repository behavior and local builds. It must not claim that the production site was deployed, host-level analytics are absent, DNS is correct, or HTTPS redirects are correct unless it actually performed and evidenced those checks.

---

## 12. Definition of done

The correction release is complete only when:

1. The site remains recognizably the same Sparoah Elle website.
2. No redesign or framework migration occurred.
3. Unsupported confidence language is gone from visible copy, metadata, and JSON-LD.
4. `tangible` is replaced with `lasting`.
5. `recognize a good idea` is replaced with the approved idea-agency wording.
6. The duplicate six-step chips are removed.
7. Planned components are unnumbered.
8. The family-feedback qualification appears beneath the component heading.
9. The six-step journey appears once and remains intact.
10. The contribution framework consistently uses Idea → Action → Contribution.
11. Human review explicitly says `reviewed by a person`.
12. Direct-marketing copy explicitly says the company markets to adults, not children.
13. Gregory remains the grammatical subject in the founder mission paragraph.
14. The `SE` seal remains in place.
15. No founder or child photograph is added.
16. The CTA uses `Request Founding Family Information` where appropriate.
17. Navigation uses `Founding Family Pilot`.
18. The visible email fallback is present.
19. The exact adult-only `mailto:` subject and body remain intact.
20. The site remains form-free, analytics-free, payment-free, and child-data-free.
21. The privacy notice remains accurate.
22. Metadata and JSON-LD are aligned and valid.
23. Responsive, interaction, accessibility, and static-validation tests pass.
24. Every changed file and every unresolved item is documented.
25. No production deployment is claimed without evidence.

---

## 13. Implementation workflow for Claude Code

### Phase 1 — Preflight

Before editing:

1. Read this specification.
2. Read `README.md`.
3. Inspect every repository file.
4. Locate each current string and structure named in this specification.
5. Produce a short traceability table:
   - requirement;
   - current file and element;
   - planned edit;
   - expected test.
6. Identify only material conflicts between the repository and this specification.

Do not conduct another brand or copy review.

If no material conflict exists, proceed with implementation in the same work session when explicitly instructed to implement.

### Phase 2 — Implementation

- Make one cohesive, minimal change set.
- Preserve unrelated code and copy.
- Remove obsolete CSS only when it is no longer used and removal is safe.
- Do not refactor unrelated JavaScript.
- Do not add dependencies unless absolutely required; none are expected.
- Do not modify production infrastructure.

### Phase 3 — Verification

- Run all required tests.
- Generate desktop and mobile screenshots when tooling permits.
- Review the diff for accidental copy drift.
- Confirm no prohibited functionality or wording was added.

### Phase 4 — Report

Return:

1. Files changed
2. Requirement-to-change traceability
3. Exact copy replacements
4. Structural changes
5. Tests run and evidence
6. Accessibility results
7. Any blocked or unverified item
8. Deployment package path, if created
9. Clear statement that production was or was not deployed

---

## 14. Ready-to-use Claude Code instruction

Use this after adding this file to the repository:

```text
Read `spec-website-correction.md`, `README.md`, and every repository file.

This specification is approved and governs the Sparoah Elle website
correction release. Do not perform another copy review or redesign.

First complete the short preflight and requirement-to-file traceability
defined in Section 13. If the repository contains no material conflict,
implement every in-scope requirement as one minimal, reviewable change set.

Preserve every item in the Preserve List. Do not implement any item in
the Explicitly Rejected Changes section. Do not add a form, analytics,
payments, child data collection, a founder photograph, a child image, or
new infrastructure.

Run all required tests, generate desktop and mobile screenshots when
possible, and report every changed file, test result, unresolved item,
and whether production deployment occurred.

Do not claim a control passed without evidence.
```

---

## 15. Post-release boundary

After this correction release:

- Freeze general website copy.
- Do not commission another full AI website review before documented parent discovery occurs.
- Move the primary business work to:
  1. defining what a Founding Family commits to;
  2. defining the MVP of *The Power Within*;
  3. structured parent discovery;
  4. pilot design and operating readiness.

The adult-only intake form remains a separate future program. Its existence as a specification does not authorize implementation.
