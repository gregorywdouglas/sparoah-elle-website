## Origin Story — Child Identity and Age Clarification

### Status

**Approved for implementation**

### Decision

The public website will preserve the authentic father-daughter founding story while reducing the direct public connection between the Sparoah Elle brand and the identity of a specific minor.

In the origin-story passage:

- Refer to the child as **“Gregory’s daughter.”**
- Do not refer to her as **“Sparoah.”**
- Do not use **“my daughter”** because the current website is written in a third-person institutional voice.
- State that the conversation occurred as she approached her **eighth birthday**.
- Spell out **“eighth”** rather than using the numeral **“8th.”**

This decision does not change the public brand name **Sparoah Elle**.

### Strategic intent

The age clarification is intended to communicate that:

- Curiosity, ambition, creativity, and entrepreneurial imagination can emerge much earlier than adults may expect.
- Girls may carry meaningful ideas before adults intentionally create space for those ideas to grow.
- Sparoah Elle is designed to help parents recognize and nurture those early sparks without taking ownership of the child’s idea.

Using **“Gregory’s daughter”** preserves the emotional truth of the story without explicitly confirming that the highly distinctive word **“Sparoah”** is the real first name of a specific child.

The company may be inspired by her spark without requiring her identity to become a public business asset.

### Required replacement copy

Replace the current origin-story introduction with:

> As Gregory’s daughter approached her eighth birthday, he offered her two summer experiences: gymnastics and a children’s AI class. When asked what she wanted, she chose both—and explained why:
>
> “Because I want to start my own company.”

Preserve the approved transition:

> That answer revealed something bigger. Girls often carry ideas long before adults create intentional space for them to explore those ideas. Sparoah Elle was created to help families make that space—together.

### Copy and voice requirements

- Preserve third-person narration throughout the section.
- Preserve the daughter’s quotation exactly.
- Preserve Gregory’s role in the story.
- Preserve the connection between the birthday conversation and the founding insight.
- Do not add language claiming that the child founded, operates, owns, manages, or publicly represents the company.
- Do not state or imply that the child is responsible for the company’s commercial success.
- Do not explicitly state that **Sparoah Elle** is the child’s legal name, full name, everyday name, or public identity.
- Do not convert the section into a first-person Founder’s Note as part of this release.
- Do not add new claims about the child’s abilities, business knowledge, educational development, confidence, or future role.

### Child-identity protection requirements

Do not add or disclose:

- Current age
- Exact birth date
- Last name
- Full legal name
- School or grade
- Home address or precise location
- Schedule or recurring activities
- Photograph, video, or voice recording
- Social-media account
- Contact information
- Health, educational, behavioral, or family information
- Additional biographical details not already approved

Do not place any child-identifying information in:

- Page metadata
- Open Graph metadata
- X/Twitter metadata
- JSON-LD structured data
- Image alternative text
- Image filenames
- HTML comments
- JavaScript comments
- Repository documentation intended for public deployment

### Social-media boundary

The child’s age and birthday story may be used as a restrained origin story, but they must not become a recurring promotional device.

Do not build a recurring content series around:

- “She was only eight”
- Her birthday
- Her personal ambitions
- Her extracurricular activities
- Her relationship to the public brand name

Future social content should focus primarily on:

- Gregory’s founder journey
- Parent insight
- Building the Quest
- Protection by Design
- Stewardship and service
- Product decisions and learning
- Verified pilot evidence when available

### Implementation scope

Claude Code must:

1. Locate the origin-story passage in `index.html`.
2. Replace only the approved child-reference and age wording.
3. Preserve the existing quotation and surrounding strategic meaning.
4. Search the public website files for any other passage that explicitly identifies the child as “Sparoah.”
5. Report every additional child-name reference before changing it.
6. Preserve all uses of **Sparoah Elle** as the company and brand name.
7. Confirm that no new child-identifying information is introduced in metadata, structured data, comments, or assets.
8. Update the governing handoff or decision log so a future implementation does not restore the previous wording.

### Acceptance criteria

- [ ] The origin story begins with **“As Gregory’s daughter approached her eighth birthday…”**
- [ ] The child is not named **“Sparoah”** in the origin-story narrative.
- [ ] The phrase **“my daughter”** does not appear unless the entire section is intentionally converted to first-person narration in a separately approved release.
- [ ] **“Eighth”** is spelled out.
- [ ] The quotation remains exactly: **“Because I want to start my own company.”**
- [ ] The transition to the broader company insight remains intact.
- [ ] The public brand name remains **Sparoah Elle**.
- [ ] The website does not explicitly link the brand name to the child’s legal or everyday identity.
- [ ] No current age, birth date, surname, school, location, photograph, schedule, or contact information is introduced.
- [ ] No child-identifying information is added to metadata, JSON-LD, alternative text, comments, or public asset names.
- [ ] The child is not presented as the adult founder, operator, executive, legal representative, or public spokesperson.
- [ ] Desktop and mobile layout remain visually intact after the copy change.
- [ ] The revised passage remains accessible to keyboard and screen-reader users.
- [ ] The project handoff or decision log is updated with this approved identity-protection decision.

### Preserve unchanged

Do not alter:

- The public brand name **Sparoah Elle**
- The company tagline **Every Quest builds the Queen within.**
- The quotation **“Because I want to start my own company.”**
- The insight that girls often carry ideas before adults create intentional space to explore them
- Gregory Douglas’s adult-founder positioning
- The principle that the brand should not depend on the child’s image, identity, or continuing public participation