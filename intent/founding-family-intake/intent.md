---
id: founding-family-intake
title: An adult can register Founding Family pilot interest, and we can prove what they agreed to
originator: Gregory Douglas
created: 2026-09-23
status: draft
source: idea
policy_owners: [Gregory Douglas, Derrick Deyon]
---

# An adult can register Founding Family pilot interest, and we can prove what they agreed to

## Problem

The only way to express interest in the Founding Family Pilot is to click a
`mailto:` link and compose an email. That costs us three things.

**We cannot show what anyone agreed to.** An email arrives with no record of what
the sender was shown, what they consented to, or when. For a pre-launch product
aimed at families with young girls, the consent record is the part that has to
exist, and today it does not.

**We do not know when the route fails.** A `mailto:` link does nothing visible on
a device with no registered mail handler. The visitor sees a dead click, and we
never learn it happened. A visible address was added beneath the button for
exactly this reason, but recovering from a dead click still depends on the
visitor choosing to copy an address and start again in another application.

**There is nowhere to work what arrives.** Enquiries land in a shared mailbox
alongside everything else. There is no reliable way to see who enquired, what
stage each conversation is at, or what was said, and no way to answer "delete
everything you hold about me" except by searching a mailbox by hand.

This is written from the position of a pre-revenue company with no completed
pilots, one person operating it, and a published promise that the site collects
nothing and tracks nobody. Any fix has to stay inside that promise.

## Affected users and systems

**Adults considering the pilot.** Parents and caregivers who reach the Founding
Family section and want to know more. Today they compose an email, or they hit a
dead `mailto:` and leave. Nothing tells them what happens next, and nothing gives
them a way to withdraw later.

**Gregory Douglas, as sole operator.** Receives, triages, answers and retains
every enquiry by hand, and would personally have to honour a deletion request by
searching a mailbox.

**The two shared mailboxes,** `hello@sparoahelle.com` and
`privacy@sparoahelle.com`. They are the current intake and the current system of
record. They remain the fallback route and the privacy contact, so anything built
alongside them has to keep their retention consistent with whatever the new route
promises — a promise enforced in one place and not the other is not a promise.

**The published privacy notice.** It states the site "does not currently use an
embedded contact form, advertising tracker, or analytics tool". That sentence
becomes false the moment this goes live. It is counsel-approved text and is
pinned by an automated assertion, so it cannot drift quietly.

**The automated guards.** The build fails on any form control, on any external
origin, and on copy implying enrollment or selection. They encode decisions that
are still correct; they will need a deliberate, reviewed change rather than
suppression.

**Not consulted, and would notice:** anyone who already emailed `hello@` under
today's terms. They agreed to nothing, because there was nothing to agree to. If
the entity that holds their message changes, that is a notification obligation.

## Proposed outcome

An adult who wants to be considered for the Founding Family Pilot can say so
directly on the site, in one pass, without leaving it or opening another
application.

At the moment they do, these are all true:

- They have been shown, in plain language, what is collected, why, how long it is
  kept, and how to have it removed — before they act, not after.
- They have affirmed they are an adult, and that affirmation is recorded as part
  of what they agreed to.
- What they agreed to is captured as evidence that can be produced later, tied to
  the exact wording they were shown.
- Nothing they were shown implies they have joined anything, secured a place, or
  entered a queue. They have asked to be told more, and that is all.
- Nothing asked them for information about a child, and nothing invited it.

After that moment:

- Their address is confirmed to be theirs before it is treated as a real enquiry
  or used to contact them again.
- They can have everything we hold about them removed, without needing to reach a
  person to do it.
- What they submitted survives even when nobody is notified of it. A failure to
  alert the operator delays a reply; it never loses the person.
- What they submitted is removed on a published schedule without anyone
  remembering to do it.

And for the operator: every enquiry is visible in one place, with its state and
its history, rather than being reconstructed from a mailbox.

## Out of scope

- **Investor, partner and press contact.** These keep using the existing
  `mailto:` route. One consent statement cannot honestly cover business
  correspondence and pilot interest at once.
- **A general mailing list or newsletter.** Addresses are for talking to that
  adult about the pilot. Anything broader is a different purpose needing its own
  consent and its own intent.
- **Any child-facing capability**, any child account, and any collection of
  information about a child.
- **Analytics or behavioural measurement** of any kind, including measuring how
  many people begin and abandon the flow. See *How we would know it worked*.
- **Retiring the `mailto:` route.** It stays as the fallback when the primary
  route fails or is blocked, and remains the privacy contact.
- **Where the thing physically lives on the site.** Deliberately left to Design.
  The outcome it must serve is that the required disclosure is readable and not
  competing for attention with the pitch.

## Constraints

- **Nothing may be collected until a registered legal entity exists to be
  accountable for it** — fixed by Gregory Douglas (adult-intake.md D9/D10),
  because changing the controller after the fact obliges notifying everyone who
  already submitted. Work may be built; it may not be switched on.
- **Consent language must be approved by counsel before anything goes live** —
  fixed by Gregory Douglas (adult-intake.md D18), owner Derrick Deyon. Self-
  approval would make "approved" mean less than it implies.
- **Nothing may go live before the data it creates can be stored, expired,
  purged, deleted on request, and worked** — fixed by Gregory Douglas, this
  interview. A retention promise that nothing enforces is a false statement.
- **No third-party script, processor, CDN, font, or external origin** — fixed by
  CLAUDE.md and the published privacy notice, because the site's claim to load
  nothing external is enforced by its content-security policy and by the build.
- **The browser may talk only to `sparoahelle.com`** — fixed by the same policy.
  Submission must be same-origin. This is the one technical fact that constrains
  the shape of the solution rather than merely its wording.
- **No information about a child may be collected, and none may be invited** —
  fixed by CLAUDE.md and the approved privacy notice.
- **Only an email address and the required consents are collected** — fixed by
  Gregory Douglas, this interview, narrowing adult-intake.md §15.2. Least data
  held is the smallest breach, disclosure and deletion surface; who someone is
  can be learned in the first reply.
- **An address is not trusted until its owner confirms it** — fixed by Gregory
  Douglas (adult-intake.md D15), because a mistyped address otherwise means a
  stranger receives mail about a children's product.
- **No copy may imply enrollment, selection, membership or a guarantee** — fixed
  by spec-website-correction.md, which removed the CTA "Join the Founding Family
  List" and rewrote "Joining the list does not guarantee selection" to
  "Requesting information does not guarantee selection". The build fails on that
  string today.
- **WCAG AA is maintained, and any new colour is measured rather than assumed** —
  fixed by CLAUDE.md.
- **The working route must degrade to something usable when scripting is
  unavailable** — fixed by adult-intake.md D14, because excluding people who
  block scripts contradicts the site's own privacy posture.

## How we would know it worked

Countable without any tracking, from what reaches us server-side:

- **Every enquiry that arrives has a consent record attached to it**, naming the
  exact wording that person was shown. Checkable by inspection, which matters
  when volume is near zero. Today this number is zero out of all of them.
- **Enquiries arrive and are answered.** Submissions received, submissions
  confirmed by their owner, and replies sent — three numbers that can be compared
  without observing anyone's browsing.
- **Nothing arrives that we did not ask for.** Specifically, no unprompted
  information about a child. Checkable by reading what comes in.
- **A deletion request can be honoured end to end**, by the person themselves,
  and demonstrated on request.

Explicitly **not** measurable, and not to be proved by Test: whether more people
*begin* an enquiry than do today. Knowing that would require observing visitors
who never submit, which needs analytics the site will not carry. There is also no
baseline, because clicks on the current `mailto:` were never counted. Recorded
here as a direction of travel, assessed by judgement, not as a metric.

## Flagged concerns

- **The consent language has not been reviewed, and a recent review may be
  mistaken for its approval.** Counsel approved the children's-privacy section of
  the privacy notice on 2026-09-22. That is a different text from the form's
  consent wording, which remains marked *DRAFT — PENDING ATTORNEY REVIEW* in
  adult-intake.md §10. Treating the first as covering the second would put
  unreviewed consent text in front of parents — owner: Derrick Deyon.
- **Going live makes a counsel-approved published statement false.** The privacy
  notice says the site uses no embedded contact form. Revising it is part of this
  change, not a follow-up, and it needs the same review the rest of the notice
  got — owner: Derrick Deyon.
- **The existing specification contradicts the live copy guard.** adult-intake.md
  §15.2 names the submit control "Join the Founding Family list", written
  2026-08-11, before that exact phrasing was banned on 2026-08-23 for implying an
  enrollment that does not exist. The spec must follow this intent, not the
  reverse — owner: Gregory Douglas.
- **Retention has to hold in two places at once.** Anything promised about how
  long data is kept is false if a second copy sits in a mailbox under a different
  policy — owner: Gregory Douglas.
- **One person is originator, approver and operator.** Every decision here is
  self-reviewed apart from the two owned by counsel. This is the repo's stated
  reality, recorded so a reader does not mistake agreement for independent
  scrutiny — owner: Gregory Douglas.
- **The guards that would catch a mistake here are the ones this change must
  alter.** The build currently fails on any form control and on external origins.
  Changing them and introducing the feature in one step removes the safety net at
  the moment it is most needed — owner: Gregory Douglas.

## Open questions

- Where do enquiries get worked once they arrive, and does it hold personal data
  itself? Named as a go-live blocker in this interview; adult-intake.md has no
  answer — owner: Gregory Douglas, needed by: before the flag flips.
- When will the Sparoah Elle entity be registered and confirmed active? Nothing
  may be collected before it is — owner: Gregory Douglas, needed by: gates
  go-live, no date set.
- Is a twelve-month retention period still the right answer now that an address
  and a consent record are the only things held? D11 chose it against a larger
  data set — owner: Gregory Douglas, needed by: Design.
- Does the existing `mailto:` route need its retention brought in line before the
  new route publishes a schedule, or is the difference defensible? — owner:
  Gregory Douglas, needed by: before the flag flips.
- What is owed to people who already emailed under today's terms, if the entity
  holding their message changes? — owner: Gregory Douglas, needed by: entity
  registration.
- Does adult-intake.md get amended in place, or superseded? It is a 785-line
  draft-for-build whose D4, D15, D9 and D10 survive this intent, while its §15.2
  field set and submit label do not — owner: Gregory Douglas, needed by: Design.

## Evidence

Drafted from an interview with Gregory Douglas on 2026-09-23, opened with:
"webside needs a 'Join the Founding Families' form to collect email information".

Answers given in that interview, in the originator's own choices:

- Purpose is pilot interest only, not a general mailing list.
- After submitting, a person has registered interest and nothing is promised.
- This intent **changes** the existing specification rather than restating it.
- The controller gate stays: build now, switch on at entity registration.
- Placement is greenfield; D19's separate page is not binding.
- Collect an email address and the required consents, nothing more.
- The form becomes the primary route; `mailto:` stays as the fallback.
- An address must be confirmed as its owner's before contact.
- A notification failure must never lose the enquiry.
- Reject if: it collects or invites child information; it adds a third-party
  script, processor or external origin; it implies enrollment, selection or a
  guarantee; it goes live before consent language is approved; or it goes live
  before storage with retention and purge, a working end-to-end deletion route,
  and somewhere to work the enquiries all exist.
- "More people start the enquiry" was dropped as a metric once it was established
  that measuring it would require analytics the site will not carry.

Prior art in the repository, all of which predates this intent:

- `docs/specs/adult-intake.md` — Adult-Only Intake Workflow, v1.0, 2026-08-11,
  "Draft for build", twenty decisions D1–D20 with rejected alternatives.
- `docs/specs/spec-website-correction.md` — the correction that removed "Join the
  Founding Family List" and replaced "Joining the list…" with "Requesting
  information…", and the acceptance criterion "No form or database is introduced."
- `CLAUDE.md` — "No embedded form. Calls to action are `mailto:` links by design,
  until a secure adult-only intake workflow with approved consent language and
  data-retention process exists."
- `tests/verify.mjs` — asserts no form control exists, that the content-security
  policy blocks form submission, and that the banned CTA string is absent.
