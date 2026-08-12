# Adult-Only Intake Workflow — Specification

**Status:** Draft for build. Consent language is DRAFT — PENDING ATTORNEY REVIEW.
**Version:** 1.0
**Date:** 2026-08-11
**Owner:** Gregory Douglas
**Supersedes:** the `mailto:`-only contact approach, once the launch gate in §17 is fully satisfied.

---

## 1. Purpose and scope

Replace the site's `mailto:` calls to action with a secure, adult-only intake workflow that captures
Founding Family pilot interest, records verifiable consent, and deletes the data on a published
schedule.

**In scope for v1:** a single pilot-interest form on a dedicated page, a same-origin submission API,
double opt-in email confirmation, event-driven notification, automated retention and purge,
self-service and manual deletion, and a written pre-pilot human gate.

**Explicitly out of scope for v1:** the investor/partner intake path (designed into the schema in
§6 so it can be added later without plumbing changes), any child-facing functionality, any child
account, and any third-party analytics, CAPTCHA, or form processor.

**Non-goal:** this is not a general contact form. Investors, partners, and press continue to use the
existing `mailto:` link. Business correspondence does not need consent capture or retention
machinery, and folding it in would force a single vague consent statement covering incompatible
purposes — the specific failure this design exists to avoid.

---

## 2. Decision register

Every material decision, with the alternatives that were rejected and why. Revisit this table before
changing anything below it.

| # | Decision | Chosen | Rejected, and why |
|---|---|---|---|
| D1 | Backend | SWA-managed Azure Functions at `/api/*` | Standalone Function App (punctures the `'self'`-only CSP); third-party form service (external processor, contradicts the privacy notice); consent-gated `mailto:` (no consent record, no validation) |
| D2 | Storage | Azure Blob, private container, JSON per submission | Table Storage (no native event-grid extension path); email-only (no audit trail, deletion means hunting a mailbox) |
| D3 | Downstream workflow | Blob event → separate Consumption Function App | Doing notification inline in the intake function (capture then fails when email fails) |
| D4 | Purpose | Pilot / design-partner interest only | General catch-all (cannot write one honest consent statement across marketing, pilots, and business inquiries) |
| D5 | Age gate | Checkbox attestation + recorded consent snapshot | DOB collection (high-value PII, worse privacy posture for a marketing form); third-party ID verification (disproportionate, external processor, per-check cost) |
| D6 | Child data | None collected, actively discouraged; child specifics only in the human conversation under separate consent | Coarse age band (its only value is cohort matching, which one question in the first call answers at zero cost — not worth putting a minor's data in an always-on public pipeline) |
| D7 | Anti-abuse | Layered same-origin defenses | Turnstile/reCAPTCHA (third-party script, CSP exception, privacy-notice rewrite); self-hosted proof-of-work (over-engineering for expected volume — and because it is same-origin it can be added later with no CSP change); platform throttling alone (no bot/human distinction) |
| D8 | Notification transport | Microsoft Graph `sendMail`, app-only, from the notifier Function App | SMTP relay via M365 (Microsoft is permanently disabling Basic Auth client submission in Exchange Online — building on a deprecated foundation); SendGrid (shared-IP reputation, another secret) |
| D9 | Data controller | Sparoah Elle entity, once registered and confirmed active | Cheops Consulting Services, LLC (viable, but user elected to register first); Gregory Douglas individually (personal liability, reads as less credible) |
| D10 | Sequencing | Site ships now unchanged; intake ships behind a flag, flipped at registration | Ship intake under Cheops and migrate (a controller change obliges notifying prior submitters); hold all work (cold start later) |
| D11 | Retention | 12 months | 24 months (harder to justify); 6 months with renewal (loses passive-but-interested people, depends on a renewal job working) |
| D12 | IP handling | Salted, rotating HMAC; TTL = rate-limit window; never in the submission record | Raw IP with submission (durable personal data to disclose, protect, purge, and surrender on request); no IP processing (removes the strongest anti-abuse layer) |
| D13 | Regulatory target | Strictest applicable US state standard, applied uniformly | US + GDPR/UK (significant added surface for a US-only pilot); geo-blocking (imperfect detection, turns away genuine interest) |
| D14 | Failure handling | Full progressive enhancement + idempotency key | JS-required (excludes JS-off and script-blocker users); no idempotency (duplicates on retry and back-button) |
| D15 | Submitter email | Double opt-in; unconfirmed records auto-purge at 7 days | Receipt-only (does not prove address ownership); no email (submitter gets silence and no deletion route) |
| D16 | Deletion mechanism | Self-service tokenized link **and** manual SOP | Manual only — rejected *because* D15 already requires building signed-token machinery, making the self-service link near-free |
| D17 | Access control | Founder-only, RBAC, plus a written pre-pilot gate | Deferring the gate (the gate is the substantive control; deferring leaves "adult-only" as a checkbox with nothing behind it) |
| D18 | Consent approval | Attorney review before the flag flips | Self-approval against a checklist (would make "approved" mean something weaker than it implies) |
| D19 | Placement | Separate `/pilot-interest.html` | Inline section (disclosure competes for space on the pitch page); progressive disclosure (hardest to get right for WCAG AA) |
| D20 | Incident response | Written plan with defined clocks | Minimal statement (improvising under pressure); prevention-only ("we didn't plan for it" is not a defense) |

---

## 3. Inherited constraints

From `CLAUDE.md`. This design does not relax any of them.

- **No third-party scripts, fonts, CDNs, analytics, or pixels.** Everything below is same-origin or
  server-to-server. The browser talks only to `sparoahelle.com`.
- **No inline `style=` or inline `<script>`.** Form styles go in `styles.css`; form behavior goes in
  a new same-origin JS file.
- **No child-facing functionality.** No child account, chatbot, photo, or likeness. §14 operationalizes this.
- **Truthfulness.** The form must not imply customers, revenue, completed pilots, testimonials, or
  outcomes; must not imply endorsement by Good Soil, T.D. Jakes, or Wells Fargo; must not present
  Sparoah as operator or representative; must not guarantee confidence, learning, development,
  healing, or family outcomes. Product components stay labeled **planned**.
- **Brand.** "Sparoah Elle", never hyphenated. Tagline: *Every Quest builds the Queen within.*
  No crowns, pyramids, or mascot. Palette per §15.
- **Accessibility.** WCAG AA maintained; any new color token must be measured, not assumed.

> **CLAUDE.md update required at flag flip.** The line *"No embedded form. Calls to action are
> `mailto:` links by design, until a secure adult-only intake workflow … exists"* becomes untrue the
> day intake goes live. Amend it in the same change that flips the flag, pointing at this spec.

---

## 4. Architecture

```
                    browser (sparoahelle.com/pilot-interest.html)
                                  │
                                  │  same-origin POST — CSP untouched
                                  ▼
                   SWA managed function  POST /api/intake
                   ├─ validate + rate limit + anti-abuse
                   ├─ write blob:  pending/<idempotencyKey>.json
                   └─ 202 Accepted
                                  │
                                  │ Event Grid: BlobCreated
                                  ▼
              Notifier Function App (separate, Consumption)
              ├─ send confirmation email to submitter (Graph)
              └─ (no founder notification until confirmed)
                                  │
        submitter clicks tokenized link → GET /api/intake/confirm
                                  │
                    move pending/… → confirmed/…
                                  │ Event Grid: BlobCreated (confirmed/)
                                  ▼
                   notify founder — a real, confirmed human
                                  │
                    ┌─────────────┴─────────────┐
        Blob lifecycle policy             Timer function
        pending/   delete @ 7d            verify + report drift
        confirmed/ delete @ 365d          (does not own retention)
```

**The load-bearing property:** the browser's only network destination is `sparoahelle.com`.
Every element downstream — Event Grid, the notifier app, Graph, the purge timer — is
server-to-server and invisible to the browser. The workflow can grow arbitrarily elaborate and
`default-src 'self'` never changes.

### 4.1 Platform constraint that shaped this

SWA-managed functions support **HTTP triggers only**. A blob-triggered or timer-triggered function
cannot live in the managed `/api` folder, and "linked backends" (bring-your-own Function App)
require the SWA **Standard** plan, not Free.

This is why the design splits into two deployables rather than one. It is not a workaround — it
produces a better result: the internet-facing function does one small thing, and the privileged
work lives somewhere the public cannot reach.

> **Verify before build** (Azure behavior changes): managed-function trigger support, Free-plan
> function quotas, and whether SWA-managed functions can obtain a managed identity for storage
> access. §8.1 specifies a credential approach that does not depend on the last item resolving
> favorably.

---

## 5. Repository and infrastructure changes

### 5.1 `staticwebapp.config.json` — **the CSP currently blocks this feature**

The live CSP contains `form-action 'none'`. That directive blocks **all** form submissions,
including same-origin. The no-JS HTML `POST` fallback required by D14 would fail silently, with no
console error in some browsers and no server-side trace. This must change:

```diff
- "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'none'; frame-ancestors 'none'"
+ "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'"
```

`'self'` is the correct value, not removal of the directive: omitting `form-action` entirely would
fall back to permitting any destination. No other CSP directive changes. `connect-src` is covered by
`default-src 'self'`, which already permits the `fetch()` to `/api/intake`.

Also add cache and index controls for the new routes:

```json
{ "route": "/api/intake",         "methods": ["POST"] },
{ "route": "/api/intake/confirm", "methods": ["GET"],  "headers": { "cache-control": "no-store", "X-Robots-Tag": "noindex" } },
{ "route": "/api/intake/delete",  "methods": ["GET"],  "headers": { "cache-control": "no-store", "X-Robots-Tag": "noindex" } }
```

### 5.2 New and changed files

| Path | Change |
|---|---|
| `pilot-interest.html` | **New.** The form page (§15). |
| `intake-thanks.html` | **New.** Server-target for the no-JS POST fallback and the confirm/delete landing states. |
| `styles.css` | Form, fieldset, error, and status styles appended. No new color token unless measured (§16). |
| `intake.js` | **New.** Progressive-enhancement submit handler. Same-origin, no dependencies. |
| `staticwebapp.config.json` | CSP `form-action` fix + new routes. |
| `sitemap.xml` | Add `/pilot-interest.html`; bump `lastmod`. Do **not** add confirm/delete endpoints. |
| `privacy.html` | Substantial revision (§12). |
| `index.html` | CTA `href` changes only, at flag flip (§17). Structure and copy unchanged. |
| `404.html` | Unchanged. |
| `api/` | **New.** SWA-managed function source. |
| `CLAUDE.md` | Amend the "No embedded form" constraint at flag flip. |
| `README.md` | Extend the verification checklist with §18. |

### 5.3 Azure resources

| Resource | Purpose | Notes |
|---|---|---|
| Storage account (GPv2, LRS) | Submission blobs | Public access **disabled**; shared key auth **disabled** where possible; TLS 1.2 minimum; soft delete **on**; diagnostic logging **on** (§13 depends on it) |
| Container `intake` | Private, two prefixes: `pending/`, `confirmed/` | No anonymous access, ever |
| Event Grid system topic | BlobCreated → notifier | Filter by prefix so pending and confirmed route differently |
| Function App (Consumption) | Notifier + purge verifier | System-assigned managed identity |
| Azure Key Vault *(optional)* | HMAC salts and signing key | See §8.1 for the non-Key-Vault path |

---

## 6. Data model

One JSON blob per submission.

```
pending/<idempotencyKey>.json      → auto-deleted 7 days after creation
confirmed/<idempotencyKey>.json    → auto-deleted 365 days after confirmation
```

```jsonc
{
  "schemaVersion": 1,
  "purpose": "pilot",              // discriminator — "partner" reserved for a later path (D4)
  "idempotencyKey": "<uuid v4, client-generated at page load>",

  "contact": {
    "name": "string, 1–120 chars",
    "email": "string, RFC-shaped, ≤254 chars",
    "organization": "string, ≤160 chars, optional",
    "message": "string, ≤2000 chars, optional"
  },

  "consent": {
    "adultAttestation": true,       // must be literally true or the request is rejected
    "privacyAcknowledged": true,
    "contactPermission": true,
    "consentVersion": "2026-08-v1",
    "consentTextSha256": "<hex digest of the exact rendered consent text>",
    "consentAtUtc": "2026-08-11T14:03:22.918Z"
  },

  "lifecycle": {
    "state": "pending" | "confirmed",
    "submittedAtUtc": "…",
    "confirmedAtUtc": "…|null",
    "purgeAfterUtc": "…",           // advisory; lifecycle policy is authoritative
    "confirmTokenSha256": "<hex>",  // the token itself is never stored
    "confirmReminderSentAtUtc": "…|null"
  },

  "index": {
    "emailHmac": "<HMAC-SHA256(indexSalt, lowercased trimmed email)>"
  }
}
```

**Deliberately absent:** IP address, user agent, referrer, geolocation, any child field, any DOB,
any identifier that could correlate this record to browsing behavior.

**`consentTextSha256` is the point of the whole record.** Consent text will change over time. Storing
the version *and* a digest of the exact rendered text means that a year later you can prove what a
specific person actually agreed to, not merely which version was nominally current.

**`emailHmac`** is set as a **blob index tag**, making deletion-by-email a tag query rather than a
container scan. It uses a salt distinct from the rate-limit salt in D12, and that salt does **not**
rotate — rotating it would break deletion lookup for existing records. (Blob index tags require a
standard GPv2 account; if unavailable, fall back to a scan, acceptable at this volume.)

---

## 7. API contract

### 7.1 `POST /api/intake`

Accepts `application/json` (JS path) **and** `application/x-www-form-urlencoded` (no-JS path).

Rejection order — cheapest checks first, so abuse costs the server as little as possible:

| # | Check | Response |
|---|---|---|
| 1 | Body ≤ 8 KB | `413` |
| 2 | `Origin`/`Referer` matches `https://sparoahelle.com` | `403` |
| 3 | Honeypot field empty | `202` *(lie — see below)* |
| 4 | ≥ 3s since `formRenderedAt` | `202` *(lie)* |
| 5 | Rate limit not exceeded for `HMAC(rotatingSalt, ip)` | `429` |
| 6 | Schema, lengths, types valid | `400` + field errors |
| 7 | `adultAttestation && privacyAcknowledged && contactPermission` all `true` | `400` |
| 8 | `consentVersion` matches the server's current version | `409` |
| 9 | `pending/<key>.json` does not already exist | `202`, no write |

**Bot checks return `202`, not an error.** Telling a bot precisely which check it failed is free
tuning feedback. Genuine users cannot trip 3 or 4.

**Check 8 matters more than it looks.** If a user loads the page, leaves the tab open for a week,
and submits after you have revised the consent text, they would otherwise be recorded as consenting
to text they never saw. `409` returns a "this page has been updated, please review and resubmit"
state.

Success: `202 Accepted`. JS path receives `{"status":"pending_confirmation"}`; no-JS path receives a
`303` redirect to `/intake-thanks.html?state=pending`.

**The response must be identical whether or not the email address is already on file.** Any
difference turns the endpoint into an oracle for testing whether a given person has signed up.

### 7.2 `GET /api/intake/confirm?t=<token>`

Validates the token (§8.2), finds `pending/<key>.json`, verifies `sha256(token)` matches the stored
digest, sets `state`/`confirmedAtUtc`, writes to `confirmed/<key>.json`, deletes the pending blob.

Idempotent: confirming twice lands on the same success page. Invalid, expired, or already-purged
tokens land on a neutral page — never an error revealing whether the record existed.

### 7.3 `GET /api/intake/delete?t=<token>`

Validates a delete-scoped token, deletes the matching blob from either prefix, writes a deletion
**event** to an audit log (timestamp, `idempotencyKey`, method — **never the contact content**),
lands on a confirmation page. Naturally single-use: after deletion the record is gone. Repeat clicks
show the same neutral confirmation.

---

## 8. Credentials and tokens

### 8.1 Least privilege — the intake function cannot read submissions

The public-facing intake function needs to **create** blobs. It does not need to read, list, or
delete them. Grant it exactly that:

- Intake function: **write/create only**, scoped to the `pending/` prefix. No read, no list, no delete.
- Notifier/purge Function App: read + write + delete, via **system-assigned managed identity** with
  `Storage Blob Data Contributor`. No secret exists.

Consequence: if the internet-facing endpoint is fully compromised, the attacker can write junk
blobs. They cannot enumerate or exfiltrate a single existing submission. This is the highest-value
control in the document, and it costs nothing.

If SWA-managed functions cannot obtain a managed identity, use a narrowly-scoped, write-only,
long-lived SAS or a delegated credential in SWA application settings — **never** the storage account
key, which grants full control.

### 8.2 Token design

Confirmation and deletion links are the only public URLs that mutate data. Requirements:

- **Signed**, HMAC-SHA256 over `{purpose, idempotencyKey, expiryUtc}` with a server-side key.
- **Scoped** — a confirm token cannot delete; a delete token cannot confirm.
- **Expiring** — confirm tokens 7 days (matching the pending lifecycle); delete tokens 30 days,
  reissued on every notification email.
- **Single-use** — confirm tokens are consumed by the state transition; delete tokens by the deletion.
- **High-entropy** — ≥128 bits of randomness, so guessing is infeasible independent of the signature.
- **Stored as a digest only.** Mailbox compromise is a real threat; a stolen link should not also be
  recoverable from your storage account.
- **Compared in constant time.** Byte-by-byte comparison on a signature is a timing oracle.

### 8.3 Salts

| Salt | Rotates? | Why |
|---|---|---|
| Rate-limit IP salt | Yes, on a schedule | Rotation means hashes stop being correlatable across periods — the property that makes D12 genuinely privacy-preserving rather than nominally so |
| Email index salt | **No** | Rotation would orphan every existing record from deletion-by-email lookup |
| Token signing key | On compromise, with overlap | Overlap window prevents invalidating in-flight confirmation links |

---

## 9. Anti-abuse detail

| Layer | Mechanism |
|---|---|
| Honeypot | A real input, visually hidden **via `styles.css`** (never `style=` — CSP), `tabindex="-1"`, `autocomplete="off"`, `aria-hidden="true"`. Named plausibly (`company-website`), not `honeypot`. |
| Time-to-submit | Server-signed `formRenderedAt` issued with the page; reject if <3s. Must be signed, or a bot simply backdates it. |
| Rate limit | Per rotating IP-HMAC, per hour. Table Storage or in-memory with the understood limitation that in-memory resets on cold start. |
| Payload cap | 8 KB, enforced before parsing. |
| Origin check | `Origin`/`Referer` must match the canonical origin. |
| Strict validation | Allow-list of fields; unknown fields rejected, not ignored. Lengths per §6. |
| Double opt-in | Structurally the strongest layer: a bot that cannot receive mail at the submitted address never becomes a confirmed record, and its pending blob evaporates in 7 days. |

Proof-of-work (D7) can be added later with **no CSP change** because it would be self-hosted. Nothing
here forecloses it.

---

## 10. Consent language — DRAFT, PENDING ATTORNEY REVIEW

> **This text is not approved.** It must not ship until an attorney has reviewed it and the gate in
> §17 is satisfied. The version identifier below is provisional and changes on any wording change,
> however small.

**`consentVersion: 2026-08-v1`**

### 10.1 Rendered on the page, above the checkboxes

> **Who this is for.** The Founding Family list is for parents and caregivers who are 18 or older.
> Sparoah Elle is in development. There is no product to buy, no account to create, and no child
> participation of any kind at this stage.

> **Please don't tell us about your child yet.** We don't need your child's name, age, school,
> health information, photo, or anything else about them, and we don't want to store it. If a pilot
> moves forward, we'll talk with you directly and ask for anything relevant then, in writing, with
> your separate permission.

### 10.2 The three checkboxes — each unchecked by default, each required

Separate boxes, not one bundled box. Bundling attestation, acknowledgement, and contact permission
into a single checkbox makes each one weaker, because the person's agreement to any one of them is
unprovable.

1. `[ ]` **I am 18 years of age or older.**
2. `[ ]` **I have read the [Privacy Notice](privacy.html)** and understand how my information will be
   used and how long it will be kept.
3. `[ ]` **You may email me** about the Founding Family pilot. I can ask you to delete my information
   at any time, using the link in any email you send me or by emailing privacy@sparoahelle.com.

### 10.3 Plain-language summary, rendered adjacent to the form

> **What happens with what you send us**
>
> - **What we collect:** your name, email address, optionally your organization, and anything you
>   choose to write in the message box.
> - **Why:** so we can contact you about the Founding Family pilot. Nothing else.
> - **Who sees it:** Gregory Douglas. We don't sell your information, and we don't share it for
>   advertising.
> - **How long we keep it:** up to 12 months from the day you confirm, then it's deleted
>   automatically.
> - **Confirming:** we'll email you a link. If you don't click it within 7 days, we delete what you
>   sent and you'll hear nothing further from us.
> - **Deleting:** every email we send you has a one-click deletion link. You can also email
>   privacy@sparoahelle.com and we'll respond within 30 days.

### 10.4 Truthfulness review of the above

Checked against `CLAUDE.md`: no customers, revenue, pilots, testimonials, or outcomes claimed; no
endorsement implied; Sparoah is not presented as operator or representative; no legal suffix on
"Sparoah Elle" (pending D9 registration — **the final legal name must be inserted before launch**);
no guarantee of confidence, learning, development, healing, or family outcomes; the product is
described as *in development*; no AI claim of any kind appears in intake copy.

### 10.5 For the attorney

Specific questions worth putting in front of counsel rather than leaving to the reviewer to find:

1. Is attestation-only age gating (D5) defensible for this data set and audience, given the product
   is intended for families with minors?
2. Does the child-data discouragement notice (§10.1) adequately address the possibility that an adult
   volunteers a minor's details in free text anyway — and what is the obligation when they do?
3. Is 12 months (D11) consistent with the stated purpose under the strictest applicable US state
   standard?
4. Does the plain-language summary satisfy notice-at-collection requirements, or must the full
   privacy notice be presented at the point of collection?
5. Is a 30-day response window appropriate for all applicable states?
6. Is the pre-pilot gate (§14) sufficient documentation of adult verification before any activity
   involving a child?

---

## 11. Retention and purge

**Stated retention: 12 months from confirmation.** Once published, this binds you.

Retention is enforced **declaratively**, by prefix, so it survives a code bug:

| Prefix | Lifecycle rule | Meaning |
|---|---|---|
| `pending/` | Delete 7 days after creation | Unconfirmed submissions self-destruct |
| `confirmed/` | Delete 365 days after creation | Blob creation time = confirmation time (§7.2 writes a new blob), so the clock starts at confirmation |

**The prefix design is what makes two different retention clocks possible without writing a purge
job.** Confirmation moves the record between prefixes, which resets creation time — a side effect
here used deliberately.

The timer function does **not** own retention. It verifies: counts blobs past their `purgeAfterUtc`,
reports drift, and alerts if lifecycle rules appear disabled. Retention that depends on code running
correctly is retention that eventually stops happening quietly.

**Reminder job:** at 72 hours, pending records with a null `confirmReminderSentAtUtc` get one
reminder email, then the field is stamped. Exactly one reminder — a second is unsolicited mail to
someone who has not confirmed they want to hear from you.

**Soft delete caveat:** blob soft delete retains deleted content for its configured window. Set that
window short (7 days) and disclose the practical effect, or "deleted" means "deleted in 7 more days"
and the privacy notice is inaccurate.

### 11.1 Mailbox retention must match — the second copy problem

Storage is not the only place submission data lives. Every notification and confirmation email
puts a **second copy** of the same contact data into a mailbox, and mailboxes do not expire by
default. Left alone, this makes the published retention promise false: at month 13 the blob is gone
and the email is not.

Retention is therefore enforced in **two** places, both declaratively:

| Copy | Mechanism | Window |
|---|---|---|
| Submission record | Blob lifecycle policy | 7d pending / 365d confirmed |
| Notification + confirmation email | **Exchange Online retention policy on the shared mailboxes** | 12 months, matching `confirmed/` |

Apply the policy to both mailboxes in §11.2. A retention policy closes this the same way the
lifecycle rule closes storage — without depending on anyone remembering to clean out a mailbox.

### 11.2 Contact mailboxes

Two Microsoft 365 **shared** mailboxes (no license required at this scale):

| Address | Display name | Role |
|---|---|---|
| `hello@sparoahelle.com` | `Sparoah Elle` | Public CTA; **From** address for confirmation and reminder email |
| `privacy@sparoahelle.com` | `Sparoah Elle Privacy` | Privacy notice contact; deletion requests; breach notification (§13) |

Naming rules, which are truthfulness constraints and not style preferences:

- **No "Team", "Office", "Support", or "Data Protection Officer".** One person operates both. Naming
  a department that does not exist is a false statement in the From line of a deletion confirmation —
  the precise place a person is being asked to trust the company about data handling. "Data
  Protection Officer" additionally claims a GDPR role deliberately scoped out by D13.
- **No legal suffix**, before or after registration. The legal name belongs in the privacy notice and
  the email footer, not the From line.
- `hello@` carries the brand alone because its display name is the entire trust impression at the
  moment a parent decides whether to open the confirmation email.

**Grant Send As, not Send on Behalf.** Send on Behalf renders as *"Gregory Douglas on behalf of
Sparoah Elle"* in the recipient's client — confusing on a confirmation email, and indistinguishable
from a spoof to a cautious reader.

These two mailboxes are also the concrete targets for the Exchange **Application Access Policy** that
scopes the Graph `Mail.Send` permission (§8.1, §17). Without naming them, that permission is
tenant-wide.

---

## 12. Privacy notice changes

`privacy.html` currently states the site *"does not currently use an embedded contact form"* and that
the notice *"will be updated before the website adds purchasing, waitlist forms, …"*. That update is
now due. Revisions required:

| Section | Change |
|---|---|
| Effective date | New date; note that it changed |
| About this notice | Remove "does not currently use an embedded contact form" |
| **Controller** *(new)* | Name the registered entity (D9) and its relationship to Sparoah Elle |
| Information we receive | Add the form: name, email, optional organization, optional message, consent record with timestamp. State explicitly that IP is processed transiently for abuse prevention, in hashed form, and is **not** stored with submissions |
| Children's information | Keep, and strengthen: the form does not request child information and adults are asked not to provide it |
| How information is used | Add: confirming the address, contacting about the pilot, security |
| **Retention** *(new)* | 12 months from confirmation; 7 days for unconfirmed; soft-delete window disclosed; state that the same window applies to **email copies held in the contact mailboxes** (§11.1) |
| **Your choices** *(new)* | Access and deletion, the self-service link, the 30-day window, `privacy@sparoahelle.com` |
| **Security** *(new)* | Encryption in transit and at rest, restricted access, no public container |
| Sharing | Keep "we do not sell"; add Microsoft/Azure as processor for hosting and email |
| Contact | `privacy@sparoahelle.com` |

---

## 13. Incident response

Prevention is in §5.3 and §8.1. This is what happens when prevention fails. **Clocks start at
discovery, not at breach.**

| Window | Actions |
|---|---|
| **0–24h** | Contain: revoke credentials, rotate token signing key, disable public access, take the endpoint down if it is the vector. **Preserve diagnostic logs before they roll.** Record the discovery timestamp — it starts every other clock. |
| **24–72h** | Assess scope from storage diagnostic logs: which blobs were accessed, by whom, when. Determine whether contact data was actually read or merely exposed. |
| **≤30 days** | Notify affected individuals in plain language: what happened, what data, what you have done, what they can do. Notify state regulators where thresholds require it. Counsel confirms which apply. |
| **Ongoing** | Written post-incident record: cause, timeline, remediation, prevention. |

**Prerequisite that is easy to skip:** storage diagnostic logging must be **on before an incident**,
with a retention period longer than your likely time-to-discovery. Without it, scope assessment is
guesswork, and "we cannot determine who was affected" generally forces you to notify everyone.

---

## 14. Access control and the pre-pilot gate

### 14.1 Access

- Container access via **Azure RBAC, founder identity only**. Public access disabled. Shared key auth
  disabled where the platform permits. TLS 1.2 minimum.
- Notification emails go to one mailbox, controlled by the founder.
- Adding any reader is a disclosure change: the privacy notice must be updated, and an offboarding
  step added to the runbook.

### 14.2 The pre-pilot gate — what makes "adult-only" real

The checkbox is a good-faith signal at the web tier. It is not verification. Verification happens
here, and **no activity involving a child begins until every item is complete and documented**:

1. **Adult identity verified** by a human, in a scheduled conversation, outside the web form.
2. **Separate written consent** obtained for any activity involving a child — the intake consent
   does not cover it and must never be treated as covering it.
3. **No child-facing contact.** The child does not receive an account, a login, a chatbot, a message,
   or any direct product interaction. Consistent with `CLAUDE.md`.
4. **Documented before, not after.** Date, participants, what was verified, what was consented to.
5. **Withdrawal is honored immediately**, at any point, without explanation.

This gate is the substantive control in the entire document. The technical measures protect data;
this protects a child.

---

## 15. Front-end specification

### 15.1 Page

`/pilot-interest.html`. Reuses the existing header, footer, `.shell`, `.button`, and `.eyebrow`
patterns so it reads as the same site. `index.html` is not restructured — only CTA `href`s change,
and only at flag flip.

Order on the page: what this is and who it is for → the child-data notice (§10.1) → the form →
consent checkboxes → the plain-language summary (§10.3). The summary sits beside or immediately
below the form, never behind a disclosure toggle: a person deciding whether to submit should not
have to click to find out what happens to their data.

### 15.2 Form markup

```
<form method="post" action="/api/intake" novalidate>
  hidden: idempotencyKey (uuid, generated at render)
  hidden: formRenderedAt (server-signed)
  hidden: consentVersion
  hidden: company-website     ← honeypot, hidden in styles.css

  Your name            required  text     autocomplete="name"
  Email address        required  email    autocomplete="email"
  Organization         optional  text
  What draws you       optional  textarea maxlength=2000
    → child-data warning rendered immediately above this field

  [ ] 18 or older                required
  [ ] Read the Privacy Notice    required
  [ ] You may email me           required

  [ Join the Founding Family list ]
</form>
```

`method="post"` and a real `action` are what make the no-JS path work — and what the CSP fix in §5.1
unblocks.

### 15.3 Progressive enhancement

- **No JS:** native POST → `303` → `/intake-thanks.html?state=pending`. Fully functional.
- **With JS:** `intake.js` intercepts `submit`, `fetch()`es the same endpoint as JSON, disables the
  button, renders inline status. On network failure it does **not** silently swallow the error —
  it offers a retry, and because the idempotency key is stable for the page load, a retry cannot
  create a duplicate.
- The idempotency key is generated **once per page load**, not per submit. Generating per submit
  would defeat its purpose.

### 15.4 Accessibility — WCAG AA

- Every input has a real `<label>`; the checkbox group is a `<fieldset>` with `<legend>`.
- Errors: inline, adjacent to the field, `aria-describedby`-linked, `aria-invalid="true"`, plus a
  summary in an `aria-live="polite"` region. Focus moves to the first invalid field on failed submit.
- Errors are never conveyed by color alone — text and an icon accompany every one.
- Async status announced via `aria-live`; the submit button's disabled state is not the only feedback.
- Touch targets ≥44×44px, including checkboxes, whose default hit area is too small.
- Keyboard path complete; visible focus via the existing `:focus-visible` rule.
- The honeypot is `aria-hidden="true"` and `tabindex="-1"` so no screen-reader or keyboard user can
  ever reach it and be silently rejected.

### 15.5 Color

Reuse existing tokens: `--ink`, `--ink-soft`, `--ivory`, `--paper`, `--sand`, `--gold-deep`, `--line`.

An error state needs a red not currently in the palette. Per `CLAUDE.md` — where `--gold-deep`
was corrected to `#85602c` after `#8f692f` measured 4.16:1 — **any new token must be measured, not
assumed.** Proposed `--error: #8a2b2b`; verify ≥4.5:1 against `--paper` (`#fffdf9`), `--ivory`
(`#fbf7ef`), and `--sand` (`#efe5d8`) before use, and record the measured ratios in `README.md`.
`--plum` (`#6d3546`) is a candidate if it measures adequately, and would avoid a new token entirely.

---

## 16. Threat model summary

| Threat | Mitigation | Residual |
|---|---|---|
| Bot spam | §9 layers; double opt-in structurally | Targeted attacker gets junk into pending; auto-purges in 7d |
| Minor submits the form | Attestation + §14 gate before any child-involving activity | Cannot be eliminated at the web tier |
| Third-party signs someone else up | Double opt-in — unconfirmed records never become real | Victim receives one confirmation email |
| Endpoint compromised | Write-only credential (§8.1) | Attacker writes junk; cannot read or enumerate |
| Storage compromised | RBAC, no public access, no shared keys, encryption, logging | §13 |
| Stolen confirmation link | High entropy, expiring, single-use, digest-only storage | Mailbox compromise remains out of scope |
| Enumeration of who signed up | Identical responses regardless of prior submission (§7.1) | — |
| Retention silently stops | Declarative lifecycle policy, not code; timer verifies | — |
| Consent text drifts from record | `consentTextSha256` + version mismatch → `409` | — |

---

## 17. Launch gate

Intake ships **disabled**. Every item must be true before the flag flips.

**Legal and organizational**
- [ ] Sparoah Elle entity registered and **confirmed active** (D9)
- [ ] Final legal name inserted into consent text and privacy notice
- [ ] **Attorney has reviewed and approved the consent language** (D18, §10.5)
- [ ] Shared mailboxes live with the display names in §11.2 — `Sparoah Elle` and `Sparoah Elle Privacy`
- [ ] **Exchange retention policy applied to both mailboxes at 12 months** — without it the published
      retention promise is false the moment the first blob expires (§11.1)
- [ ] Deletion runbook written and rehearsed once end-to-end

**Technical**
- [ ] CSP `form-action` changed to `'self'` and verified (§5.1) — *the form silently fails without this*
- [ ] Intake function credential is **write-only**; verified it cannot list or read (§8.1)
- [ ] Container public access disabled; shared key auth disabled; TLS 1.2 min
- [ ] Storage diagnostic logging **on**, retention set (§13 depends on it)
- [ ] Lifecycle rules active on both prefixes; verified with a test blob
- [ ] Soft-delete window set to 7 days and reflected in the notice
- [ ] Graph `Mail.Send` granted to the managed identity **and scoped by an Exchange Application
      Access Policy to the two mailboxes in §11.2** — without this, the app can send as any user in
      the tenant
- [ ] **Send As** granted on both mailboxes (not Send on Behalf — §11.2)
- [ ] SPF, DKIM, **and DMARC** aligned for `sparoahelle.com` in Azure DNS
- [ ] Token signing key and both salts provisioned; rotation documented

**Verification**
- [ ] §18 passed in full
- [ ] `README.md` checklist run
- [ ] No new external network requests (DevTools, throttled, hard reload)
- [ ] Contrast measured for any new token (§15.5)

**Content**
- [ ] `privacy.html` revised per §12
- [ ] `index.html` CTAs point to `/pilot-interest.html`
- [ ] `sitemap.xml` updated, `lastmod` bumped
- [ ] `CLAUDE.md` "No embedded form" constraint amended
- [ ] Copy re-read against §3 truthfulness constraints

---

## 18. Test plan

**Functional**
1. Happy path: submit → pending blob → confirmation email → click → confirmed blob → founder notified.
2. No-JS: JS disabled, submit succeeds, lands on the thanks page. *Run this against the deployed CSP,
   not locally* — §5.1 is exactly the kind of failure that only appears in production.
3. Double-click submit → one blob.
4. Network failure mid-submit → retry → one blob.
5. Confirm twice → idempotent, no error.
6. Never confirm → blob gone within 7 days (lifecycle timing verified, not assumed).
7. Delete link → record gone; second click → same neutral page.
8. Expired confirm token → neutral page, no information disclosed.
9. Tampered token → rejected.
10. Stale `consentVersion` → `409` and a re-review prompt.

**Security**
11. Honeypot filled → `202`, no blob.
12. Submit <3s → `202`, no blob.
13. Backdated `formRenderedAt` → rejected (signature check).
14. Rate limit exceeded → `429`.
15. Cross-origin POST → `403`.
16. 9 KB body → `413`.
17. Any consent box false → `400`, no blob.
18. Unknown field → `400`.
19. **Intake function attempts to list the container → denied.** The single most important test here.
20. Direct blob URL unauthenticated → denied.
21. Submitting an already-submitted email → response byte-identical to a new one.

**Privacy**
22. Inspect a stored blob: no IP, no user agent, no referrer, no child field.
23. Inspect the notification email: no raw token, no IP.
24. Deletion audit log: event recorded, contact content absent.
25. Retention policy confirmed applied to both mailboxes, window matches the published figure (§11.1).

**Accessibility**
26. Keyboard-only completion.
27. Screen reader: labels, fieldset/legend, error announcement, status announcement.
28. Failed submit moves focus to the first invalid field.
29. 200% zoom, 320px viewport — no horizontal scroll.
30. Contrast measured for every new color.

**Deliverability**
31. Confirmation email to Gmail, Outlook, Yahoo, iCloud — inbox, not spam. Verify SPF/DKIM/DMARC pass
    in raw headers.
32. Confirmation email renders as **`Sparoah Elle`**, not "… on behalf of …" — verifies Send As
    rather than Send on Behalf (§11.2).

---

## 19. Open items

| # | Item | Owner | Blocks |
|---|---|---|---|
| O1 | Entity registration and confirmed-active status | Founder | Everything (D9, D10) |
| O2 | Attorney review of §10 | Founder + counsel | Flag flip |
| O3 | Confirm SWA-managed-function trigger support and Free-plan quotas against current Azure docs | Build | Architecture (§4.1) |
| O4 | Confirm whether SWA-managed functions can obtain a managed identity; if not, apply the §8.1 fallback | Build | Credential design |
| O5 | Measure `--error` contrast; record ratios | Build | Styling (§15.5) |
| O6 | Decide rate-limit store: Table vs in-memory (cold-start reset) | Build | §9 |
| O7 | Confirm blob index tags available on the chosen account tier | Build | §6 deletion lookup |
| O8 | Set soft-delete window and reflect it in the notice | Build | §11, §12 |

---

## 20. Deferred by design

Each of these can be added later **without changing the CSP, the privacy posture, or the browser's
network surface** — which is the property the architecture in §4 exists to preserve.

- **Investor/partner path.** The `purpose` discriminator is in the schema from day one (D4); adding
  it means new consent text and a second form, not new plumbing.
- **Self-hosted proof-of-work** (D7), if commodity bots defeat §9.
- **CRM or pipeline integration**, as a new Event Grid subscriber — the extension path that motivated
  choosing Blob over Table (D2).
- **Richer notification** (digest, Teams) as additional subscribers.
- **Stronger age verification**, if a pilot's risk profile ever justifies the cost and the additional
  data collection.
