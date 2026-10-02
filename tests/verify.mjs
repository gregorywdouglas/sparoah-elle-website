/**
 * Static validation and copy/policy assertions for the Sparoah Elle site.
 * Implements sections 11.1 and 11.2 of docs/specs/spec-website-correction.md.
 *
 * No dependencies by design — the site ships no third-party code and the CSP
 * forbids external origins, so the tests stay dependency-free too.
 *
 *   node tests/verify.mjs
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* The files deploy.sh publishes. Anything outside this list never reaches the web. */
const PUBLIC_FILES = [
  'index.html', 'privacy.html', '404.html', 'styles.css', 'script.js',
  'favicon.svg', 'favicon.ico', 'apple-touch-icon.png', 'icon-512.png',
  'og-image.png', 'robots.txt', 'sitemap.xml', 'staticwebapp.config.json',
];
const PUBLIC_HTML = ['index.html', 'privacy.html', '404.html'];
/* Text files a copy assertion can meaningfully read. */
const PUBLIC_TEXT = PUBLIC_FILES.filter((f) => /\.(html|css|js|txt|xml|json|svg)$/.test(f));

let passed = 0;
const failures = [];
const notes = [];

function check(name, fn) {
  try {
    const detail = fn();
    passed++;
    console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`);
  } catch (err) {
    failures.push(`${name}: ${err.message}`);
    console.log(`  FAIL  ${name} — ${err.message}`);
  }
}
function assert(cond, message) {
  if (!cond) throw new Error(message);
}
function section(title) {
  console.log(`\n${title}`);
}
const read = (f) => readFileSync(join(ROOT, f), 'utf8');

/* ------------------------------------------------------------------ *
 * Minimal markup scanners.
 * ------------------------------------------------------------------ */

const VOID_ELEMENTS = new Set([
  'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input',
  'link', 'meta', 'param', 'source', 'track', 'wbr',
]);

/** Strips comments, CDATA and the text content of <script>/<style> blocks. */
function stripNonMarkup(src) {
  return src
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, '')
    .replace(/(<script\b[^>]*>)[\s\S]*?(<\/script>)/gi, '$1$2')
    .replace(/(<style\b[^>]*>)[\s\S]*?(<\/style>)/gi, '$1$2');
}

/**
 * Stack-based well-formedness check. Reports the first mismatch with context.
 * `strict` (XML/SVG) treats every unclosed element as an error; HTML allows the
 * void element set to stand alone.
 */
function checkWellFormed(src, { strict = false, label = 'document' } = {}) {
  const body = stripNonMarkup(src)
    .replace(/<!doctype[^>]*>/gi, '')
    .replace(/<\?[\s\S]*?\?>/g, '');
  const stack = [];
  const tagRe = /<\s*(\/)?\s*([a-zA-Z][a-zA-Z0-9:-]*)([^>]*?)(\/)?>/g;
  let m;
  while ((m = tagRe.exec(body)) !== null) {
    const [, closing, rawName, attrs, selfClosed] = m;
    const name = rawName.toLowerCase();
    if (closing) {
      const open = stack.pop();
      if (open !== name) {
        throw new Error(`${label}: </${name}> closes <${open ?? 'nothing'}>`);
      }
      continue;
    }
    if (selfClosed) continue;
    if (!strict && VOID_ELEMENTS.has(name)) continue;
    if (strict && attrs.trimEnd().endsWith('/')) continue;
    stack.push(name);
  }
  if (stack.length) throw new Error(`${label}: unclosed <${stack.join('>, <')}>`);
  return true;
}

/** All attribute values for a given attribute name, in document order. */
function attrValues(src, attr) {
  const out = [];
  const re = new RegExp(`\\s${attr}\\s*=\\s*"([^"]*)"`, 'gi');
  let m;
  while ((m = re.exec(src)) !== null) out.push(m[1]);
  return out;
}

/** Visible-ish text: markup removed, entities decoded, whitespace collapsed. */
function textOf(src) {
  return stripNonMarkup(src)
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, '’')
    .replace(/\s+/g, ' ')
    .trim();
}

/* ------------------------------------------------------------------ *
 * 11.1 Static validation
 * ------------------------------------------------------------------ */

section('11.1 Static validation');

check('index.html sits at the deployable root', () => {
  assert(existsSync(join(ROOT, 'index.html')), 'index.html missing from repository root');
  return 'root/index.html';
});

check('every published file exists', () => {
  const missing = PUBLIC_FILES.filter((f) => !existsSync(join(ROOT, f)));
  assert(missing.length === 0, `missing: ${missing.join(', ')}`);
  return `${PUBLIC_FILES.length} files`;
});

check('deploy.sh allowlist matches the tested file set', () => {
  const deploy = read('deploy.sh');
  const block = deploy.match(/PUBLIC_FILES=\(([\s\S]*?)\)/);
  assert(block, 'PUBLIC_FILES block not found in deploy.sh');
  const declared = block[1].split(/\s+/).filter(Boolean).sort();
  const expected = [...PUBLIC_FILES].sort();
  assert(
    JSON.stringify(declared) === JSON.stringify(expected),
    `deploy.sh publishes [${declared}] but tests cover [${expected}]`,
  );
  return `${declared.length} files`;
});

for (const file of PUBLIC_HTML) {
  check(`${file} parses (tags balanced)`, () => checkWellFormed(read(file), { label: file }) && 'well formed');
}

check('sitemap.xml parses', () => {
  const xml = read('sitemap.xml');
  checkWellFormed(xml, { strict: true, label: 'sitemap.xml' });
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  assert(locs.length > 0, 'no <loc> entries');
  for (const loc of locs) {
    assert(loc.startsWith('https://sparoahelle.com/'), `non-canonical <loc>: ${loc}`);
  }
  return `${locs.length} URLs, all canonical`;
});

check('favicon.svg parses', () => {
  const svg = read('favicon.svg');
  checkWellFormed(svg, { strict: true, label: 'favicon.svg' });
  assert(/<svg[\s>]/.test(svg), 'no <svg> root element');
  return 'well formed';
});

check('staticwebapp.config.json parses', () => {
  const cfg = JSON.parse(read('staticwebapp.config.json'));
  assert(cfg.globalHeaders?.['Content-Security-Policy'], 'CSP header missing');
  return 'valid JSON, CSP present';
});

check('script.js parses', () => {
  new vm.Script(read('script.js'), { filename: 'script.js' });
  return 'compiles';
});

check('styles.css parses (braces and comments balanced)', () => {
  const css = read('styles.css');
  assert(!/\/\*(?:(?!\*\/)[\s\S])*$/.test(css), 'unterminated /* comment */');
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0;
  for (const ch of stripped) {
    if (ch === '{') depth++;
    else if (ch === '}' && --depth < 0) throw new Error('unbalanced } in styles.css');
  }
  assert(depth === 0, `${depth} unclosed { in styles.css`);
  return 'balanced';
});

check('JSON-LD parses and carries no unsupported claim', () => {
  const blocks = [...read('index.html').matchAll(
    /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )].map((m) => m[1]);
  assert(blocks.length > 0, 'no JSON-LD block found');
  const banned = ['Product', 'Review', 'Rating', 'AggregateRating', 'Offer', 'Event'];
  for (const raw of blocks) {
    const data = JSON.parse(raw); // throws on malformed JSON
    const serialised = JSON.stringify(data);
    assert(!/confidence/i.test(serialised), 'JSON-LD still contains a confidence claim');
    for (const type of banned) {
      assert(
        !new RegExp(`"@type"\\s*:\\s*"${type}"`).test(serialised),
        `JSON-LD declares an unsupported @type: ${type}`,
      );
    }
    assert(!/price|availability|aggregateRating/i.test(serialised), 'JSON-LD contains commerce claims');
  }
  return `${blocks.length} block(s) valid`;
});

check('no duplicate element IDs', () => {
  for (const file of PUBLIC_HTML) {
    const ids = attrValues(read(file), 'id');
    const seen = new Set();
    for (const id of ids) {
      assert(!seen.has(id), `${file}: duplicate id "${id}"`);
      seen.add(id);
    }
  }
  return 'unique in all three pages';
});

check('no empty href or src', () => {
  for (const file of PUBLIC_HTML) {
    const src = read(file);
    assert(!/\shref\s*=\s*(""|'')/.test(src), `${file}: empty href`);
    assert(!/\ssrc\s*=\s*(""|'')/.test(src), `${file}: empty src`);
  }
  return 'none';
});

check('every in-page anchor resolves', () => {
  let checked = 0;
  for (const file of PUBLIC_HTML) {
    const src = read(file);
    const ids = new Set(attrValues(src, 'id'));
    for (const href of attrValues(src, 'href')) {
      if (!href.startsWith('#')) continue;
      const target = href.slice(1);
      assert(ids.has(target), `${file}: #${target} has no matching id`);
      checked++;
    }
  }
  return `${checked} anchors`;
});

check('every referenced local file exists', () => {
  let checked = 0;
  for (const file of PUBLIC_HTML) {
    const src = read(file);
    for (const ref of [...attrValues(src, 'href'), ...attrValues(src, 'src')]) {
      if (/^(https?:|mailto:|data:|#)/.test(ref)) continue;
      const rel = ref.replace(/^\//, '').split(/[?#]/)[0];
      if (!rel) continue; // "/" is the site root, served by index.html
      assert(existsSync(join(ROOT, rel)), `${file}: references missing file ${ref}`);
      checked++;
    }
  }
  return `${checked} references`;
});

check('heading hierarchy never skips a level', () => {
  for (const file of PUBLIC_HTML) {
    const levels = [...read(file).matchAll(/<h([1-6])\b/gi)].map((m) => Number(m[1]));
    assert(levels[0] === 1, `${file}: first heading is h${levels[0]}, expected h1`);
    assert(levels.filter((l) => l === 1).length === 1, `${file}: more than one h1`);
    let previous = levels[0];
    for (const level of levels.slice(1)) {
      assert(level <= previous + 1, `${file}: h${previous} is followed by h${level}`);
      previous = level;
    }
  }
  return 'h1 → h2 → h3 → h4 with no gaps';
});

check('no empty containers left by removed content', () => {
  const src = stripNonMarkup(read('index.html'));
  /* Decorative aria-hidden elements (the hero glows) are painted by CSS and are
     empty by design; anything else empty is a leftover from removed content. */
  const empty = [...src.matchAll(/<(div|section|ul|ol|article|aside|p)\b([^>]*)>\s*<\/\1>/gi)]
    .filter((m) => !/aria-hidden="true"/.test(m[2]));
  assert(empty.length === 0, `${empty.length} empty container(s): ${empty.map((m) => m[1]).join(', ')}`);
  return 'none beyond the decorative hero glows';
});

check('no orphaned CSS for removed orbit chips', () => {
  const css = read('styles.css');
  assert(!/\.orbit-item|\.orbit-(one|two|three|four|five|six)\b/.test(css), 'orbit chip rules still present');
  const html = read('index.html');
  assert(!/orbit-item/.test(html), 'orbit chip markup still present');
  return 'markup and rules both removed';
});

/* ------------------------------------------------------------------ *
 * 11.2 Copy and policy assertions
 * ------------------------------------------------------------------ */

section('11.2 Copy and policy assertions');

const publicText = Object.fromEntries(PUBLIC_TEXT.map((f) => [f, read(f)]));

function forbidEverywhere(label, pattern) {
  check(label, () => {
    const hits = [];
    for (const [file, src] of Object.entries(publicText)) {
      const found = src.match(pattern);
      if (found) hits.push(`${file}: "${found[0]}"`);
    }
    assert(hits.length === 0, hits.join('; '));
    return 'absent from every published file';
  });
}
function requireIn(label, file, needle) {
  check(label, () => {
    assert(publicText[file].includes(needle), `not found in ${file}`);
    return `present in ${file}`;
  });
}

/* WEB-CORR-001 — global truthfulness search. */
forbidEverywhere('no unsupported "confidence" copy', /confidence/i);
forbidEverywhere('no "tangible" / "tangible reminder"', /tangible/i);
forbidEverywhere('no adult quality filter ("good idea")', /good idea/i);
forbidEverywhere('no "Join the Founding Family List" CTA', /Join the Founding Family List/i);
forbidEverywhere('no "Discovery" contribution framework', /\bDiscovery\b/i);
forbidEverywhere('no "from gift to action to contribution"', /from gift to action to contribution/i);
forbidEverywhere('no "from discovery to contribution"', /from discovery to contribution/i);
forbidEverywhere('no duplicated "another app" comparison', /another app/i);
forbidEverywhere('no duplicated "open-ended chatbot" comparison', /open-ended chatbot/i);
forbidEverywhere('no "purchasing decision" (there is no purchase flow)', /purchasing decision/i);

check('no passive "are reviewed" without a named human', () => {
  for (const [file, src] of Object.entries(publicText)) {
    for (const m of src.matchAll(/are reviewed(?! by a person)/gi)) {
      throw new Error(`${file}: passive "${m[0]}"`);
    }
  }
  return 'every occurrence reads "are reviewed by a person"';
});

/* WEB-CORR-006 — the journey is the only numbered six-part sequence. */
check('the six-step journey appears exactly once', () => {
  const steps = ['Discover', 'Talk', 'Create', 'Reflect', 'Share', 'Serve'];
  const src = publicText['index.html'];
  const grids = [...src.matchAll(/<h3>(Discover|Talk|Create|Reflect|Share|Serve)<\/h3>/g)];
  assert(grids.length === 6, `expected 6 journey step headings, found ${grids.length}`);
  assert(
    JSON.stringify(grids.map((m) => m[1])) === JSON.stringify(steps),
    `journey order changed: ${grids.map((m) => m[1]).join(', ')}`,
  );
  /* Any second presentation would repeat the numbering next to the same words. */
  const numbered = [...src.matchAll(/<span>0([1-6])<\/span>/g)];
  assert(numbered.length === 6, `expected 6 numbered items in total, found ${numbered.length}`);
  return '6 steps, one presentation, correct order';
});

check('planned components are unnumbered and semantically a list', () => {
  const src = publicText['index.html'];
  const list = src.match(/<ul class="includes-list">([\s\S]*?)<\/ul>/);
  assert(list, 'includes-list <ul> not found');
  const items = [...list[1].matchAll(/<li>[\s\S]*?<\/li>/g)];
  assert(items.length === 6, `expected 6 components, found ${items.length}`);
  for (const [item] of items) {
    assert(!/\b0[1-6]\b/.test(item), 'a component still carries 01–06 numbering');
    assert(!/\bstep\b/i.test(item) || /A service step/.test(item), 'step language reintroduced');
    assert(/<h4>/.test(item), 'component lost its heading');
  }
  const names = [
    'A personalized opening story', 'Parent conversation prompts', 'An idea-to-action challenge',
    'Reflection and Quest Passport', 'A service step', 'A completion keepsake',
  ];
  for (const name of names) assert(list[1].includes(name), `component removed: ${name}`);
  return '6 components, <ul>/<li>, no numbering';
});

/* WEB-CORR-005 / 007 / 008 / 009 / 010 — exact approved copy. */
const REQUIRED_INDEX = [
  ['hero support sentence', 'Sparoah Elle gives parents a guided way to help a girl explore an idea, bring it to life, and use what she creates to serve someone else.'],
  ['Quest definition preserved', 'A Quest is a guided family experience that combines a personalized story, parent-child conversation, a creative challenge, reflection, and an act of service.'],
  ['Queen definition', 'The Queen within is the dignity to know her worth, the courage to act on her ideas, the wisdom to choose well, the creativity to build, and the compassion to use her gifts in service to others.'],
  ['"Not status. Stewardship."', 'Not status. Stewardship.'],
  ['parent-emotional bridge preserved', 'but do not always have a clear way to help an idea move forward without taking it over'],
  /* Origin Story — Child Identity and Age Clarification (approved 2026-08-23): the child is
     referred to as Gregory's daughter, never by name, and "eighth" is spelled out. */
  ['origin story opens with the approved wording', 'As Gregory’s daughter approached her eighth birthday, he offered her two summer experiences'],
  ['founding story quotation preserved', '“Because I want to start my own company.”'],
  ['founding insight transition preserved', 'That answer revealed something bigger. Girls often carry ideas long before adults create intentional space for them to explore those ideas.'],
  ['brand name still closes the transition', 'Sparoah Elle was created to help families make that space—together.'],
  ['product description', 'designed to help a girl explore an idea she cares about, bring it to life, and discover how her gifts can make a difference.'],
  ['shared-path sentence', 'Each Quest is designed to give a parent and girl a clear path to read, talk, imagine, create, reflect, and serve together.'],
  ['planned-components qualification', 'These components are planned for the Founding Family Pilot and may be refined through family feedback.'],
  ['keepsake reads "lasting"', 'A lasting reminder that her ideas, voice, effort, and contribution matter.'],
  ['"What your family receives"', 'What your family receives'],
  ['"What your family does together"', 'What your family does together'],
  ['journey heading preserved', 'Designed for connection, not passive consumption.'],
  ['contribution heading', 'From idea to action to contribution.'],
  ['contribution paragraph', 'Every Quest moves from idea to action to contribution.'],
  ['family-promise heading preserved', 'Childhood should be protected while possibility is expanded.'],
  ['AI-companion boundary preserved', 'Children are not handed over to an open-ended AI companion.'],
  ['human review names a person', 'reviewed by a person'],
  ['direct-marketing copy', 'We market to adults, not to children.'],
  ['participation copy', 'Parents and caregivers decide whether and how a child participates.'],
  ['child-account language preserved', 'do not invite children to create accounts on this site'],
  /* Founder section, founder-approved 2026-10-02 (Origin Story spec, Amendment 2026-10-02).
     Editing this wording voids that approval. */
  ['founder headline', '<h2>A father’s attention. A daughter’s spark. A shared purpose.</h2>'],
  ['founder paragraph one', 'Sparoah Elle began with Gregory Douglas’s daughter on his shoulders, arms raised high, announcing that she was queen of the world. He paid attention, and made it his job to help her feel that way all the time: not just special, but safe enough to believe it.'],
  ['founder paragraph two', 'One summer, she told him she had decided to start her own business. He was thrilled and said they could build it together, but before he could say anything more, she stopped him. She had thought of it all by herself, she said. “That’s because I have the same mind as you.”'],
  ['founder paragraph three', 'That moment showed him what a girl does when she feels safe and seen: she claims her own ideas.'],
  ['founder paragraph four', 'He had seen that belief before, in his older daughter, now grown. She has never stopped believing she can do whatever she sets out to do, and then doing it. A serial entrepreneur, she has built ventures in real estate, beauty, and fitness, and she’s now earning her MBA.'],
  ['founder paragraph five keeps Gregory the subject', 'Today he brings that same attention, along with more than 25 years as an enterprise technology architect, to a deeply personal mission: creating safe, thoughtful experiences that help girls explore what they can build and who they can bless, and building something worthy of a child’s trust and a family’s time.'],
  ['navigation label', '>Founding Family Pilot</a>'],
  ['enrollment-implying copy replaced', 'Requesting information does not guarantee selection or enroll a child.'],
  ['own-contact-information notice', 'Please provide only your own contact information.'],
  ['adults-only notice', 'Adults only. Please do not email personal information about a child.'],
  ['reply expectation microcopy', 'We’ll reply with adult-only pilot details and next steps. No child information is needed at this stage.'],
  ['visible email fallback', 'Or email us directly at <a href="mailto:hello@sparoahelle.com">hello@sparoahelle.com</a>.'],
  ['status badge preserved', 'Founding Family Pilot — Now Forming'],
  ['tagline preserved', 'Every Quest builds the Queen within.'],
  ['audience preserved', 'Parent-led Quest experiences for girls ages 7–11'],
];
for (const [label, needle] of REQUIRED_INDEX) requireIn(label, 'index.html', needle);

check('"Request Founding Family Information" is used for all three CTAs', () => {
  const src = publicText['index.html'];
  const count = (src.match(/Request Founding Family Information/g) || []).length;
  assert(count === 3, `expected 3 occurrences (hero, Quest card, final CTA), found ${count}`);
  assert(!/Request Founding Family information/.test(src), 'lowercase "information" variant still present');
  return '3 CTAs, consistent casing';
});

check('only the final CTA opens a mail client on the homepage', () => {
  const src = publicText['index.html'];
  const mailtos = [...src.matchAll(/href="mailto:([^"]*)"/g)];
  const ctaIndex = src.indexOf('id="founding-families"');
  for (const m of mailtos) {
    const isFooter = src.slice(m.index).includes('class="footer-links"') === false;
    assert(
      m.index > ctaIndex,
      `a mailto: link appears above the Founding Family section (REQ-007): ${m[1].slice(0, 40)}`,
    );
    void isFooter;
  }
  return `${mailtos.length} mailto links, all at or below #founding-families`;
});

check('the Founding Family mailto keeps its exact subject and body', () => {
  const src = publicText['index.html'];
  const href = src.match(/href="(mailto:hello@sparoahelle\.com\?[^"]+)"/);
  assert(href, 'prefilled Founding Family mailto link not found');
  const url = new URL(href[1].replace(/&amp;/g, '&'));
  assert(url.pathname === 'hello@sparoahelle.com', `wrong recipient: ${url.pathname}`);
  const subject = url.searchParams.get('subject');
  const body = url.searchParams.get('body');
  assert(subject === 'Founding Family Interest', `subject drifted: "${subject}"`);
  assert(
    body === 'I am an adult interested in learning more about the Sparoah Elle Founding Family Pilot. I have not included personal information about a child.',
    `body drifted: "${body}"`,
  );
  assert(!/age|name|school|child.s name|tell us/i.test(body), 'body asks for child information');
  return 'recipient, subject and body intact';
});

check('contact addresses are correct and exclusive', () => {
  const addresses = new Set();
  for (const [file, src] of Object.entries(publicText)) {
    for (const m of src.matchAll(/mailto:([^"?&]+)/g)) addresses.add(`${m[1]}`);
    assert(!/cheopsconsulting\.com/i.test(src), `${file}: Cheops address present`);
    assert(!/gregory\.w\.douglas/i.test(src), `${file}: personal address present`);
  }
  const allowed = new Set(['hello@sparoahelle.com', 'privacy@sparoahelle.com']);
  for (const a of addresses) assert(allowed.has(a), `unexpected address: ${a}`);
  assert(addresses.has('hello@sparoahelle.com'), 'hello@sparoahelle.com missing');
  assert(publicText['privacy.html'].includes('privacy@sparoahelle.com'), 'privacy@ missing from privacy.html');
  return [...addresses].join(', ');
});

check('privacy page home links point at the canonical root', () => {
  const src = publicText['privacy.html'];
  assert(!/href="\/?index\.html"/.test(src), 'a home link still targets index.html');
  assert(src.includes('<a class="nav-cta" href="/">Return home</a>'), 'Return home does not point at /');
  assert(src.includes('<a class="brand" href="/"'), 'logo does not point at /');
  assert(
    src.includes('<link rel="canonical" href="https://sparoahelle.com/privacy.html">'),
    'privacy canonical URL changed',
  );
  return 'logo, Return home and footer all use /';
});

check('privacy notice still describes the deployed site', () => {
  const src = publicText['privacy.html'];
  assert(
    src.includes('does not currently use an embedded contact form, advertising tracker, or analytics tool'),
    'the no-form/no-analytics statement changed',
  );
  assert(src.includes('Effective date: August 10, 2026'), 'effective date changed');
  const unimplemented = /age verification|email verification|consent ledger|automated deletion|verification token|attorney|certified/i;
  assert(!unimplemented.test(src), 'privacy notice describes an unimplemented control');
  return 'accurate, effective date unchanged';
});

check('no form is introduced anywhere', () => {
  for (const file of PUBLIC_HTML) {
    const src = publicText[file];
    assert(!/<form\b/i.test(src), `${file}: <form> element`);
    assert(!/<input\b/i.test(src), `${file}: <input> element`);
    assert(!/<textarea\b|<select\b/i.test(src), `${file}: form control`);
  }
  const csp = JSON.parse(publicText['staticwebapp.config.json']).globalHeaders['Content-Security-Policy'];
  assert(/form-action 'none'/.test(csp), 'CSP no longer blocks form submission');
  return 'no form elements; CSP still sets form-action none';
});

check('no analytics or advertising tracking ships', () => {
  const patterns = [
    /googletagmanager/i, /gtag\s*\(/i, /google-analytics/i, /\bGTM-[A-Z0-9]/,
    /clarity\.ms/i, /plausible\.io/i, /segment\.(com|io)/i, /mixpanel/i, /hotjar/i,
    /fbq\s*\(/i, /facebook\s*pixel/i, /connect\.facebook\.net/i,
    /cloudflareinsights/i, /beacon\.min\.js/i, /sessionreplay|session-replay/i,
    /_gaq|dataLayer/i, /doubleclick/i,
  ];
  for (const [file, src] of Object.entries(publicText)) {
    for (const p of patterns) {
      const hit = src.match(p);
      assert(!hit, `${file}: tracking pattern "${hit?.[0]}"`);
    }
  }
  return `${Object.keys(publicText).length} files clean`;
});

check('no external network origin is referenced', () => {
  for (const file of PUBLIC_HTML) {
    const src = publicText[file];
    for (const ref of [...attrValues(src, 'href'), ...attrValues(src, 'src')]) {
      if (!/^https?:/.test(ref)) continue;
      assert(
        ref.startsWith('https://sparoahelle.com/'),
        `${file}: external origin ${ref} (the CSP is default-src 'self')`,
      );
    }
    /* schema.org appears only as a JSON-LD @context identifier, never as a fetch. */
    assert(!/<link[^>]+fonts\.(googleapis|gstatic)/i.test(src), `${file}: external font request`);
  }
  return 'self-origin only';
});

check('no inline style attribute or inline script body', () => {
  for (const file of PUBLIC_HTML) {
    const src = publicText[file];
    assert(!/\sstyle\s*=\s*"/.test(src), `${file}: inline style attribute (CSP blocks it)`);
    for (const m of src.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      const [, attrs, content] = m;
      if (/type=["']application\/ld\+json["']/i.test(attrs)) continue; // data block, not executable
      assert(content.trim() === '', `${file}: executable inline script (CSP blocks it)`);
    }
  }
  return 'external script.js and one JSON-LD data block only';
});

check('no unsupported business claim is introduced', () => {
  const banned = [
    [/\bLLC\b/, 'legal suffix'],
    [/Good Soil|T\.?D\.? Jakes|Wells Fargo/i, 'affiliation claim'],
    [/\btestimonial|customers say|trusted by|as seen (in|on)\b/i, 'testimonial or endorsement'],
    [/\b(revenue|profitab|customers served|families served|\d+\s*(families|customers|users))\b/i, 'traction claim'],
    [/\b(clinically|scientifically|research[- ]proven|evidence[- ]based)\b/i, 'scientific claim'],
    [/\b(CEO|Chief Executive|child development expert|psychologist|educator|advisory board)\b/i, 'unapproved credential'],
    [/\$\s?\d|\bpricing\b|\bper month\b|\bsubscribe\b/i, 'pricing or subscription'],
    [/\b(kit|box|workbook|printable|portal|shipped|live class)\b/i, 'delivery-format commitment'],
    [/limited spots|only \d+ left|hurry|act now|countdown|exclusive access/i, 'scarcity or urgency'],
  ];
  for (const file of PUBLIC_HTML) {
    const text = textOf(publicText[file]);
    for (const [pattern, label] of banned) {
      const hit = text.match(pattern);
      assert(!hit, `${file}: ${label} — "${hit?.[0]}"`);
    }
  }
  return 'none in visible copy';
});

check('metadata and structured data are aligned', () => {
  const src = publicText['index.html'];
  /* Approved 2026-10-02. One string for every description channel on every page,
     including the JSON-LD slogan; supersedes the WEB-CORR-012 description. */
  const DESCRIPTION = 'Sparoah Elle is building parent-led Quest experiences for girls ages 7 to 11, designed with safety and privacy first. Founded by Gregory Douglas.';
  const SOCIAL_TITLE = 'Sparoah Elle | Every Quest builds the Queen within';
  const meta = (re) => (src.match(re) || [, null])[1];

  assert(/<title>Sparoah Elle \| Parent-Led Quests for Girls<\/title>/.test(src), 'HTML title changed');
  assert(meta(/<meta name="description" content="([^"]*)"/) === DESCRIPTION, 'meta description not aligned');
  assert(meta(/<meta property="og:description" content="([^"]*)"/) === DESCRIPTION, 'og:description not aligned');
  assert(meta(/<meta name="twitter:description" content="([^"]*)"/) === DESCRIPTION, 'twitter:description not aligned');
  assert(meta(/<meta property="og:title" content="([^"]*)"/) === SOCIAL_TITLE, 'og:title casing or text wrong');
  assert(meta(/<meta name="twitter:title" content="([^"]*)"/) === SOCIAL_TITLE, 'twitter:title casing or text wrong');
  assert(meta(/<meta property="og:url" content="([^"]*)"/) === 'https://sparoahelle.com/', 'og:url changed');
  assert(meta(/<meta property="og:type" content="([^"]*)"/) === 'website', 'og:type changed');
  assert(meta(/<meta property="og:site_name" content="([^"]*)"/) === 'Sparoah Elle', 'og:site_name changed');
  assert(meta(/<meta property="og:locale" content="([^"]*)"/) === 'en_US', 'og:locale changed');
  assert(meta(/<meta name="twitter:card" content="([^"]*)"/) === 'summary_large_image', 'twitter:card changed');
  assert(/<link rel="canonical" href="https:\/\/sparoahelle\.com\/">/.test(src), 'homepage canonical changed');
  for (const alt of ['og:image:alt', 'twitter:image:alt']) {
    const value = meta(new RegExp(`<meta (?:property|name)="${alt}" content="([^"]*)"`));
    assert(value && value.length > 10, `${alt} missing or empty`);
  }
  const ld = JSON.parse(src.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert(ld.description === DESCRIPTION, 'JSON-LD description not aligned');
  assert(ld.slogan === DESCRIPTION, 'JSON-LD slogan not aligned');
  for (const file of ['privacy.html', '404.html']) {
    const own = (publicText[file].match(/<meta name="description" content="([^"]*)"/) || [, null])[1];
    assert(own === DESCRIPTION, `${file}: meta description not aligned`);
  }
  assert(ld.url === 'https://sparoahelle.com/', 'JSON-LD url changed');
  assert(ld.founder?.name === 'Gregory Douglas', 'JSON-LD founder changed');
  return 'title, OG, X/Twitter and JSON-LD consistent';
});

/* ---- Origin Story — Child Identity and Age Clarification ---- */

check('the child is never named in a deployable file', () => {
  const hits = [];
  for (const [file, src] of Object.entries(publicText)) {
    for (const m of src.matchAll(/Sparoah/gi)) {
      const rest = src.slice(m.index + 'Sparoah'.length);
      /* Allowed forms are all the brand name: "Sparoah Elle", the URL-encoded
         "Sparoah%20Elle" in the mailto body, and the sparoahelle.com domain. */
      const isBrand = /^(\s|%20)Elle\b/i.test(rest) || /^elle/i.test(rest);
      if (!isBrand) {
        const line = src.slice(0, m.index).split('\n').length;
        hits.push(`${file}:${line} — "${src.slice(m.index, m.index + 40).replace(/\s+/g, ' ')}"`);
      }
    }
  }
  assert(hits.length === 0, `the child is named outside the brand: ${hits.join('; ')}`);
  return 'every occurrence is the brand name Sparoah Elle';
});

check('the origin story keeps third-person narration', () => {
  const src = publicText['index.html'];
  assert(!/\bmy daughter\b/i.test(src), '"my daughter" would switch the section to first person');
  /* The daughter's approved founder-section quotation is her speech, not narration. */
  const narration = textOf(src).split('“That’s because I have the same mind as you.”').join(' ');
  for (const p of [/\bI (am|was|have|built|created|founded)\b/, /\bmy (child|family|company|wife)\b/i]) {
    const hit = narration.match(p);
    /* The mailto body is adult-authored first person by design; the page copy is not. */
    assert(!hit, `first-person narration in page copy: "${hit?.[0]}"`);
  }
  return 'third person throughout';
});

check('the child\'s age is spelled out and no other age detail appears', () => {
  const src = publicText['index.html'];
  assert(src.includes('eighth birthday'), '"eighth birthday" not found');
  assert(!/\b8th\b/i.test(src), 'the numeral "8th" is used instead of "eighth"');
  const text = textOf(src);
  /* "girls ages 7-11" is the approved audience statement, not a detail about her. */
  const audience = 'Parent-led Quest experiences for girls ages 7–11';
  const withoutAudience = text.split(audience).join(' ');
  for (const p of [
    [/\b(she|her|the child|his daughter) is \d+\b/i, 'current age'],
    [/\b(born|birth ?date|date of birth)\b/i, 'birth date'],
    [/\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b/, 'a date that could be a birth date'],
    [/\b(grade|kindergarten|elementary school|attends|enrolled at)\b/i, 'school or grade'],
    [/\b(lives in|based in|home address|\d+ [A-Z][a-z]+ (Street|Road|Avenue|Lane))\b/, 'location'],
    [/\b(every (Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)|after school on)\b/i, 'a schedule'],
    [/\b(instagram|tiktok|youtube|facebook)\b|(?<![\w.])@[a-z0-9_]{3,}/i, "a social account"],
  ]) {
    const hit = withoutAudience.match(p[0]);
    assert(!hit, `child detail introduced (${p[1]}): "${hit?.[0]}"`);
  }
  return 'age spelled out; no birth date, school, location, schedule or handle';
});

check('no child-identifying information sits in metadata, JSON-LD, alt text or asset names', () => {
  const src = publicText['index.html'];
  const surfaces = [
    ...attrValues(src, 'content'),
    ...attrValues(src, 'alt'),
    ...attrValues(src, 'aria-label'),
    ...[...src.matchAll(/<!--([\s\S]*?)-->/g)].map((m) => m[1]),
    ...[...src.matchAll(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]),
    ...PUBLIC_FILES, // asset filenames
  ];
  for (const value of surfaces) {
    for (const m of String(value).matchAll(/Sparoah/gi)) {
      const rest = String(value).slice(m.index + 'Sparoah'.length);
      assert(
        /^(\s|%20)Elle\b/i.test(rest) || /^elle/i.test(rest),
        `child name outside the brand in a non-visible surface: "${String(value).slice(0, 60)}"`,
      );
    }
    assert(!/\bdaughter\b/i.test(String(value)), `child reference in metadata or an asset name: "${String(value).slice(0, 60)}"`);
  }
  const ld = JSON.parse(src.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert(ld.founder?.name === 'Gregory Douglas', 'JSON-LD founder is not the adult founder');
  assert(!/child|daughter|minor/i.test(JSON.stringify(ld)), 'JSON-LD references a child');
  return `${surfaces.length} metadata, comment, structured-data and filename surfaces clean`;
});

check('the child is not presented as founder, operator or spokesperson', () => {
  const src = publicText['index.html'];
  const text = textOf(src);
  /* Since 2026-10-02 the visible "founded by" sentence is retired; adult-founder
     positioning rests on the founder section and the structured data. */
  const founder = textOf(src.match(/<section class="section founder">([\s\S]*?)<\/section>/)?.[1] ?? '');
  assert(/Gregory Douglas/.test(founder), 'the founder section no longer names Gregory Douglas');
  assert(
    /\bhe brings that same attention, along with more than 25 years as an enterprise technology architect/i.test(founder),
    'the founder section no longer presents Gregory as the experienced adult behind the company',
  );
  const ld = JSON.parse(src.match(/application\/ld\+json[^>]*>([\s\S]*?)<\/script>/)[1]);
  assert(ld.founder?.name === 'Gregory Douglas', 'JSON-LD founder is not Gregory Douglas');
  for (const p of [
    /daughter (is|as) (the )?(founder|ceo|owner|operator|president|spokesperson)/i,
    /(founded|owned|operated|run|led) by (his |a |the )?(daughter|child|girl)/i,
    /her company/i,
  ]) {
    const hit = text.match(p);
    assert(!hit, `the child is positioned as an operator: "${hit?.[0]}"`);
  }
  return 'Gregory Douglas remains the sole named founder';
});

check('the SE seal and the no-photograph boundary hold', () => {
  const src = publicText['index.html'];
  assert(/<div class="founder-mark" aria-hidden="true">SE<\/div>/.test(src), 'SE seal removed');
  const images = [...src.matchAll(/<img\b[^>]*>/gi)];
  assert(images.length === 0, `${images.length} <img> element(s) added to the homepage`);
  return 'seal present, no photograph';
});

check('sitemap lastmod reflects the changed pages', () => {
  const xml = publicText['sitemap.xml'];
  const dates = [...xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)].map((m) => m[1]);
  for (const d of dates) assert(/^\d{4}-\d{2}-\d{2}$/.test(d), `malformed lastmod: ${d}`);
  assert(dates.every((d) => d >= '2026-08-23'), `stale lastmod after a content change: ${dates.join(', ')}`);
  return dates.join(', ');
});

/* ------------------------------------------------------------------ *
 * Review handoff, 2026-09-22.
 * The developer handoff of 2026-09-21 asked for a FAQ, a stated pilot scope,
 * a "what happens next" block, a share link, COPPA-aware privacy copy and a
 * consolidated design-token set. These pin what was actually agreed, including
 * the answers that were deliberately left open rather than invented.
 * ------------------------------------------------------------------ */

section('Review handoff 2026-09-22');

check('the FAQ sits above the Founding Family section', () => {
  const src = publicText['index.html'];
  const faqIndex = src.indexOf('id="questions"');
  const ctaIndex = src.indexOf('id="founding-families"');
  assert(faqIndex > 0, 'the FAQ section is missing');
  assert(faqIndex < ctaIndex, 'the FAQ must be read before the pilot CTA, not after it');
  const block = src.slice(faqIndex, ctaIndex);
  const questions = [...block.matchAll(/<h3>([^<]+)<\/h3>/g)].map((m) => m[1]);
  assert(questions.length === 6, `expected 6 questions, found ${questions.length}`);
  for (const q of questions) assert(q.trim().endsWith('?'), `FAQ heading is not a question: "${q}"`);
  assert(/<a href="#questions">Questions<\/a>/.test(src), 'the FAQ has no navigation entry');
  return `6 questions, linked from the nav, ${questions.length} above the CTA`;
});

check('the FAQ answers the four objections without inventing facts', () => {
  const src = publicText['index.html'];
  /* Cost, length and cap were open questions in the handoff. The approved
     resolution was to say they are undecided, never to publish a placeholder. */
  for (const [label, needle] of [
    ['AI answer keeps the child out of the loop', 'The conversation inside a Quest is between a girl and her parent or caregiver.'],
    ['cost stays undecided', 'That is still being decided. Whatever it turns out to be is shared in the pilot details, in writing, before a family is asked to commit to anything.'],
    ['length stays undecided', 'Length and pace are being shaped with founding families, which is part of what the pilot is for.'],
    ['age range matches the audience statement', 'designed for girls ages 7–11, with a parent or caregiver guiding the experience'],
    ['no-commitment answer', 'It starts a conversation so an adult can see the details and decide whether the pilot is right for their family.'],
  ]) {
    assert(src.includes(needle), `${label}: not found in index.html`);
  }
  /* A placeholder that reached production would read as a real commitment. */
  assert(!/\[Insert|TBD|TODO|lorem ipsum/i.test(src), 'an unfilled placeholder is still in the copy');
  return '6 answers, none of them a guessed number';
});

check('the pilot scope is stated without a fabricated cap', () => {
  const src = publicText['index.html'];
  assert(
    src.includes('a small, limited group of parents and caregivers'),
    'the pilot-scope wording changed',
  );
  assert(
    src.includes('Requests are read as they arrive, so early interest gets first consideration.'),
    'the rolling-review sentence is missing',
  );
  /* No cap was ever confirmed, so no number may appear next to "families". */
  const text = textOf(src);
  const hit = text.match(/\b\d+\s+(founding\s+)?families\b/i);
  assert(!hit, `an unconfirmed pilot cap is published: "${hit?.[0]}"`);
  return 'limited group, rolling review, no invented number';
});

check('"what happens next" sets expectations without promising a deadline', () => {
  const src = publicText['index.html'];
  const list = src.match(/<ul class="cta-next">([\s\S]*?)<\/ul>/);
  assert(list, 'the "what happens next" list is missing');
  const items = [...list[1].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m) => m[1]);
  assert(items.length === 3, `expected 3 expectations, found ${items.length}`);
  assert(src.includes('<p class="cta-next-label">What happens next</p>'), 'the list has no label');
  /* No reply-time service level has been committed to, so none may be published. */
  for (const item of items) {
    const hit = item.match(/within \d+|\d+\s*(–|-|to)\s*\d+\s*(business\s+)?(day|hour|week)/i);
    assert(!hit, `an unbacked response-time promise: "${hit?.[0]}"`);
  }
  assert(/No commitment either way/.test(list[1]), 'the no-commitment expectation was removed');
  return '3 expectations, no response-time promise';
});

check('the Quest scope note explains the unit of work', () => {
  const src = publicText['index.html'];
  assert(
    src.includes('is the first in a planned series of Quests'),
    'the Quest scope note is missing',
  );
  assert(
    src.includes('rather than an ongoing course'),
    'the standalone-experience framing is missing',
  );
  /* The delivery format is still undecided; the note may not settle it. */
  const text = textOf(src);
  for (const p of [/\bsubscription\b/i, /\bcourse module\b/i, /\bdownload\b/i, /\bapp\b/i]) {
    const hit = text.match(p);
    assert(!hit, `the scope note commits to a delivery format: "${hit?.[0]}"`);
  }
  return 'standalone experience, format still open';
});

check('the share link forwards the page without a recipient or a claim', () => {
  const src = publicText['index.html'];
  const href = src.match(/<a class="share-link" href="(mailto:[^"]+)"/);
  assert(href, 'the share link is missing');
  const url = new URL(href[1].replace(/&amp;/g, '&'));
  assert(url.pathname === '', `the share mailto names a recipient: "${url.pathname}"`);
  const body = url.searchParams.get('body');
  const subject = url.searchParams.get('subject');
  assert(subject && subject.includes('Sparoah Elle'), `share subject drifted: "${subject}"`);
  assert(body && body.includes('https://sparoahelle.com'), 'the share body does not link the site');
  /* The body is copy a stranger receives, so the truthfulness rules apply to it. */
  for (const p of [
    /another app/i, /\bfree\b/i, /\bproven\b/i, /\bguarantee/i, /limited spots|hurry|act now/i,
    /\$\s?\d/, /\bmy daughter\b/i,
  ]) {
    const hit = body.match(p);
    assert(!hit, `the share body carries an unsupported claim: "${hit?.[0]}"`);
  }
  assert(
    src.indexOf('class="share-link"') > src.indexOf('id="founding-families"'),
    'the share link sits above the pilot context (REQ-007)',
  );
  return 'no recipient, no claim, below the pilot section';
});

check('the children\'s-privacy section states each commitment', () => {
  const src = publicText['privacy.html'];
  const block = src.match(/<div class="children-privacy">([\s\S]*?)<\/div>/);
  assert(block, 'the children\'s-privacy section is missing');
  for (const [label, needle] of [
    ['no knowing collection from under-13s', 'does not knowingly collect personal information directly from children under 13'],
    ['no child accounts or child interaction', 'do not invite, request, or permit children to create accounts'],
    ['adults asked for their own details only', 'we ask only for that adult’s own contact details'],
    ['human review named', 'reviewed by a person before it is delivered to a family'],
    ['prompt deletion commitment', 'we will delete it promptly'],
    ['no sale, rent or share', 'We do not sell, rent, or share information relating to children'],
    ['reachable contact for a report', 'mailto:privacy@sparoahelle.com'],
  ]) {
    assert(block[1].includes(needle), `${label}: not found`);
  }
  /* The notice may only describe controls that exist today. */
  const unimplemented = /verifiable parental consent|consent ledger|age gate|deletion portal|certified/i;
  const hit = block[1].match(unimplemented);
  assert(!hit, `an unimplemented control is described: "${hit?.[0]}"`);
  assert(src.includes('Last updated: September 22, 2026'), 'the last-updated date was not advanced');
  return '7 commitments, no unimplemented control';
});

check('unreviewed legal copy cannot be deployed by accident', () => {
  const marked = PUBLIC_HTML.filter((f) => publicText[f].includes('LEGAL-REVIEW-PENDING'));
  const deploy = read('deploy.sh');
  assert(
    /LEGAL-REVIEW-PENDING/.test(deploy) && /exit 1/.test(deploy.split('LEGAL-REVIEW-PENDING')[2] ?? ''),
    'deploy.sh has no gate that aborts on a LEGAL-REVIEW-PENDING marker',
  );
  if (!marked.length) return 'no held copy; the deploy gate is in place';
  /* A marker must sit in an HTML comment, so it never renders to a visitor. */
  for (const file of marked) {
    const inComment = [...publicText[file].matchAll(/<!--([\s\S]*?)-->/g)]
      .some((m) => m[1].includes('LEGAL-REVIEW-PENDING'));
    assert(inComment, `${file}: the hold marker is not inside an HTML comment`);
    assert(!textOf(publicText[file]).includes('LEGAL-REVIEW-PENDING'), `${file}: the marker is visible`);
  }
  return `${marked.join(', ')} held from deploy by the gate`;
});

/* ---- Design tokens (handoff: 32 font sizes, 9 weights, 7 radii) ---- */

const CSS = read('styles.css');
/* The :root blocks define the tokens; every other rule must consume them. */
const CSS_NO_COMMENTS = CSS.replace(/\/\*[\s\S]*?\*\//g, '');
const CSS_RULES = CSS_NO_COMMENTS.replace(/:root\s*\{[^}]*\}/g, '');
const declared = (prop) => [...CSS_RULES.matchAll(new RegExp(`${prop}\\s*:\\s*([^;}]+)`, 'g'))]
  .map((m) => m[1].trim());

check('every font-size resolves to a scale or display token', () => {
  const allowed = /^var\(--(text|display)-[a-z0-9]+\)$/;
  const fluid = /^\d*\.?\d+vw$/;
  const offenders = [];
  for (const value of declared('font-size')) {
    const parts = value.startsWith('clamp(')
      ? value.slice(6, -1).split(',').map((s) => s.trim())
      : [value];
    if (!parts.every((p) => allowed.test(p) || fluid.test(p))) offenders.push(value);
  }
  assert(offenders.length === 0, `raw font-size(s): ${offenders.join(' | ')}`);
  const steps = new Set([...CSS.matchAll(/--text-[a-z0-9]+:/g)].map((m) => m[0]));
  const displays = new Set([...CSS.matchAll(/--display-\d:/g)].map((m) => m[0]));
  assert(steps.size === 7, `the type scale has ${steps.size} steps, not 7`);
  assert(displays.size === 3, `${displays.size} display sizes, not 3`);
  return `${declared('font-size').length} declarations over 7 steps + 3 display sizes`;
});

check('every font-weight resolves to one of three tokens', () => {
  const offenders = declared('font-weight').filter((v) => !/^var\(--weight-(body|medium|bold)\)$/.test(v));
  assert(offenders.length === 0, `raw font-weight(s): ${offenders.join(' | ')}`);
  const tokens = new Set([...CSS.matchAll(/--weight-[a-z]+:/g)].map((m) => m[0]));
  assert(tokens.size === 3, `${tokens.size} weight tokens, not 3`);
  return `${declared('font-weight').length} declarations over 3 weights`;
});

check('every border-radius resolves to one of three tokens', () => {
  const offenders = declared('border-radius')
    .filter((v) => v.split(/\s+/).some((part) => !/^(0|var\(--radius-(pill|card|round)\))$/.test(part)));
  assert(offenders.length === 0, `raw border-radius: ${offenders.join(' | ')}`);
  const tokens = new Set([...CSS.matchAll(/--radius-[a-z]+:/g)].map((m) => m[0]));
  assert(tokens.size === 3, `${tokens.size} radius tokens, not 3`);
  return `${declared('border-radius').length} declarations over 3 radii`;
});

check('the serif stack covers Windows, Android and Linux', () => {
  const stack = CSS.match(/--serif:\s*([^;]+)/)[1];
  /* Iowan Old Style is Apple-only. Without these the fallback is an unstyled serif. */
  for (const family of ['Palatino Linotype', 'Georgia', 'Noto Serif', 'Liberation Serif']) {
    assert(stack.includes(family), `the serif stack has no ${family} fallback`);
  }
  assert(/serif;?\s*$/.test(stack.trim()), 'the serif stack does not end in a generic family');
  /* Self-hosting a licensed face is the eventual fix; a CDN link is not. */
  assert(!/fonts\.(googleapis|gstatic)|@import/.test(CSS), 'styles.css fetches an external font');
  return 'Apple → Windows → Android/Linux → generic';
});

check('the brand mark reads at the weight of the wordmark', () => {
  const stroke = CSS.match(/\.brand-seal svg \{[^}]*stroke-width:\s*([\d.]+)/);
  assert(stroke, '.brand-seal stroke-width not found');
  assert(Number(stroke[1]) >= 2.5, `the seal stroke is ${stroke[1]}, too light beside a bold wordmark`);
  const favicon = read('favicon.svg');
  /* Sub-pixel strokes disappear at the 16px favicon size. */
  for (const m of favicon.matchAll(/stroke-width="([\d.]+)"/g)) {
    assert(Number(m[1]) >= 3, `favicon stroke-width ${m[1]} vanishes at 16px`);
  }
  return `seal ${stroke[1]}, favicon strokes ≥ 3 on a 64 grid`;
});

check('the founding quotation is a filled pull-quote panel', () => {
  const rule = CSS_NO_COMMENTS.match(/\bblockquote\s*\{([^}]*)\}/);
  assert(rule, 'the blockquote rule is missing');
  const body = rule[1];
  /* Approved 2026-09-23: the quotation has to read as a panel, not as a rule with
     text beside it. Each of these is part of that treatment. */
  for (const [label, pattern] of [
    ['a filled background', /background:\s*var\(--sand\)/],
    ['a heavy accent bar', /border-left:\s*[6-9]px solid var\(--gold-deep\)/],
    ['centred text', /text-align:\s*center/],
    ['italic serif', /font-style:\s*italic/],
    ['the plum quotation colour', /color:\s*var\(--plum\)/],
  ]) {
    assert(pattern.test(body), `the pull quote lost ${label}`);
  }
  /* The panel needs breathing room on all four sides, not just a left indent. */
  assert(!/padding-left:/.test(body), 'the pull quote is back to a left indent only');
  assert(/padding:\s*var\(--space/.test(body), 'the pull quote has no panel padding');
  return 'sand fill, gold-deep bar, centred italic plum';
});

check('supporting text uses the warm palette, not an off-palette grey', () => {
  assert(/--warm-muted:\s*#6b5a4a/.test(CSS), '--warm-muted is missing or changed');
  assert(!/#6f625d/.test(CSS_NO_COMMENTS), 'the cool grey #6f625d is still in use');
  for (const rule of ['.brand-copy small', '.trust-line']) {
    const block = CSS.match(new RegExp(`\\${rule}\\s*\\{[^}]*\\}`));
    assert(block && /var\(--warm-muted\)/.test(block[0]), `${rule} does not use --warm-muted`);
  }
  return '--warm-muted on the tagline and the trust line';
});

/* ------------------------------------------------------------------ *
 * Governing-spec presence (WEB-CORR-015)
 * ------------------------------------------------------------------ */

section('WEB-CORR-015 Documentation');

check('the governing specification is in the repository', () => {
  const spec = join(ROOT, 'docs', 'specs', 'spec-website-correction.md');
  assert(existsSync(spec), 'docs/specs/spec-website-correction.md missing');
  assert(statSync(spec).size > 0, 'specification file is empty');
  return 'docs/specs/spec-website-correction.md';
});

check('README names the governing specification and the correction release', () => {
  const readme = read('README.md');
  assert(readme.includes('spec-website-correction.md'), 'README does not reference the governing spec');
  assert(/correction release/i.test(readme), 'README has no correction-release notes');
  assert(/tangible/i.test(readme) && /lasting/i.test(readme), 'README does not record tangible → lasting');
  return 'referenced';
});

check('no stray file was added to the deployable root', () => {
  const allowed = new Set([
    ...PUBLIC_FILES, 'README.md', 'CLAUDE.md', 'LICENSE', 'deploy.sh', '.env', '.gitignore',
    'package-lock.json', 'AzuriteConfig',
  ]);
  const stray = readdirSync(ROOT)
    .filter((f) => statSync(join(ROOT, f)).isFile())
    .filter((f) => !allowed.has(f) && !f.startsWith('__azurite') && !f.startsWith('Sparoah_Elle_Website'));
  if (stray.length) notes.push(`untracked root files present: ${stray.join(', ')}`);
  return stray.length ? `${stray.length} non-deployed extra file(s), not published` : 'clean';
});

/* ------------------------------------------------------------------ */

console.log(`\n${'-'.repeat(64)}`);
for (const note of notes) console.log(`  NOTE  ${note}`);
console.log(`  ${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('  Static validation and copy/policy assertions: OK');
