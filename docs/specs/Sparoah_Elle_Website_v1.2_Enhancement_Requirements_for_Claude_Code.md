# Sparoah Elle Website V1.2
## Strategic Clarity, Emotional Connection, Service, and Adult-CTA Enhancement Requirements

**Document status:** Draft for owner review and Claude Code implementation planning  
**Business owner:** Gregory Douglas  
**Target website:** `https://sparoahelle.com/`  
**Baseline:** Live Version 1 / Version 1.1 static website  
**Target release:** Version 1.2  
**Hosting baseline:** Azure Static Web Apps  
**Primary implementation files:** `index.html`, `styles.css`, `script.js`, `privacy.html`, `staticwebapp.config.json`, `README.md`

---

## 1. Purpose

This document converts the approved post-launch website review into implementable requirements for Claude Code.

The purpose of Version 1.2 is to strengthen:

1. Alignment between the website and the approved Sparoah Elle business strategy
2. Immediate understanding of what a Quest is
3. Emotional connection with parents and caregivers
4. The role of service as a defining product principle
5. The connection between the founder’s operating experience and family trust
6. Clarity about the adult next step
7. Continued alignment with the foundational business prayer

This is an enhancement of the live website. It is not a redesign, replatforming effort, or restart of the site.

---

## 2. Authoritative Sources and Decision Order

Claude Code must read the following before proposing or making changes:

1. `Sparoah_Elle_Website_Handoff.md`
2. This requirements document
3. `README.md`
4. Every existing website, configuration, deployment, and test file
5. `Sparoah_Elle_Adult_Only_Intake_Workflow_v1.0.md` only if adult-form implementation is separately and explicitly authorized

When instructions conflict, use this order:

1. Child safety, privacy, and truthfulness requirements in the handoff
2. Approved brand and founder-positioning decisions in the handoff
3. This Version 1.2 requirements document
4. Existing implementation behavior
5. Claude Code recommendations

Claude must identify conflicts rather than silently resolving them.

---

## 3. Foundational Decision Framework

Every recommendation and code change must be evaluated against the business prayer:

> Father, if my business isn't built on your foundation, rebuild. Close every door that looks profitable but leads me away from your purpose. Open the doors you have prepared for me. Connect me with the right people and protect me from the wrong decision. Let my business become a blessing to others.

For implementation purposes, this means:

- **Protection before personalization**
- **Truth before appearance**
- **Stewardship before scale**
- **Service before status**
- **Human relationship before passive technology consumption**
- **Clarity before persuasion**
- **No conversion tactic may weaken child safety, privacy, or truthfulness**

The website does not need to display the prayer or add explicit religious language to satisfy this requirement. Prayer alignment must be demonstrated primarily through decisions and operating boundaries.

---

## 4. Current Baseline to Preserve

The following are approved and must remain unless this document explicitly changes them:

- Public brand name: **Sparoah Elle**
- Tagline: **Every Quest builds the Queen within.**
- Explanation: **Not status. Stewardship.**
- Hero headline: **Every girl carries an idea worth exploring.**
- Audience: parents and caregivers of girls ages 7–11
- First Quest: **The Power Within**
- Quest journey:
  1. Discover
  2. Talk
  3. Create
  4. Reflect
  5. Share
  6. Serve
- Founding Family language: **Founding Family Pilot — Now Forming**
- Parent-led positioning
- Human-reviewed child-facing personalization
- No child account at launch
- No child-facing open-ended chatbot
- No direct marketing to children
- No unsupported educational, psychological, developmental, confidence, healing, or family-outcome claims
- Gregory Douglas as the adult founder and responsible operator
- Premium, elegant, warm, modern visual direction
- No child photograph or child mascot
- Existing charcoal, ivory, muted-gold, plum, and rose design system
- Temporary SE seal
- Canonical domain: `https://sparoahelle.com/`
- Existing mobile navigation and accessibility behavior
- Existing privacy-conscious posture

---

## 5. Scope

### 5.1 In Scope

Version 1.2 includes:

- Plain-language explanation of a Quest
- Parent-centered emotional bridge after the founding story
- Clearer distinction between what a family receives and what a family does
- Stronger presentation of service as a product culmination and strategic differentiator
- A more human bridge between Gregory’s operating background and the responsibility of earning family trust
- Clearer adult next-step language
- Improved CTA behavior and expectation setting
- Conditional replacement of CHEOPS email addresses after Sparoah Elle aliases are confirmed active
- Metadata and privacy-contact consistency where applicable
- Responsive styling required by the added content
- Accessibility, truthfulness, link, and mobile regression testing
- README/release-note updates

### 5.2 Out of Scope

Do not implement any of the following under this requirements document:

- A redesign or new visual identity
- Migration to React, Vue, Angular, Next.js, or another framework
- New package dependencies unless strictly necessary and approved
- A content management system
- E-commerce or payments
- Accounts or authentication
- Child profiles or child data collection
- Child enrollment
- Parental consent for child-data processing
- An adult intake form unless separately authorized under the adult-intake requirements
- Analytics, advertising pixels, session replay, or behavioral tracking
- Third-party embedded forms
- Chatbots or conversational AI
- Testimonials, ratings, reviews, or customer outcomes that do not yet exist
- Good Soil, Wells Fargo, T.D. Jakes, or third-party affiliation claims
- Addition of `LLC` unless the legal entity is confirmed
- Stock photographs of children or families
- AI-generated images presented as the actual product or pilot experience
- An explicit Christian identity statement unless the owner makes a separate public-positioning decision
- A specific physical, printable, digital, subscription, box, or facilitated delivery claim unless the owner confirms it

---

## 6. Critical Business Constraint: Do Not Invent the Product Format

The review identified that visitors may not yet understand whether a Quest is physical, printable, digital, facilitated, subscription-based, or a hybrid.

That gap is real, but the current approved sources do not establish the final delivery format.

Therefore:

- Claude may add a generic plain-language Quest definition supported by the approved components.
- Claude must not describe a Quest as an at-home kit, box, workbook, app, printable, digital portal, live session, subscription, or one-time purchase unless Gregory Douglas supplies and approves that decision.
- Claude must list the unresolved product-format decision in its implementation report.
- The absence of a final format must not be hidden through fabricated specificity.

---

## 7. Functional and Content Requirements

### REQ-001 — Preserve the Existing Site and Make a Narrow Enhancement

**Priority:** Critical

Claude must modify the current site rather than rebuild it.

#### Requirements

- Inspect the entire repository before editing.
- Preserve the current one-page structure.
- Preserve existing section IDs unless a change is necessary and all links are updated.
- Preserve the current visual system and responsive behavior.
- Avoid unnecessary HTML restructuring.
- Avoid adding external libraries for changes that can be achieved with semantic HTML and current CSS.
- Do not remove approved content merely to shorten the page unless explicitly required below.

#### Acceptance criteria

- The site remains recognizably the same Sparoah Elle Version 1 design.
- Existing navigation, footer, privacy page, metadata, favicon, social image, robots file, and sitemap remain functional.
- No framework migration or new runtime is introduced.

---

### REQ-002 — Add a Plain-Language Definition of a Quest

**Priority:** Critical

Visitors must understand the branded term “Quest” without reading the entire page.

#### Required copy

Use this baseline copy unless the owner approves a revision:

> **A Quest is a guided family experience that combines a personalized story, parent-child conversation, a creative challenge, reflection, and an act of service.**

#### Placement

Preferred placement:

- Immediately after the current hero description and before the hero CTA buttons; or
- At the beginning of the `#quest` section before the detailed description of *The Power Within*

Claude must recommend the placement that creates the best hierarchy without overcrowding the hero.

#### Presentation

- It may be styled as a concise definition, note, or supporting paragraph.
- It must not visually compete with the hero headline.
- It must remain readable at 320-pixel mobile width.

#### Prohibited additions

Do not add delivery-format claims such as physical kit, digital portal, printable workbook, live event, subscription, or box.

#### Acceptance criteria

- A first-time visitor can find a one-sentence definition before reaching the detailed six-component list.
- The definition is consistent with the approved Quest components.
- The definition contains no unsupported delivery or outcome claim.

---

### REQ-003 — Add a Parent-Centered Emotional Bridge

**Priority:** High

The current story creates authenticity but moves quickly from Sparoah’s birthday statement to the product. The site must help a parent recognize their own experience and need.

#### Required baseline copy

Add the following after the current final paragraph of the founding-story section:

> **Parents often see the spark—the questions, sketches, plans, and possibilities—but do not always have a clear way to help an idea move forward without taking it over. A Quest gives families an intentional path to listen, encourage, and help one idea take its next meaningful step.**

Claude may recommend minor edits for rhythm or mobile readability, but it must not alter the meaning without owner approval.

#### Presentation

- Use a distinct but restrained visual treatment, such as a highlighted paragraph or pull quote.
- Do not add a child photograph, family stock photograph, or fabricated testimonial.
- Do not imply guaranteed confidence, development, bonding, or transformation.

#### Acceptance criteria

- The section now connects the founding story to the parent’s lived tension.
- The language centers listening and encouragement rather than the adult controlling the child’s idea.
- No testimonial or outcome claim is introduced.

---

### REQ-004 — Distinguish “What the Family Receives” From “What the Family Does”

**Priority:** High

The current site presents two related six-item structures. Visitors must be able to distinguish the planned Quest components from the six-step journey.

#### Requirements

In the *The Power Within* Quest card:

- Add a visible label or heading before the component list:

> **What your family receives**

In the existing journey section:

- Change or supplement the current eyebrow so that it clearly reads:

> **What your family does together**

- The existing heading **Designed for connection, not passive consumption.** may remain.

#### Content preservation

Preserve the six planned components and the six journey steps unless a separate approved copy change is required.

#### Accessibility

- Use proper heading hierarchy.
- Do not add headings solely as styled `<div>` elements.
- Ensure labels are visible, not only screen-reader text.

#### Acceptance criteria

- A visitor can tell at a glance that one list describes included materials/components and the other describes the family journey.
- Heading levels remain logical.
- Mobile spacing does not make the two sections feel visually merged.

---

### REQ-005 — Elevate Service as the Culmination of Every Quest

**Priority:** High

Service is a core strategic and prayer-aligned distinction. It must be more visible than a single item in a six-step list.

#### Required concept

Communicate the movement:

> **Discovery → Action → Contribution**

#### Required baseline copy

Add a concise service callout using this copy or a materially equivalent owner-approved version:

> **From gift to action to contribution.**  
> Every Quest moves from discovery to contribution. The service step invites a girl to use what she discovered or created to encourage, help, or bless someone beyond herself.

#### Placement

Preferred placement:

- Immediately after the six-step journey and before **Our Promise to Families**; or
- As the concluding callout inside the journey section

Claude must select the approach that avoids making the page feel longer than necessary.

#### Presentation

- Use a visually distinct but simple callout, strip, or card.
- Preserve the premium design system.
- Do not add decorative charity imagery or make claims about community impact.

#### Acceptance criteria

- Service is understandable as the culmination of the product philosophy, not merely step six.
- The site does not imply measured social impact or completed service outcomes.
- “Not status. Stewardship.” remains consistent with the new callout.

---

### REQ-006 — Strengthen the Founder-to-Family Trust Bridge

**Priority:** High

The current founder section establishes operating competence. It must also explain why that discipline matters to a family without overstating child-development expertise.

#### Required copy addition

Add this sentence to the end of the existing founder paragraph:

> **For Gregory, that operating discipline serves a deeper responsibility: building something worthy of a child’s trust and a family’s time.**

#### Requirements

- Retain Gregory Douglas’s title and more than 25 years of experience.
- Retain the distinction between enterprise operating expertise and child-development expertise.
- Do not add credentials, advisors, certifications, or consumer-product experience that have not been verified.

#### Acceptance criteria

- The founder section now connects systems discipline to safety, trust, and responsible execution.
- No unsupported professional expertise is added.
- The personal commitment is expressed without oversharing family details.

---

### REQ-007 — Improve the Adult CTA Journey Without Implementing the Intake Form

**Priority:** Critical

The top-level CTA should not unexpectedly launch an email client before the visitor sees the pilot context and adult-only notice.

#### CTA behavior

Unless an approved adult-intake form is already present:

- Change the navigation CTA **Join the Founding Family List** to link to `#founding-families`.
- Change the hero primary CTA **Join the Founding Family List** to link to `#founding-families`.
- Change **Request Founding Family information** in the Quest card to link to `#founding-families`.
- Keep the final CTA in `#founding-families` as the only action that opens the adult-controlled email channel.

If the approved adult-only intake form is already implemented:

- Route the CTAs to the form section.
- Do not change the form, consent language, retention rules, or privacy behavior under this document.

#### Required expectation-setting copy

Add below the Founding Family description or immediately above the final action:

> **Adults can request pilot information and decide later whether participation is right for their family. Joining the list does not guarantee selection or enroll a child. Please provide only your own contact information.**

#### Adult-only warning

Preserve or strengthen the current warning:

> **Adults only. Please do not provide personal information about a child.**

#### Mailto body

If email remains the active contact mode, use a prefilled body substantially equivalent to:

> I am an adult interested in learning more about the Sparoah Elle Founding Family Pilot. I have not included personal information about a child.

Do not include a child-information questionnaire in the email body.

#### Acceptance criteria

- Header, hero, and Quest-section CTAs lead to the contextual Founding Family section rather than opening an email client immediately.
- The final action clearly states that it is for adults.
- The site explains that joining does not guarantee selection or enroll a child.
- No new data collection is introduced.

---

### REQ-008 — Replace CHEOPS Email Addresses Only After Verification

**Priority:** Conditional Critical

Preferred public addresses are:

- `hello@sparoahelle.com`
- `privacy@sparoahelle.com`

However, an unverified branded address is worse than a functioning CHEOPS address.

#### Requirements

Claude must treat the email replacement as a controlled configuration decision.

Before replacing any address, the owner must confirm:

- The mailbox or alias exists
- It receives messages from an unrelated external account
- Replies are monitored by an adult
- The visible reply behavior is acceptable

If confirmation is not provided:

- Keep `gregory.w.douglas@cheopsconsulting.com`
- List the alias migration as an unresolved release dependency

If confirmation is provided:

- Replace general contact links with `hello@sparoahelle.com`
- Replace privacy contact links with `privacy@sparoahelle.com`
- Update `index.html`, `privacy.html`, footer links, and all mailto links consistently
- Update README deployment notes

#### Acceptance criteria

- No dead or untested email link is published.
- General and privacy contacts use the appropriate address when activated.
- No mixed CHEOPS/Sparoah Elle email presentation remains after approved migration.

---

### REQ-009 — Preserve Privacy Accuracy

**Priority:** Critical

The privacy notice must describe actual behavior.

#### Requirements

For the content-only/email-based release:

- Do not state that the site uses a form if it does not.
- Do not state that age verification, consent capture, or database retention exists if it does not.
- Update the privacy contact address only if the alias is active and tested.
- Preserve the statement that adults should not email child personal information.

If an adult-only intake form is activated:

- Stop this scope.
- Apply the separately approved adult-intake workflow and privacy requirements.
- Do not improvise form privacy language from this document.

#### Acceptance criteria

- `privacy.html` accurately describes the deployed contact method.
- No unimplemented privacy control is claimed.
- Contact information is current and functional.

---

### REQ-010 — Preserve Prayer Alignment Without Adding Performative Faith Copy

**Priority:** Critical

#### Requirements

- Do not add the foundational prayer to the public homepage under this release.
- Do not add a Bible verse, Christian badge, or explicit faith claim solely to signal alignment for a pitch competition.
- Preserve stewardship, protection, dignity, service, and truthfulness in the copy.
- Avoid scarcity pressure, countdowns, manipulative urgency, or status-based messaging.
- Do not use “exclusive,” “elite,” “chosen,” or comparable language that conflicts with stewardship positioning.
- Do not portray the child as a marketing asset.

#### Acceptance criteria

- New copy is consistent with protection before personalization, truth before appearance, stewardship before scale, and service before status.
- No faith language is added without a separate approved positioning decision.
- No conversion tactic undermines the child-safety posture.

---

### REQ-011 — Conditional Product Visual Augmentation

**Priority:** Deferred / Optional

A product mockup could improve concreteness and emotional connection, but no approved product visual is included in the current requirements.

#### Requirements

- Inspect the repository for an owner-approved product mockup.
- If no approved asset exists, do not add a placeholder, stock photograph, or invented product rendering.
- Do not use Sparoah’s photograph.
- Do not generate a representation that implies a finalized kit, box, workbook, app, or keepsake design.
- Keep the current six-step orbit and layout if no approved asset exists.

#### Acceptance criteria

- The release does not misrepresent an unfinished product.
- No child image or generic stock-family image is introduced.

---

### REQ-012 — Metadata and Structured-Data Consistency

**Priority:** Medium

#### Requirements

Review and update, only where necessary:

- Page title
- Meta description
- Open Graph description
- X/Twitter description
- Organization JSON-LD description

All metadata must remain consistent with the visible page.

#### Prohibitions

Do not add:

- Product schema with unconfirmed price or availability
- Review or rating schema
- Customer counts
- Event schema for a pilot that has not been scheduled
- Good Soil or partner affiliation metadata

#### Acceptance criteria

- Metadata does not contradict the visible product definition.
- No unsupported product format, traction, outcome, review, or affiliation appears.
- Canonical URLs remain unchanged.

---

### REQ-013 — Accessibility and Mobile Responsiveness

**Priority:** Critical

#### Requirements

- Preserve semantic HTML.
- Preserve the skip link.
- Preserve keyboard-operable mobile navigation.
- Preserve visible focus indicators.
- Preserve Escape-key and outside-click mobile-menu behavior.
- Use logical heading hierarchy for new content.
- Ensure color contrast remains sufficient.
- Ensure added text does not overflow at 320 pixels.
- Ensure sticky-header anchor offsets still expose section headings.
- Avoid motion that does not respect reduced-motion preferences.
- Do not encode meaning only through color.

#### Acceptance criteria

- No horizontal scrolling at 320, 390, 768, 1024, or 1440 pixels.
- All links and controls are keyboard accessible.
- New section headings are announced logically by assistive technology.
- No browser-console errors are introduced.
- Mobile menu regression tests pass.

---

### REQ-014 — Performance and Dependency Discipline

**Priority:** High

#### Requirements

- Do not add a JavaScript framework.
- Do not add a tracking script.
- Do not add a third-party font dependency.
- Do not add a video background.
- Prefer HTML and CSS over new JavaScript.
- Compress any approved new image before deployment.
- Preserve static-host compatibility.

#### Acceptance criteria

- The site remains a lightweight static website.
- No new external runtime request is introduced without approval.
- Existing page functionality works when JavaScript is unavailable, except mobile-menu enhancement behavior.

---

## 8. Proposed Page Flow After Version 1.2

The page should retain this structure:

1. Header and navigation
2. Hero
   - Audience
   - Headline
   - Core description
   - Plain-language Quest definition
   - CTAs
   - Trust line
3. Queen definition
4. Founding story
   - Birthday story
   - Parent-centered emotional bridge
5. First Quest: *The Power Within*
   - Pilot status
   - Product summary
   - **What your family receives**
6. Quest journey
   - **What your family does together**
   - Discover, Talk, Create, Reflect, Share, Serve
7. Service culmination callout
8. Promise to families
9. Founder
   - Operating experience
   - Child-trust/family-time responsibility bridge
10. Founding Family Pilot CTA
   - Pilot description
   - Expectation setting
   - Adult-only warning
   - Final email action or separately approved form
11. Footer

---

## 9. Traceability From Review Findings to Requirements

| Review finding | Requirement |
|---|---|
| “Quest” remains somewhat abstract | REQ-002 |
| Parent’s emotional experience is underrepresented | REQ-003 |
| Two six-item sections can feel repetitive | REQ-004 |
| Service needs more prominence | REQ-005 |
| Founder proves competence more than family relevance | REQ-006 |
| CTA opens email too early and lacks next-step clarity | REQ-007 |
| CHEOPS email weakens brand continuity | REQ-008 |
| Privacy must remain truthful to actual behavior | REQ-009 |
| Prayer alignment should be operational, not performative | REQ-010 |
| Product needs a visual eventually, but no asset is approved | REQ-011 |
| Metadata must remain consistent after copy changes | REQ-012 |
| Live site must remain accessible and responsive | REQ-013 |
| Additional polish must not create unnecessary technical weight | REQ-014 |

---

## 10. Open Owner Decisions

Claude must not guess these decisions.

### DEC-001 — Final Product Delivery Format

Unresolved:

- Physical
- Printable
- Digital
- Facilitated
- Hybrid
- One-time
- Subscription

Version 1.2 may use the generic Quest definition only.

### DEC-002 — Public Sparoah Elle Email Activation

Confirm whether these are active and tested:

- `hello@sparoahelle.com`
- `privacy@sparoahelle.com`

### DEC-003 — Adult Intake Form Timing

This requirements document does not authorize form implementation. Use the separate adult-intake requirements if approved.

### DEC-004 — Product Mockup

No approved product mockup is assumed.

### DEC-005 — Public Faith Positioning

The current site is faith-founded and values-led but not explicitly faith-forward. Do not change this without an owner decision.

### DEC-006 — Audience Validation

Girls ages 7–11 remains the approved pilot assumption. Do not change the range based on preference or general market research alone.

---

## 11. Expected File Changes

### `index.html`

Expected:

- Add Quest definition
- Add parent emotional bridge
- Add visible “What your family receives” label
- Clarify “What your family does together” label
- Add service culmination callout
- Add founder trust sentence
- Change upper CTA links to `#founding-families`
- Add Founding Family expectation-setting copy
- Update email links only if aliases are confirmed
- Review metadata for consistency

### `styles.css`

Expected:

- Add restrained styles for the Quest definition
- Add styles for the parent emotional bridge
- Add styles for the list distinction labels
- Add service callout styles
- Add responsive rules where needed

Do not change the overall palette, type system, or layout architecture.

### `script.js`

No change is expected unless required for accessible focus behavior after anchor navigation. Do not add JavaScript merely for animation or visual novelty.

### `privacy.html`

Expected only if:

- Contact aliases are confirmed; or
- A separately approved intake form is implemented under another scope

### `staticwebapp.config.json`

No change expected. Preserve current security headers unless a documented requirement justifies a modification.

### `README.md`

Update:

- Version number
- Summary of Version 1.2 changes
- Unresolved product-format decision
- Email alias status
- Statement that the adult intake form remains separate unless implemented under its own approved requirements
- Deployment and validation checklist

### Files not expected to change

- `favicon.svg`
- `og-image.png`, unless the visible messaging becomes materially inconsistent and an approved replacement is supplied
- `robots.txt`
- `sitemap.xml`, unless a new public page is added

---

## 12. Claude Code Execution Method

### Phase 1 — Read-Only Assessment

Claude must not edit files in the first pass.

Claude must:

1. Read every repository file.
2. Compare the current site with the handoff and this requirements document.
3. Identify the exact files and elements affected.
4. Confirm whether an adult intake form already exists.
5. Confirm which email addresses are currently hardcoded.
6. Identify any conflict between this document and the current implementation.
7. Produce:
   - Proposed content diff
   - Proposed DOM changes
   - Proposed CSS changes
   - Mobile/accessibility risk assessment
   - Metadata impact
   - Open decisions
   - Test plan
8. Stop for owner approval.

### Phase 2 — Implementation

After approval, Claude must:

1. Make the smallest coherent change set.
2. Preserve exact approved language unless a change is explicitly approved.
3. Keep conditional decisions unresolved in code rather than guessing.
4. Run automated and manual tests.
5. Produce a file-by-file summary.
6. Stop before production deployment unless deployment is separately authorized.

### Phase 3 — Final Review

Claude must conduct a hostile review for:

- Unsupported claims
- Invented product-format details
- Child-data invitations
- Child-facing language
- Status or exclusivity drift
- Manipulative urgency
- Broken CTA behavior
- Email inconsistency
- Privacy-page inconsistency
- Mobile overflow
- Heading-level defects
- Keyboard/focus regressions
- PII or tracking additions
- Metadata contradictions

---

## 13. Test Requirements

### 13.1 Structural Validation

- Validate HTML parsing.
- Validate JSON-LD parsing.
- Validate `staticwebapp.config.json` parsing.
- Confirm all internal links resolve.
- Confirm no duplicate IDs.
- Confirm heading hierarchy.

### 13.2 Responsive Testing

Test at minimum:

- 320 × 800
- 390 × 844
- 768 × 1024
- 1024 × 768
- 1440 × 1000

Verify:

- No horizontal overflow
- No text clipping
- CTA copy wraps cleanly
- Service callout remains readable
- Story bridge does not create an unbalanced column
- Sticky-header anchors remain visible

### 13.3 Interaction Testing

- Header CTA scrolls to `#founding-families`
- Hero CTA scrolls to `#founding-families`
- Quest text link scrolls to `#founding-families`
- Final CTA opens the correct adult-controlled email or approved form
- Mobile menu opens and closes
- Escape closes the mobile menu and returns focus
- Outside click closes the mobile menu
- Navigation closes after selection

### 13.4 Content and Truthfulness Audit

Confirm that the site does not claim:

- Customers
- Revenue
- Completed pilots
- Testimonials
- Proven outcomes
- Scientific validation
- Paid traction
- Repeat purchases
- Good Soil or third-party endorsement
- Finalized product format
- Child-development credentials
- Legal entity status not yet confirmed

### 13.5 Privacy and Child-Safety Audit

Confirm:

- No form was added under this scope
- No child-information field exists
- No analytics or pixels were added
- No child account exists
- No child-facing chatbot exists
- Adult-only warning remains clear
- Privacy notice matches actual behavior
- No child photograph or child mascot was added

### 13.6 Accessibility Testing

At minimum:

- Keyboard-only navigation
- Visible focus
- Skip-link operation
- Mobile-menu screen-reader label state
- Logical headings
- Link-purpose clarity
- Sufficient contrast
- No information conveyed by color alone

If Lighthouse, axe, or another tool is available, Claude may run it, but it must not mark accessibility as fully passed based only on an automated score.

---

## 14. Definition of Done

Version 1.2 is complete only when:

1. The current site has been enhanced rather than rebuilt.
2. A plain-language Quest definition is visible.
3. The parent-centered emotional bridge is present.
4. “What your family receives” and “What your family does together” are clearly distinguished.
5. Service is visibly presented as the culmination of the Quest philosophy.
6. The founder section connects operating discipline to child trust and family time.
7. Upper-page CTAs move visitors to the Founding Family context before launching an email or form.
8. The final CTA clearly states that the action is adult-only, does not guarantee selection, and does not enroll a child.
9. No unverified Sparoah Elle email alias is published.
10. The privacy notice describes actual site behavior.
11. No new child data, tracking, claims, product-format assumptions, or affiliations are introduced.
12. Mobile, keyboard, link, metadata, and console tests pass.
13. README and release notes are updated.
14. Open owner decisions are documented rather than guessed.
15. Claude provides a complete change summary and evidence for each acceptance criterion.

---

## 15. Claude Code Starter Prompt

Use the following prompt with this document in the repository:

```text
You are enhancing the existing live Sparoah Elle static website.

Before making any changes, read:

1. Sparoah_Elle_Website_Handoff.md
2. Sparoah_Elle_Website_v1.2_Enhancement_Requirements_for_Claude_Code.md
3. README.md
4. Every website, configuration, deployment, and test file in the repository

Treat the handoff and Version 1.2 requirements as binding.

Do not rebuild the site, migrate frameworks, invent the Quest delivery format,
add an intake form, add child data collection, add analytics, add child imagery,
or introduce claims unsupported by the source documents.

FIRST PASS: READ ONLY.

Return:

- Current-state assessment
- Requirement-by-requirement gap analysis
- Exact files and elements to change
- Proposed copy diff using the required baseline copy
- Proposed DOM and CSS changes
- Accessibility and mobile risks
- Metadata and privacy impacts
- Open owner decisions
- Test plan mapped to the Definition of Done

Do not edit files during the first pass. Stop after the plan and wait for
explicit approval.
```

---

## 16. Owner Approval Checklist

Before authorizing Claude to implement, Gregory Douglas should confirm:

- [ ] The baseline Quest definition is approved
- [ ] The parent emotional-bridge copy is approved
- [ ] The service callout copy is approved
- [ ] The founder trust sentence is approved
- [ ] The CTA expectation-setting copy is approved
- [ ] The product format remains intentionally unspecified for this release
- [ ] The active general contact email is confirmed
- [ ] The active privacy contact email is confirmed
- [ ] Adult intake remains out of scope or is separately authorized
- [ ] No explicit faith-positioning change is requested
- [ ] No product mockup is required unless an approved asset is supplied

---

## 17. Final Product Principle

The website should leave visitors with this understanding:

> Sparoah Elle creates intentional space for a girl’s ideas without exploiting her childhood, displacing her parent, overstating the company’s impact, or confusing empowerment with status. A Quest helps a family move from discovery to action and from action to contribution.

The site must become clearer and warmer without becoming less truthful, less protective, or more performative.
