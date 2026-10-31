'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { JSDOM, VirtualConsole } = require('jsdom');

const ROOT = path.join(__dirname, '..');
const SRC = fs.readFileSync(path.join(ROOT, 'seasonal-effects.js'), 'utf8');
const fx = require(path.join(ROOT, 'seasonal-effects.js'));
const injectorUrl = 'file://' + path.join(ROOT, 'scripts', 'inject-seasonal-effects.mjs');

const day = (y, m, d) => new Date(y, m - 1, d, 12);
const seasonOn = (date, search) => {
  const hit = fx.pick(date, search);
  return hit ? hit.s.id : null;
};

const at = (y, m, d, h, min) => new Date(y, m - 1, d, h, min);

// Real Canadian Thanksgiving Mondays (2nd Monday of October), from a calendar.
const THANKSGIVING_MONDAY = { 2026: 12, 2027: 11, 2028: 9, 2029: 8, 2030: 14, 2031: 13 };

test('Thanksgiving runs Friday through Thanksgiving Monday, moving with the calendar', () => {
  for (const [y, mon] of Object.entries(THANKSGIVING_MONDAY).map(([y, m]) => [+y, m])) {
    assert.equal(seasonOn(at(y, 10, mon - 4, 23, 59)), 'halloween', `${y} Thu before`);
    assert.equal(seasonOn(at(y, 10, mon - 3, 0, 0)), 'thanksgiving', `${y} Fri`);
    assert.equal(seasonOn(day(y, 10, mon - 1)), 'thanksgiving', `${y} Sun`);
    assert.equal(seasonOn(at(y, 10, mon, 23, 59)), 'thanksgiving', `${y} Mon`);
    assert.equal(seasonOn(at(y, 10, mon + 1, 0, 0)), 'halloween', `${y} Tue after`);
  }
});

test('Thanksgiving Monday is always the 2nd Monday of October', () => {
  for (let y = 2026; y <= 2060; y++) {
    const fri = fx.SEASONS.find(s => s.id === 'thanksgiving').range(y)[0];
    const mon = new Date(fri.getFullYear(), fri.getMonth(), fri.getDate() + 3);
    assert.equal(mon.getMonth(), 9, `${y} month`);
    assert.equal(mon.getDay(), 1, `${y} weekday`);
    assert.ok(mon.getDate() >= 8 && mon.getDate() <= 14, `${y} date ${mon.getDate()}`);
  }
});

test('Halloween runs Oct 1 through Nov 4 every year, automatically', () => {
  for (const y of [2026, 2027, 2028, 2030]) {
    assert.equal(seasonOn(at(y, 9, 30, 23, 59)), null);
    assert.equal(seasonOn(at(y, 10, 1, 0, 0)), 'halloween');
    assert.equal(seasonOn(day(y, 10, 31)), 'halloween');
    assert.equal(seasonOn(at(y, 11, 4, 23, 59)), 'halloween');
    assert.equal(seasonOn(at(y, 11, 5, 0, 0)), null);
  }
});

test('Christmas runs Dec 1 through Jan 4, across the new year, every year', () => {
  for (const y of [2026, 2027, 2028, 2030]) {
    assert.equal(seasonOn(at(y, 11, 30, 23, 59)), null);
    assert.equal(seasonOn(at(y, 12, 1, 0, 0)), 'christmas');
    assert.equal(seasonOn(day(y, 12, 25)), 'christmas');
    assert.equal(seasonOn(day(y + 1, 1, 1)), 'christmas');
    assert.equal(seasonOn(at(y + 1, 1, 4, 23, 59)), 'christmas');
    assert.equal(seasonOn(at(y + 1, 1, 5, 0, 0)), null);
    // The Jan part belongs to the season that started the previous December,
    // so a visitor's "turn off" choice in December still holds in January.
    assert.equal(fx.pick(day(y + 1, 1, 3)).year, y);
  }
});

test('Canada Day and the 4th of July each run 2 days before through the day itself', () => {
  for (const y of [2026, 2027, 2028, 2030]) {
    assert.equal(seasonOn(at(y, 6, 28, 23, 59)), null, `${y} Jun 28`);
    assert.equal(seasonOn(at(y, 6, 29, 0, 0)), 'canadaday', `${y} Jun 29 (2 days before)`);
    assert.equal(seasonOn(day(y, 6, 30)), 'canadaday', `${y} Jun 30`);
    assert.equal(seasonOn(at(y, 7, 1, 23, 59)), 'canadaday', `${y} Canada Day`);
    assert.equal(seasonOn(at(y, 7, 2, 0, 0)), 'july4', `${y} Jul 2 (2 days before)`);
    assert.equal(seasonOn(day(y, 7, 3)), 'july4', `${y} Jul 3`);
    assert.equal(seasonOn(at(y, 7, 4, 23, 59)), 'july4', `${y} Independence Day`);
    assert.equal(seasonOn(at(y, 7, 5, 0, 0)), null, `${y} Jul 5`);
  }
  const ca = fx.SEASONS.find(s => s.id === 'canadaday');
  const us = fx.SEASONS.find(s => s.id === 'july4');
  assert.equal(ca.label, 'Happy Canada Day');
  assert.equal(us.label, 'Happy 4th of July');
});

test('no two seasons ever share a day, so the order of SEASONS never hides one', () => {
  for (let t = new Date(2027, 0, 1, 12); t.getFullYear() < 2029; t = new Date(t.getFullYear(), t.getMonth(), t.getDate() + 1, 12)) {
    const on = fx.SEASONS.filter(s => {
      for (const y of [t.getFullYear() - 1, t.getFullYear()]) {
        const r = s.range ? s.range(y) : [new Date(y, s.start[0] - 1, s.start[1]),
          new Date(s.end[0] < s.start[0] ? y + 1 : y, s.end[0] - 1, s.end[1] + 1)];
        if (t >= r[0] && t < r[1]) return true;
      }
      return false;
    }).map(s => s.id);
    // Thanksgiving weekend deliberately sits inside Halloween and wins by order.
    const allowed = on.length <= 1 || (on.length === 2 && on.includes('thanksgiving') && on.includes('halloween'));
    assert.ok(allowed, `${t.toDateString()}: ${on.join(', ')}`);
  }
});

test('no effect between seasons', () => {
  for (const [m, d] of [[1, 5], [3, 15], [6, 1], [6, 28], [7, 5], [9, 15], [11, 5], [11, 20]]) {
    assert.equal(seasonOn(day(2027, m, d)), null, `${m}/${d}`);
  }
});

test('?season= preview overrides the date, including inside another season', () => {
  assert.equal(seasonOn(day(2026, 10, 30), '?season=christmas'), 'christmas');
  assert.equal(seasonOn(day(2026, 12, 10), '?season=halloween'), 'halloween');
  assert.equal(seasonOn(day(2026, 6, 1), '?season=halloween'), 'halloween');
  assert.equal(seasonOn(day(2026, 10, 30), '?season=thanksgiving'), 'thanksgiving');
  assert.equal(seasonOn(day(2026, 10, 30), '?season=canadaday'), 'canadaday');
  assert.equal(seasonOn(day(2026, 12, 10), '?season=july4'), 'july4');
  assert.equal(seasonOn(day(2026, 7, 1), '?season=july4'), 'july4');
  assert.equal(seasonOn(day(2026, 10, 10), '?season=halloween'), 'halloween');
  assert.equal(seasonOn(day(2026, 10, 30), '?season=off'), null);
  assert.equal(fx.pick(day(2026, 6, 1), '?season=christmas').forced, true);
});

test('exam pages are excluded; ordinary pages are not', () => {
  for (const p of ['/test-bank', '/test-bank/', '/test-bank.html', '/exam-preview/cssbb', 'test-bank']) {
    assert.equal(fx.excluded(p), true, p);
  }
  for (const p of ['/', '/lessons', '/exam-practice', '/engineering-tools/x']) {
    assert.equal(fx.excluded(p), false, p);
  }
});

test('the script is plain ASCII so emoji cannot be garbled by a missing charset', () => {
  assert.equal(/[^\x00-\x7f]/.test(SRC), false);
});

function browserPage(url, date) {
  const dom = new JSDOM('<!doctype html><html><body><main>Page</main></body></html>', {
    // jsdom has no canvas; the script falls back to the greeting only. Silence the warning.
    url, pretendToBeVisual: true, runScripts: 'outside-only', virtualConsole: new VirtualConsole()
  });
  const RealDate = dom.window.Date;
  dom.window.eval(`(function(){var T=${date.getTime()};var R=Date;
    function D(){return arguments.length?new (Function.prototype.bind.apply(R,[null].concat([].slice.call(arguments))))():new R(T)}
    D.prototype=R.prototype;D.now=function(){return T};Date=D;})();`);
  dom.window.eval(SRC);
  dom.window.Date = RealDate;
  return dom;
}

test('in season, the greeting appears and its close button turns it off for the year', () => {
  const dom = browserPage('https://upskillsprint.com/lessons', day(2026, 10, 31));
  const doc = dom.window.document;
  const badge = doc.querySelector('.uss-fx-badge');
  assert.ok(badge, 'greeting badge rendered');
  assert.match(badge.textContent, /Happy Halloween/);
  const close = badge.querySelector('button');
  assert.equal(close.getAttribute('aria-label'), 'Turn off seasonal effects');
  close.click();
  assert.equal(doc.querySelector('.uss-fx-badge'), null);
  assert.equal(dom.window.localStorage.getItem('uss-fx-off:halloween:2026'), '1');
  dom.window.close();
});

test('Canada Day and the 4th of July greet visitors and can be turned off for the year', () => {
  for (const [date, id, text] of [[day(2027, 7, 1), 'canadaday', /Happy Canada Day/], [day(2027, 7, 4), 'july4', /Happy 4th of July/]]) {
    const dom = browserPage('https://upskillsprint.com/', date);
    const doc = dom.window.document;
    const badge = doc.querySelector('.uss-fx-badge');
    assert.ok(badge, `${id} greeting`);
    assert.match(badge.textContent, text);
    badge.querySelector('button').click();
    assert.equal(doc.querySelector('.uss-fx-badge'), null);
    assert.equal(dom.window.localStorage.getItem(`uss-fx-off:${id}:2027`), '1');
    dom.window.close();
  }
});

test('nothing renders out of season or on exam pages', () => {
  const off = browserPage('https://upskillsprint.com/lessons', day(2026, 7, 15));
  assert.equal(off.window.document.querySelector('.uss-fx-badge'), null);
  off.window.close();
  const exam = browserPage('https://upskillsprint.com/test-bank', day(2026, 12, 20));
  assert.equal(exam.window.document.querySelector('.uss-fx-badge'), null);
  exam.window.close();
});

test('preview validators ignore exactly the build-injected seasonal tag, and nothing else', async () => {
  const { injectTag } = await import(injectorUrl);
  const page = '<!doctype html><html><body><main>Lesson</main>\n</body>\n</html>\n';
  // Netlify then adds its deploy-preview block right before </body>, after our tag.
  const netlify = '<div data-netlify-deploy-id="0123456789abcdef01234567" data-netlify-site-id="82c1a97f-bb8d-4e7b-8367-fe93d7ce1657" data-vcs="github" style="position:fixed"><script async src="/.netlify/scripts/cdp"></script></div>\n';
  const built = injectTag(page);
  const served = built.replace('</body>', netlify + '</body>');
  const regexFrom = (file, name) => {
    const src = fs.readFileSync(path.join(ROOT, 'scripts', file), 'utf8');
    const literal = src.match(new RegExp('const ' + name + ' ?= ?(/.*/[gimsuy]*);'))[1];
    return new Function('return ' + literal)();
  };
  const validators = {
    'validate-spread-lab.cjs': ['NETLIFY_DEPLOYMENT_BLOCK', 'SEASONAL_EFFECTS_TAG'],
    'validate-signal-noise.cjs': ['injected', 'seasonalTag']
  };
  for (const [file, [netlifyName, seasonalName]] of Object.entries(validators)) {
    const strip = body => body.replace(regexFrom(file, netlifyName), '').replace(regexFrom(file, seasonalName), '');
    assert.equal(strip(served), page, `${file}: served preview reduces to the source`);
    assert.equal(strip(built), page, `${file}: build output without Netlify block`);
    // Any other difference must still be caught.
    const tampered = served.replace('<main>Lesson</main>', '<main>Lesson</main><script src="/other.js" defer></script>');
    assert.notEqual(strip(tampered), page, `${file}: other added scripts are not ignored`);
  }
});

test('build injector adds the tag once, before </body>, and skips exams and fragments', async () => {
  const { injectSeasonalEffects, injectTag, SEASONAL_TAG } = await import(injectorUrl);
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'uss-fx-'));
  const page = '<!doctype html><html><body><p>x</p></body></html>';
  const write = (rel, html) => {
    fs.mkdirSync(path.dirname(path.join(dir, rel)), { recursive: true });
    fs.writeFileSync(path.join(dir, rel), html);
  };
  write('index.html', page);
  write('lessons/a.html', page);
  write('test-bank.html', page);
  write('exam-preview/cssbb.html', page);
  write('lessons/assets/fragment.html', page);
  write('partial.html', '<section>fragment without body</section>');

  assert.equal(await injectSeasonalEffects(dir), 2);
  const read = rel => fs.readFileSync(path.join(dir, rel), 'utf8');
  assert.ok(read('index.html').includes(SEASONAL_TAG + '\n</body>'));
  assert.ok(read('lessons/a.html').includes(SEASONAL_TAG));
  for (const rel of ['test-bank.html', 'exam-preview/cssbb.html', 'lessons/assets/fragment.html', 'partial.html']) {
    assert.equal(read(rel).includes('seasonal-effects'), false, rel);
  }
  // Running the build twice never duplicates the tag.
  assert.equal(await injectSeasonalEffects(dir), 0);
  assert.equal(read('index.html').split(SEASONAL_TAG).length, 2);
  assert.equal(injectTag(read('index.html')), null);
  fs.rmSync(dir, { recursive: true, force: true });
});
