/**
 * Rendering, interaction and accessibility tests for the Sparoah Elle site.
 * Implements sections 11.3, 11.4 and 11.5 of docs/specs/spec-website-correction.md.
 *
 * Drives a locally installed Edge or Chrome over the DevTools protocol using
 * Node's built-in WebSocket. No npm dependencies — the site ships none, and the
 * CSP forbids external origins, so the tests stay dependency-free too.
 *
 *   node tests/browser.mjs
 *
 * Screenshots are written to tests/screenshots/ (gitignored).
 */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SHOTS = join(ROOT, 'tests', 'screenshots');
const INDEX_URL = pathToFileURL(join(ROOT, 'index.html')).href;
const PRIVACY_URL = pathToFileURL(join(ROOT, 'privacy.html')).href;

const BROWSERS = [
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
];

const VIEWPORTS = [
  { name: '1440x1000', width: 1440, height: 1000, mobile: false },
  { name: '1024x768', width: 1024, height: 768, mobile: false },
  { name: '768x1024', width: 768, height: 1024, mobile: true },
  { name: '390x844', width: 390, height: 844, mobile: true },
  { name: '320x800', width: 320, height: 800, mobile: true },
];

let passed = 0;
const failures = [];

function check(name, fn) {
  return Promise.resolve()
    .then(fn)
    .then((detail) => {
      passed++;
      console.log(`  PASS  ${name}${detail ? ` — ${detail}` : ''}`);
    })
    .catch((err) => {
      failures.push(`${name}: ${err.message}`);
      console.log(`  FAIL  ${name} — ${err.message}`);
    });
}
function assert(cond, message) {
  if (!cond) throw new Error(message);
}
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/* ------------------------------------------------------------------ *
 * Minimal DevTools-protocol client.
 * ------------------------------------------------------------------ */

class CDP {
  constructor(ws) {
    this.ws = ws;
    this.next = 1;
    this.pending = new Map();
    this.listeners = new Map();
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.id && this.pending.has(msg.id)) {
        const { resolve: ok, reject } = this.pending.get(msg.id);
        this.pending.delete(msg.id);
        msg.error ? reject(new Error(`${msg.error.message} (${msg.error.code})`)) : ok(msg.result);
        return;
      }
      for (const fn of this.listeners.get(msg.method) ?? []) fn(msg.params, msg.sessionId);
    });
  }

  static connect(url) {
    return new Promise((ok, fail) => {
      const ws = new WebSocket(url);
      ws.addEventListener('open', () => ok(new CDP(ws)));
      ws.addEventListener('error', () => fail(new Error(`cannot connect to ${url}`)));
    });
  }

  send(method, params = {}, sessionId) {
    const id = this.next++;
    const payload = { id, method, params };
    if (sessionId) payload.sessionId = sessionId;
    this.ws.send(JSON.stringify(payload));
    return new Promise((ok, fail) => {
      this.pending.set(id, { resolve: ok, reject: fail });
      setTimeout(() => {
        if (this.pending.delete(id)) fail(new Error(`${method} timed out`));
      }, 30000);
    });
  }

  on(method, fn) {
    if (!this.listeners.has(method)) this.listeners.set(method, []);
    this.listeners.get(method).push(fn);
  }

  close() { this.ws.close(); }
}

/** A page target with helpers for the operations these tests need. */
class Page {
  constructor(cdp, sessionId) {
    this.cdp = cdp;
    this.sid = sessionId;
    this.consoleErrors = [];
    cdp.on('Runtime.exceptionThrown', (p, sid) => {
      if (sid !== this.sid) return;
      this.consoleErrors.push(p.exceptionDetails?.exception?.description ?? p.exceptionDetails?.text);
    });
    cdp.on('Log.entryAdded', (p, sid) => {
      if (sid !== this.sid || p.entry.level !== 'error') return;
      this.consoleErrors.push(`${p.entry.source}: ${p.entry.text}`);
    });
  }

  cmd(method, params) { return this.cdp.send(method, params, this.sid); }

  async setViewport({ width, height, mobile }) {
    await this.cmd('Emulation.setDeviceMetricsOverride', {
      width, height, deviceScaleFactor: 1, mobile,
      screenWidth: width, screenHeight: height,
    });
  }

  async goto(url) {
    this.consoleErrors.length = 0;
    const loaded = new Promise((ok) => {
      const handler = (_p, sid) => { if (sid === this.sid) ok(); };
      this.cdp.on('Page.loadEventFired', handler);
    });
    await this.cmd('Page.navigate', { url });
    await loaded;
    /* Smooth scrolling animates; anchor assertions need the final position. */
    await this.eval(`document.documentElement.style.scrollBehavior = 'auto'; true`);
    await sleep(120);
  }

  async eval(expression) {
    const { result, exceptionDetails } = await this.cmd('Runtime.evaluate', {
      expression, returnByValue: true, awaitPromise: true,
    });
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description ?? exceptionDetails.text);
    }
    return result.value;
  }

  async key(key, code, windowsVirtualKeyCode) {
    for (const type of ['rawKeyDown', 'keyUp']) {
      await this.cmd('Input.dispatchKeyEvent', { type, key, code, windowsVirtualKeyCode });
    }
    await sleep(30);
  }

  async screenshot(file) {
    const { data } = await this.cmd('Page.captureScreenshot', {
      format: 'png', captureBeyondViewport: true,
    });
    writeFileSync(file, Buffer.from(data, 'base64'));
    return file;
  }
}

async function launch() {
  const exe = BROWSERS.find((p) => existsSync(p));
  assert(exe, `no Edge or Chrome found in: ${BROWSERS.join(', ')}`);
  const profile = mkdtempSync(join(tmpdir(), 'sparoah-cdp-'));
  const child = spawn(exe, [
    '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
    '--disable-extensions', '--disable-background-networking', '--disable-sync',
    '--disable-features=Translate,MediaRouter', '--allow-file-access-from-files',
    '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
  ], { stdio: 'ignore' });

  const portFile = join(profile, 'DevToolsActivePort');
  let port = null;
  for (let i = 0; i < 150 && port === null; i++) {
    await sleep(100);
    if (!existsSync(portFile)) continue;
    const [line] = readFileSync(portFile, 'utf8').split('\n');
    if (/^\d+$/.test(line.trim())) port = Number(line.trim());
  }
  assert(port, 'browser did not report a DevTools port within 15s');

  const version = await (await fetch(`http://127.0.0.1:${port}/json/version`)).json();
  const cdp = await CDP.connect(version.webSocketDebuggerUrl);
  const { targetId } = await cdp.send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await cdp.send('Target.attachToTarget', { targetId, flatten: true });
  const page = new Page(cdp, sessionId);
  await page.cmd('Page.enable');
  await page.cmd('Runtime.enable');
  await page.cmd('Log.enable');

  return {
    page,
    browser: `${exe.includes('msedge') ? 'Edge' : 'Chrome'} (headless)`,
    async close() {
      try { cdp.close(); } catch { /* already gone */ }
      child.kill();
      await sleep(300);
      try { rmSync(profile, { recursive: true, force: true }); } catch { /* profile in use */ }
    },
  };
}

/* ------------------------------------------------------------------ *
 * In-page probes. Kept as strings so they run inside the document.
 * ------------------------------------------------------------------ */

const OVERFLOW_PROBE = `(() => {
  const doc = document.documentElement;
  const limit = doc.clientWidth;
  const offenders = [];
  /* An element wider than the viewport only scrolls the page if nothing above it
     clips. The hero glows, for instance, sit inside .hero { overflow: hidden }. */
  const clipped = (el) => {
    for (let p = el.parentElement; p && p !== doc; p = p.parentElement) {
      const o = getComputedStyle(p);
      if (o.overflow !== 'visible' || o.overflowX !== 'visible') return true;
    }
    return false;
  };
  for (const el of document.body.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (getComputedStyle(el).position === 'fixed') continue;
    if (clipped(el)) continue;
    if (r.right > limit + 1 || r.left < -1) {
      offenders.push(el.tagName.toLowerCase() + (el.className && typeof el.className === 'string'
        ? '.' + el.className.trim().split(/\\s+/).join('.') : '')
        + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']');
    }
  }
  return { scrollWidth: doc.scrollWidth, clientWidth: limit, offenders: offenders.slice(0, 6) };
})()`;

/** Worst-case rendered background behind each text sample. Gradients cannot be
 *  read from getComputedStyle, so the lightest/darkest stop composite is used. */
const CONTRAST_SAMPLES = [
  ['.hero .eyebrow', '#fffdf9'],
  ['.hero-lede', '#fffdf9'],
  ['.quest-definition', '#fffdf9'],
  ['.trust-line', '#fffdf9'],
  ['.brand-copy small', '#fbf7ef'],
  ['.definition p:last-child', '#1b1715'],
  ['.definition .eyebrow', '#1b1715'],
  ['blockquote', '#efe5d8'],
  ['.story-bridge', '#fbf7ef'],
  ['.quest-section .eyebrow', '#f2eade'],
  ['.section-heading.centered > p:last-child', '#f2eade'],
  ['.status-pill', '#6a483b'],
  ['.quest-card-copy p', '#6a483b'],
  ['.text-link', '#6a483b'],
  ['.includes-note', '#fffdf9'],
  ['.includes-qualifier', '#fffdf9'],
  ['.includes-list h4', '#fffdf9'],
  ['.includes-list p', '#fffdf9'],
  ['.steps-grid span', '#fbf7ef'],
  ['.steps-grid p', '#fbf7ef'],
  ['.service-arc', '#fbf7ef'],
  ['.service-callout p', '#fbf7ef'],
  ['.promise .eyebrow', '#1b1715'],
  ['.promise-list h3', '#1b1715'],
  ['.promise-list p', '#1b1715'],
  ['.founder .eyebrow', '#fffdf9'],
  ['.founder-card p', '#fffdf9'],
  ['.quest-scope', '#f2eade'],
  ['.faq .eyebrow', '#fffdf9'],
  ['.faq-list h3', '#fbf7ef'],
  ['.faq-list p', '#fbf7ef'],
  ['.cta-card .eyebrow', '#6d3546'],
  ['.cta-expectations', '#6d3546'],
  ['.cta-actions p', '#885c5c'],
  /* Both sit in the actions column, under the card's pale radial highlight. */
  ['.cta-next-label', '#885c5c'],
  ['.cta-next li', '#885c5c'],
  ['.cta-fallback a', '#885c5c'],
  ['.share-lead', '#fbf7ef'],
  ['.share-link', '#fbf7ef'],
  ['.footer-links a', '#120f0e'],
  ['.footer-grid p', '#120f0e'],
];

const CONTRAST_PROBE = `((samples) => {
  const chan = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const lum = ([r, g, b]) => 0.2126 * chan(r) + 0.7152 * chan(g) + 0.0722 * chan(b);
  const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const parse = (c) => {
    const m = c.match(/rgba?\\(([^)]+)\\)/);
    if (!m) return null;
    const parts = m[1].split(/[,\\s/]+/).filter(Boolean).map(Number);
    return { rgb: parts.slice(0, 3), a: parts.length > 3 ? parts[3] : 1 };
  };
  const out = [];
  for (const [selector, bgHex] of samples) {
    const el = document.querySelector(selector);
    if (!el) { out.push({ selector, missing: true }); continue; }
    const cs = getComputedStyle(el);
    const fg = parse(cs.color);
    if (!fg) { out.push({ selector, missing: true }); continue; }
    const bg = hex(bgHex);
    const blended = fg.rgb.map((v, i) => v * fg.a + bg[i] * (1 - fg.a));
    const [l1, l2] = [lum(blended), lum(bg)].sort((a, b) => b - a);
    const ratio = (l1 + 0.05) / (l2 + 0.05);
    const size = parseFloat(cs.fontSize);
    const weight = parseInt(cs.fontWeight, 10) || 400;
    const large = size >= 24 || (size >= 18.66 && weight >= 700);
    out.push({
      selector, ratio: Math.round(ratio * 100) / 100,
      required: large ? 3 : 4.5, size: Math.round(size * 10) / 10, large,
    });
  }
  return out;
})(${JSON.stringify(CONTRAST_SAMPLES)})`;

/* ------------------------------------------------------------------ *
 * Test run
 * ------------------------------------------------------------------ */

const session = await launch();
const { page } = session;
mkdirSync(SHOTS, { recursive: true });
console.log(`Browser: ${session.browser}\n`);

try {
  /* -------------------------------------------------- 11.3 Rendering */
  console.log('11.3 Browser rendering');

  for (const vp of VIEWPORTS) {
    await page.setViewport(vp);
    await page.goto(INDEX_URL);

    await check(`no horizontal overflow at ${vp.name}`, async () => {
      const r = await page.eval(OVERFLOW_PROBE);
      assert(
        r.scrollWidth <= r.clientWidth + 1 && r.offenders.length === 0,
        `scrollWidth ${r.scrollWidth} vs clientWidth ${r.clientWidth}; ${r.offenders.join(' | ') || 'no element offenders'}`,
      );
      return `scrollWidth ${r.scrollWidth} = clientWidth ${r.clientWidth}`;
    });

    await check(`key sections render at ${vp.name}`, async () => {
      const r = await page.eval(`(() => {
        const seen = {};
        const want = {
          hero: '.hero-copy h1',
          queenBand: '.orbit-center strong',
          queenDefinition: '.definition p:last-child',
          components: '.includes-list li',
          journey: '.steps-grid article',
          contribution: '.service-callout h3',
          founder: '.founder-card p',
          questScope: '.quest-scope',
          faq: '.faq-list article',
          cta: '.cta-actions .button',
          whatHappensNext: '.cta-next li',
          emailFallback: '.cta-fallback a',
          shareLink: '.share-link',
          footer: '.site-footer',
        };
        for (const [k, sel] of Object.entries(want)) {
          const els = [...document.querySelectorAll(sel)];
          seen[k] = els.length && els.every((e) => {
            const r = e.getBoundingClientRect();
            return r.width > 0 && r.height > 0;
          }) ? els.length : 0;
        }
        return seen;
      })()`);
      const missing = Object.entries(r).filter(([, v]) => !v).map(([k]) => k);
      assert(missing.length === 0, `not rendered: ${missing.join(', ')}`);
      assert(r.components === 6, `expected 6 component cards, rendered ${r.components}`);
      assert(r.journey === 6, `expected 6 journey cards, rendered ${r.journey}`);
      assert(r.faq === 6, `expected 6 FAQ cards, rendered ${r.faq}`);
      assert(r.whatHappensNext === 3, `expected 3 next-step lines, rendered ${r.whatHappensNext}`);
      return `components ${r.components}, journey ${r.journey}, FAQ ${r.faq}, all sections visible`;
    });

    await page.screenshot(join(SHOTS, `index-${vp.name}.png`));
  }

  await check('the Queen band leaves no dead space after chip removal', async () => {
    await page.setViewport({ width: 390, height: 844, mobile: true });
    await page.goto(INDEX_URL);
    const r = await page.eval(`(() => {
      const art = document.querySelector('.hero-art').getBoundingClientRect();
      const orbit = document.querySelector('.quest-orbit').getBoundingClientRect();
      const centre = document.querySelector('.orbit-center').getBoundingClientRect();
      const kicker = document.querySelector('.orbit-kicker');
      return {
        slack: Math.round(art.height - orbit.height),
        centreFits: kicker.scrollWidth <= Math.ceil(centre.width) + 1,
        kickerWidth: kicker.scrollWidth, centreWidth: Math.round(centre.width),
      };
    })()`);
    assert(r.slack <= 8, `${r.slack}px of empty space around the orbit`);
    assert(r.centreFits, `"The Queen Within" (${r.kickerWidth}px) overflows the ${r.centreWidth}px centre`);
    return `orbit fills its container (${r.slack}px slack), centre text fits`;
  });

  for (const vp of [VIEWPORTS[0], VIEWPORTS[3]]) {
    await page.setViewport(vp);
    await page.goto(PRIVACY_URL);
    await check(`privacy page renders with no overflow at ${vp.name}`, async () => {
      const r = await page.eval(OVERFLOW_PROBE);
      assert(r.scrollWidth <= r.clientWidth + 1 && r.offenders.length === 0,
        `scrollWidth ${r.scrollWidth} vs ${r.clientWidth}; ${r.offenders.join(' | ')}`);
      return `scrollWidth ${r.scrollWidth}`;
    });
    await page.screenshot(join(SHOTS, `privacy-${vp.name}.png`));
  }

  /* ------------------------------------------------ 11.4 Interaction */
  console.log('\n11.4 Interaction');

  await page.setViewport({ width: 390, height: 844, mobile: true });
  await page.goto(INDEX_URL);

  await check('skip link becomes visible on focus', async () => {
    const r = await page.eval(`(() => {
      const link = document.querySelector('.skip-link');
      const before = link.getBoundingClientRect().top;
      link.focus();
      const after = link.getBoundingClientRect().top;
      return { before, after, href: link.getAttribute('href'), target: !!document.querySelector('#main') };
    })()`);
    assert(r.before < 0, 'skip link is not hidden before focus');
    assert(r.after >= 0, `skip link stays off-screen on focus (top ${r.after})`);
    assert(r.target, 'skip link target #main does not exist');
    return `top ${Math.round(r.before)} → ${Math.round(r.after)}, targets #main`;
  });

  await check('mobile menu opens by pointer', async () => {
    const r = await page.eval(`(() => {
      const btn = document.querySelector('[data-menu-button]');
      const nav = document.querySelector('[data-nav]');
      const visible = getComputedStyle(btn).display !== 'none';
      btn.click();
      return {
        visible, expanded: btn.getAttribute('aria-expanded'),
        navOpen: getComputedStyle(nav).display !== 'none',
        links: nav.querySelectorAll('a').length,
      };
    })()`);
    assert(r.visible, 'hamburger is not displayed at 390px');
    assert(r.expanded === 'true', `aria-expanded is "${r.expanded}"`);
    assert(r.navOpen, 'navigation did not become visible');
    return `aria-expanded=true, ${r.links} links visible`;
  });

  await check('Escape closes the menu and returns focus to the button', async () => {
    await page.key('Escape', 'Escape', 27);
    const r = await page.eval(`(() => {
      const btn = document.querySelector('[data-menu-button]');
      const nav = document.querySelector('[data-nav]');
      return {
        expanded: btn.getAttribute('aria-expanded'),
        navOpen: getComputedStyle(nav).display !== 'none',
        focused: document.activeElement === btn,
      };
    })()`);
    assert(r.expanded === 'false' && !r.navOpen, 'menu stayed open after Escape');
    assert(r.focused, 'focus was not returned to the menu button');
    return 'closed, focus restored';
  });

  await check('an outside click closes the menu', async () => {
    const r = await page.eval(`(() => {
      const btn = document.querySelector('[data-menu-button]');
      const nav = document.querySelector('[data-nav]');
      btn.click();
      const opened = btn.getAttribute('aria-expanded') === 'true';
      document.querySelector('main').click();
      return { opened, expanded: btn.getAttribute('aria-expanded'), navOpen: getComputedStyle(nav).display !== 'none' };
    })()`);
    assert(r.opened, 'menu did not reopen for the test');
    assert(r.expanded === 'false' && !r.navOpen, 'menu stayed open after an outside click');
    return 'closed';
  });

  await check('every navigation anchor clears the sticky header', async () => {
    const r = await page.eval(`(async () => {
      const header = document.querySelector('.site-header').getBoundingClientRect().height;
      const out = [];
      for (const link of document.querySelectorAll('.site-nav a, .hero-actions a, .quest-card-copy .text-link')) {
        const href = link.getAttribute('href');
        if (!href.startsWith('#')) continue;
        const target = document.querySelector(href);
        window.location.hash = '';
        window.scrollTo(0, 0);
        link.click();
        await new Promise((r) => setTimeout(r, 60));
        const top = target.getBoundingClientRect().top;
        const heading = target.querySelector('h2, h3, .eyebrow');
        out.push({
          href, top: Math.round(top),
          headingTop: heading ? Math.round(heading.getBoundingClientRect().top) : null,
          header: Math.round(header),
        });
      }
      return out;
    })()`);
    assert(r.length >= 5, `only ${r.length} in-page links exercised`);
    for (const hit of r) {
      assert(hit.top >= hit.header - 2, `${hit.href} lands ${hit.top}px from the top, under the ${hit.header}px header`);
      if (hit.headingTop !== null) {
        assert(hit.headingTop >= hit.header - 2, `${hit.href}: heading hidden behind the header`);
      }
    }
    return `${r.length} anchors, all below the ${r[0].header}px header`;
  });

  await check('hero and Quest CTAs reach the Founding Family section, not a mail client', async () => {
    const r = await page.eval(`(() => {
      const hero = document.querySelector('.hero-actions .button-primary');
      const quest = document.querySelector('.quest-card-copy .text-link');
      const secondary = document.querySelector('.hero-actions .button-secondary');
      return {
        hero: hero.getAttribute('href'), heroLabel: hero.textContent.trim(),
        quest: quest.getAttribute('href'), questLabel: quest.textContent.replace(/\\s+/g, ' ').trim(),
        secondary: secondary.getAttribute('href'), secondaryLabel: secondary.textContent.trim(),
        nav: document.querySelector('.nav-cta').getAttribute('href'),
        navLabel: document.querySelector('.nav-cta').textContent.trim(),
      };
    })()`);
    assert(r.hero === '#founding-families', `hero CTA points at ${r.hero}`);
    assert(r.quest === '#founding-families', `Quest CTA points at ${r.quest}`);
    assert(r.nav === '#founding-families', `nav CTA points at ${r.nav}`);
    assert(r.secondary === '#quest', `secondary CTA points at ${r.secondary}`);
    assert(r.heroLabel === 'Request Founding Family Information', `hero label "${r.heroLabel}"`);
    assert(r.questLabel.startsWith('Request Founding Family Information'), `Quest label "${r.questLabel}"`);
    assert(r.secondaryLabel === 'Explore the First Quest', `secondary label "${r.secondaryLabel}"`);
    assert(r.navLabel === 'Founding Family Pilot', `nav label "${r.navLabel}"`);
    return 'three scroll CTAs + "Explore the First Quest"';
  });

  await check('the final CTA opens a correctly encoded email draft', async () => {
    const r = await page.eval(`(() => {
      const a = document.querySelector('.cta-actions .button');
      const url = new URL(a.href);
      return {
        label: a.textContent.trim(), scheme: url.protocol, to: url.pathname,
        subject: url.searchParams.get('subject'), body: url.searchParams.get('body'),
        fallback: document.querySelector('.cta-fallback a').textContent.trim(),
        fallbackHref: document.querySelector('.cta-fallback a').href,
      };
    })()`);
    assert(r.scheme === 'mailto:', `scheme is ${r.scheme}`);
    assert(r.to === 'hello@sparoahelle.com', `recipient is ${r.to}`);
    assert(r.subject === 'Founding Family Interest', `subject is "${r.subject}"`);
    assert(
      r.body === 'I am an adult interested in learning more about the Sparoah Elle Founding Family Pilot. I have not included personal information about a child.',
      `body is "${r.body}"`,
    );
    assert(r.label === 'Request Founding Family Information', `label is "${r.label}"`);
    assert(r.fallback === 'hello@sparoahelle.com', `visible fallback reads "${r.fallback}"`);
    assert(r.fallbackHref === 'mailto:hello@sparoahelle.com', `fallback href is ${r.fallbackHref}`);
    return 'recipient, subject and body decode intact; address visible';
  });

  await check('privacy and return-home links resolve', async () => {
    await page.setViewport({ width: 1440, height: 1000, mobile: false });
    await page.goto(INDEX_URL);
    const href = await page.eval(`document.querySelector('.footer-links a[href$="privacy.html"]').href`);
    await page.goto(href);
    const r = await page.eval(`(() => ({
      title: document.title,
      home: document.querySelector('.nav-cta').getAttribute('href'),
      brand: document.querySelector('.brand').getAttribute('href'),
      canonical: document.querySelector('link[rel=canonical]').getAttribute('href'),
      privacyEmail: document.querySelector('a[href^="mailto:privacy@"]').textContent.trim(),
    }))()`);
    assert(r.title === 'Privacy | Sparoah Elle', `privacy page title is "${r.title}"`);
    assert(r.home === '/' && r.brand === '/', `home links are "${r.brand}" / "${r.home}", expected "/"`);
    assert(r.canonical === 'https://sparoahelle.com/privacy.html', `canonical is ${r.canonical}`);
    assert(r.privacyEmail === 'privacy@sparoahelle.com', `privacy contact is ${r.privacyEmail}`);
    return 'privacy loads; both home links use the canonical root';
  });

  /* --------------------------------------------- 11.5 Accessibility */
  console.log('\n11.5 Accessibility');

  await page.setViewport({ width: 1440, height: 1000, mobile: false });
  await page.goto(INDEX_URL);

  await check('keyboard tab order starts at the skip link and stays logical', async () => {
    await page.eval(`document.body.focus(); window.scrollTo(0, 0); true`);
    const order = [];
    for (let i = 0; i < 10; i++) {
      await page.key('Tab', 'Tab', 9);
      order.push(await page.eval(`(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          tag: el.tagName.toLowerCase(),
          text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 42),
          outline: cs.outlineStyle + ' ' + cs.outlineWidth,
          top: Math.round(el.getBoundingClientRect().top + window.scrollY),
          bottom: Math.round(el.getBoundingClientRect().bottom + window.scrollY),
        };
      })()`));
    }
    const stops = order.filter(Boolean);
    assert(stops.length >= 8, `only ${stops.length} focusable stops in the first 10 tabs`);
    assert(/Skip to main content/.test(stops[0].text), `first stop is "${stops[0].text}"`);
    /* Siblings on one header row have different box tops (the nav pill is taller
       than the plain links), so only a stop entirely above its predecessor counts. */
    const regressions = stops.filter((s, i) => i > 1 && s.bottom <= stops[i - 1].top);
    assert(
      regressions.length === 0,
      `tab order jumps backwards at: ${regressions.map((r) => r.text).join(', ')}`,
    );
    return `${stops.length} stops, starting at "${stops[0].text}"`;
  });

  await check('focus indicators are visible on keyboard focus', async () => {
    await page.eval(`document.body.focus(); window.scrollTo(0, 0); true`);
    const seen = [];
    for (let i = 0; i < 6; i++) {
      await page.key('Tab', 'Tab', 9);
      const r = await page.eval(`(() => {
        const el = document.activeElement;
        if (!el || el === document.body) return null;
        const cs = getComputedStyle(el);
        return {
          text: (el.textContent || '').replace(/\\s+/g, ' ').trim().slice(0, 30),
          style: cs.outlineStyle, width: parseFloat(cs.outlineWidth) || 0, color: cs.outlineColor,
        };
      })()`);
      if (r) seen.push(r);
    }
    const invisible = seen.filter((s) => s.style === 'none' || s.width < 1);
    assert(invisible.length === 0, `no visible outline on: ${invisible.map((s) => s.text).join(', ')}`);
    return `${seen.length} focused elements, all outlined (${seen[0].width}px ${seen[0].style})`;
  });

  await check('the component list and journey list expose different semantics', async () => {
    const r = await page.eval(`(() => {
      const list = document.querySelector('.includes-list');
      const items = [...list.querySelectorAll(':scope > li')];
      return {
        listTag: list.tagName.toLowerCase(),
        itemCount: items.length,
        headings: items.map((li) => li.querySelector('h4')?.textContent.trim()).filter(Boolean).length,
        markerText: getComputedStyle(items[0], '::before').content,
        listStyle: getComputedStyle(list).listStyleType,
        journeyNumbers: [...document.querySelectorAll('.steps-grid article > span')].map((s) => s.textContent.trim()),
        componentNumbers: items.filter((li) => /\\b0[1-6]\\b/.test(li.textContent)).length,
      };
    })()`);
    assert(r.listTag === 'ul', `components render as <${r.listTag}>, expected <ul>`);
    assert(r.itemCount === 6 && r.headings === 6, `${r.itemCount} items / ${r.headings} headings`);
    assert(r.componentNumbers === 0, 'a component still shows a number');
    assert(['""', 'none'].includes(r.markerText), `decorative marker announces text: ${r.markerText}`);
    assert(r.journeyNumbers.join(',') === '01,02,03,04,05,06', `journey numbering changed: ${r.journeyNumbers}`);
    return 'unordered components vs numbered journey';
  });

  await check('protective microcopy is visible, not hidden, on mobile', async () => {
    await page.setViewport({ width: 320, height: 800, mobile: true });
    await page.goto(INDEX_URL);
    const r = await page.eval(`(() => {
      const needles = [
        'Adults only. Please do not email personal information about a child.',
        'No child information is needed at this stage.',
        'Requesting information does not guarantee selection or enroll a child.',
        'Please provide only your own contact information.',
        'These components are planned for the Founding Family Pilot',
        'Children are not handed over to an open-ended AI companion.',
      ];
      const nodes = [...document.querySelectorAll('p, li')];
      return needles.map((n) => {
        const el = nodes.find((e) => e.textContent.includes(n));
        if (!el) return { n, found: false };
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        return {
          n, found: true,
          shown: cs.display !== 'none' && cs.visibility !== 'hidden' && parseFloat(cs.opacity) > 0
                 && r.width > 0 && r.height > 0,
          fontSize: Math.round(parseFloat(cs.fontSize) * 10) / 10,
          wraps: r.right <= document.documentElement.clientWidth + 1,
        };
      });
    })()`);
    for (const item of r) {
      assert(item.found, `microcopy missing at 320px: "${item.n.slice(0, 40)}"`);
      assert(item.shown, `microcopy hidden at 320px: "${item.n.slice(0, 40)}"`);
      assert(item.wraps, `microcopy overflows at 320px: "${item.n.slice(0, 40)}"`);
      assert(item.fontSize >= 11.5, `microcopy at ${item.fontSize}px: "${item.n.slice(0, 40)}"`);
    }
    return `${r.length} protective statements visible and wrapping at 320px`;
  });

  await check('the standalone text links have 44px tap targets', async () => {
    const r = await page.eval(`(() => ['.cta-fallback a', '.share-link'].map((sel) => {
      const a = document.querySelector(sel);
      const box = a.getBoundingClientRect();
      const cs = getComputedStyle(a);
      return {
        sel, w: Math.round(box.width), h: Math.round(box.height),
        decoration: cs.textDecorationLine,
      };
    }))()`);
    for (const link of r) {
      assert(link.h >= 44, `${link.sel} tap target is ${link.h}px tall, WCAG 2.5.8 asks for 44`);
      assert(link.w >= 44, `${link.sel} tap target is ${link.w}px wide`);
      assert(link.decoration.includes('underline'), `${link.sel} is signalled by colour alone`);
    }
    return r.map((l) => `${l.sel} ${l.w}×${l.h}px`).join(', ');
  });

  await check('the share link opens a draft with no recipient', async () => {
    const r = await page.eval(`(() => {
      const a = document.querySelector('.share-link');
      const url = new URL(a.href);
      return { scheme: url.protocol, to: url.pathname, subject: url.searchParams.get('subject'), body: url.searchParams.get('body') };
    })()`);
    assert(r.scheme === 'mailto:', `scheme is ${r.scheme}`);
    assert(r.to === '', `the share draft is pre-addressed to "${r.to}"`);
    assert(r.body.includes('https://sparoahelle.com'), 'the share draft does not link the site');
    assert(!/hello@|privacy@/.test(r.body), 'the share draft leaks a mailbox into a stranger\'s inbox');
    return `empty recipient, ${r.body.length} character body`;
  });

  await check('text contrast meets WCAG AA', async () => {
    await page.setViewport({ width: 1440, height: 1000, mobile: false });
    await page.goto(INDEX_URL);
    const results = await page.eval(CONTRAST_PROBE);
    const missing = results.filter((r) => r.missing).map((r) => r.selector);
    assert(missing.length === 0, `selector not found: ${missing.join(', ')}`);
    const failed = results.filter((r) => r.ratio < r.required);
    assert(
      failed.length === 0,
      failed.map((r) => `${r.selector} ${r.ratio}:1 (needs ${r.required}:1 at ${r.size}px)`).join('; '),
    );
    const worst = results.reduce((a, b) => (a.ratio <= b.ratio ? a : b));
    return `${results.length} samples, lowest ${worst.ratio}:1 on ${worst.selector} (needs ${worst.required}:1)`;
  });

  await check('reduced-motion preference is honoured', async () => {
    await page.cmd('Emulation.setEmulatedMedia', {
      features: [{ name: 'prefers-reduced-motion', value: 'reduce' }],
    });
    await page.goto(INDEX_URL);
    const r = await page.eval(`(() => ({
      scroll: getComputedStyle(document.documentElement).scrollBehavior,
      transition: getComputedStyle(document.querySelector('.button')).transitionDuration,
    }))()`);
    await page.cmd('Emulation.setEmulatedMedia', { features: [] });
    assert(r.scroll === 'auto', `scroll-behavior stays "${r.scroll}" under reduced motion`);
    assert(parseFloat(r.transition) < 0.05, `transitions still run for ${r.transition}`);
    return `scroll-behavior ${r.scroll}, transitions ${r.transition}`;
  });

  await check('no browser console errors on either page', async () => {
    await page.goto(INDEX_URL);
    await sleep(300);
    const home = [...page.consoleErrors];
    await page.goto(PRIVACY_URL);
    await sleep(300);
    const privacy = [...page.consoleErrors];
    const all = [...home, ...privacy];
    assert(all.length === 0, all.join(' | '));
    return 'index.html and privacy.html both clean';
  });
} finally {
  await session.close();
}

console.log(`\n${'-'.repeat(64)}`);
console.log(`  Screenshots: tests/screenshots/`);
console.log(`  ${passed} passed, ${failures.length} failed`);
if (failures.length) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  - ${f}`);
  process.exit(1);
}
console.log('  Rendering, interaction and accessibility: OK');
