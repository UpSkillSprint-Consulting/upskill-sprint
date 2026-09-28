'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const path = require('node:path');

const core = require('../lesson-search-core.js');

function lesson(overrides) {
  return Object.assign({
    id: 'lesson',
    path: '/lessons/example.html',
    title: 'Example Lesson',
    description: '',
    topic: 'Analytics',
    level: 'Beginner',
    minutes: 12,
    interactive: true,
    keywords: [],
    contentAvailable: true,
    sections: []
  }, overrides);
}

const transformations = lesson({
  id: 'statistical-transformations',
  path: '/lessons/statistics/statistical-transformations.html',
  title: 'Statistical Transformations',
  description: 'A beginner-friendly guide to choosing and interpreting transformations and averages.',
  keywords: ['log transform', 'sqrt', 'z-score', 'average'],
  sections: [
    {
      id: 'arithmetic-mean',
      heading: 'Arithmetic Mean',
      breadcrumb: 'Choosing an Average › Arithmetic Mean',
      text: 'Add all values and divide by the count. Use this familiar average when observations contribute equally.',
      kinds: ['section']
    },
    {
      id: 'geometric-mean',
      heading: 'Geometric Mean',
      breadcrumb: 'Choosing an Average › Geometric Mean',
      text: 'Use the geometric mean for compound investment returns or growth over multiple periods.',
      kinds: ['section', 'example']
    },
    {
      id: 'harmonic-mean',
      heading: 'Harmonic Mean',
      breadcrumb: 'Choosing an Average › Harmonic Mean',
      text: 'Use the harmonic mean to average rates. For two equal-distance trips at different speeds, it gives the correct average speed.',
      kinds: ['section', 'example', 'formula']
    },
    {
      id: 'square-root-transformation',
      heading: 'Square Root Transformation',
      breadcrumb: 'Transformations › Square Root',
      text: 'The square root transformation stabilizes variance for count data.',
      kinds: ['section', 'formula']
    }
  ]
});

const spcLesson = lesson({
  id: 'control-charts',
  path: '/lessons/quality/control-charts.html',
  title: 'Statistical Process Control',
  description: 'Monitor process stability with control charts.',
  topic: 'Lean Six Sigma',
  level: 'Intermediate',
  interactive: false,
  keywords: ['SPC', 'control chart'],
  sections: [{
    id: 'chart-selection',
    heading: 'Choose a Control Chart',
    breadcrumb: 'SPC › Chart selection',
    text: 'Choose a chart based on the data type and subgroup structure.',
    kinds: ['section']
  }]
});

const fixture = { version: 1, lessons: [transformations, spcLesson] };

test('exports the same public API in CommonJS and browser UMD contexts', () => {
  for (const name of ['searchIndex', 'createExcerpt', 'highlightText', 'relatedQueries']) {
    assert.equal(typeof core[name], 'function');
  }

  const source = fs.readFileSync(path.join(__dirname, '..', 'lesson-search-core.js'), 'utf8');
  const context = { globalThis: {} };
  vm.runInNewContext(source, context);
  assert.equal(typeof context.globalThis.LessonSearchCore.searchIndex, 'function');
});

test('normalizes punctuation, diacritics, math notation, and common formula aliases', () => {
  assert.equal(core.normalizeText('Z-score — café'), 'z score cafe');
  assert.match(core.normalizeText('χ² and σ'), /chi square/);
  assert.match(core.normalizeText('χ² and σ'), /standard deviation/);
  assert.match(core.normalizeText('√x, sqrt(x), and 1/x'), /square root/);
  assert.match(core.normalizeText('√x, sqrt(x), and 1/x'), /reciprocal one over x/);
});

test('Damerau-Levenshtein treats a transposition as one edit and supports a cutoff', () => {
  assert.equal(core.damerauLevenshtein('harmnic', 'harmonic'), 1);
  assert.equal(core.damerauLevenshtein('mean', 'mena'), 1);
  assert.equal(core.damerauLevenshtein('short', 'transformation', 2), 3);
});

test('weighted ranking is title, then heading, keywords, description, and body', () => {
  const weighted = {
    lessons: [
      lesson({ id: 'body', title: 'Body Match', sections: [{ id: 's', heading: 'Overview', text: 'quasar', kinds: ['section'] }] }),
      lesson({ id: 'description', title: 'Description Match', description: 'quasar', sections: [] }),
      lesson({ id: 'keywords', title: 'Keyword Match', keywords: ['quasar'], sections: [] }),
      lesson({ id: 'heading', title: 'Heading Match', sections: [{ id: 's', heading: 'Quasar', text: '', kinds: ['section'] }] }),
      lesson({ id: 'title', title: 'Quasar', sections: [] })
    ]
  };
  const result = core.searchIndex(weighted, 'quasar', { limit: 10 });
  assert.deepEqual(result.results.map(item => item.id), ['title', 'heading', 'keywords', 'description', 'body']);
});

test('groups section matches under one lesson and exposes safe direct-section metadata', () => {
  const result = core.searchIndex(fixture, 'mean', { sectionsPerLesson: 2 });
  assert.equal(result.totalLessons, 1);
  assert.equal(result.results[0].id, 'statistical-transformations');
  assert.equal(result.results[0].sections.length, 2);
  assert.ok(result.results[0].totalSectionMatches >= 3);
  assert.ok(result.results[0].sections.every(section => section.id && section.heading));
});

test('lesson-level metadata does not fabricate unrelated section matches', () => {
  const isolated = { lessons: [lesson({
    id: 'quasar-guide',
    title: 'Quasar Guide',
    keywords: ['nebula'],
    sections: [{ id: 'ordinary', heading: 'Getting Started', text: 'A deliberately unrelated section.', kinds: ['section'] }]
  })] };
  const titleOnly = core.searchIndex(isolated, 'quasar');
  assert.equal(titleOnly.results[0].id, 'quasar-guide');
  assert.equal(titleOnly.results[0].sections.length, 0);

  const keywordOnly = core.searchIndex(isolated, 'nebula');
  assert.equal(keywordOnly.results[0].id, 'quasar-guide');
  assert.equal(keywordOnly.results[0].sections.length, 0);
});

test('supports title, section, example, and formula search modes', () => {
  assert.equal(core.searchIndex(fixture, 'Statistical Transformations', { mode: 'titles' }).results[0].sections.length, 0);
  assert.equal(core.searchIndex(fixture, 'average', { mode: 'titles' }).totalLessons, 0,
    'title mode must not search keywords or descriptions');
  assert.equal(core.searchIndex(fixture, 'average').results[0].id, 'statistical-transformations',
    'all mode should continue to search lesson metadata');
  assert.equal(core.searchIndex(fixture, 'harmonic', { mode: 'sections' }).results[0].sections[0].id, 'harmonic-mean');
  assert.equal(core.searchIndex(fixture, 'compound returns', { mode: 'examples' }).results[0].sections[0].id, 'geometric-mean');
  assert.equal(core.searchIndex(fixture, 'mean', { mode: 'formulas' }).results[0].sections[0].id, 'harmonic-mean');
  assert.equal(core.searchIndex(fixture, 'arithmetic', { mode: 'examples' }).totalLessons, 0);
});

test('applies topic, level, and interactive filters without changing the index', () => {
  assert.equal(core.searchIndex(fixture, 'control', { topic: 'Analytics' }).totalLessons, 0);
  assert.equal(core.searchIndex(fixture, 'control', { topic: 'Lean Six Sigma', level: 'Intermediate', interactive: false }).results[0].id, 'control-charts');
  assert.equal(core.searchIndex(fixture, 'mean', { filters: { topic: 'Analytics', interactive: true } }).results[0].id, 'statistical-transformations');
  assert.equal(fixture.lessons.length, 2);
  const stringBoolean = { lessons: [lesson({ id: 'static', interactive: 'false', title: 'Static Control Lesson' })] };
  assert.equal(core.searchIndex(stringBoolean, 'static', { interactive: false }).totalLessons, 1);
  assert.equal(core.searchIndex(stringBoolean, 'static', { interactive: true }).totalLessons, 0);
});

test('finds acronyms, synonyms, math aliases, and one- or two-edit typos', () => {
  assert.equal(core.searchIndex(fixture, 'SPC').results[0].id, 'control-charts');
  assert.equal(core.searchIndex(fixture, 'harmnic mean').results[0].sections[0].id, 'harmonic-mean');
  assert.equal(core.searchIndex(fixture, 'mena').results[0].id, 'statistical-transformations');
  assert.equal(core.searchIndex(fixture, 'sqrt').results[0].sections[0].id, 'square-root-transformation');
  assert.equal(core.searchIndex(fixture, 'statistcal proces control').results[0].id, 'control-charts');
});

test('a two-letter omission in square root outranks an unrelated root-cause title', () => {
  const rootCause = lesson({
    id: 'root-cause',
    title: 'Root Cause Analysis',
    description: 'Investigate causes with 5 Whys.',
    sections: [{ id: 'fishbone', heading: 'Fishbone Diagram', text: 'Organize possible causes.', kinds: ['section'] }]
  });
  const result = core.searchIndex({ lessons: [rootCause, transformations] }, 'sqre root');
  assert.equal(result.results[0].id, 'statistical-transformations');
  assert.equal(result.results[0].sections[0].id, 'square-root-transformation');
  assert.equal(result.results.some(item => item.id === 'root-cause'), false);
});

test('requires both terms of a two-word query unless semantic phrase evidence is present', () => {
  const result = core.searchIndex(fixture, 'harmonic mean', { sectionsPerLesson: 10 });
  assert.equal(result.results[0].sections[0].id, 'harmonic-mean');
  assert.deepEqual(result.results[0].sections.map(section => section.id), ['harmonic-mean']);
});

test('does not reverse-prefix-match a long unknown word to a shorter catalog word', () => {
  const noResultIndex = { lessons: [lesson({
    id: 'complete-guide',
    title: 'Complete Guide',
    description: 'Complete this learning path.',
    sections: [{ id: 'complete', heading: 'Complete the lesson', text: 'Completion steps.', kinds: ['section'] }]
  })] };
  const result = core.searchIndex(noResultIndex, 'completelynotfoundword');
  assert.equal(result.totalLessons, 0);
  assert.deepEqual(result.results, []);
});

test('deterministic semantic intent sends an equal-distance trip question to harmonic mean', () => {
  const result = core.searchIndex(
    fixture,
    'Which average should I use for two equal-distance trips?'
  );
  assert.equal(result.results[0].id, 'statistical-transformations');
  assert.equal(result.results[0].sections[0].id, 'harmonic-mean');
  assert.ok(result.intents.includes('harmonic-mean-equal-distance'));
});

test('question wording about process stability resolves to control-chart content', () => {
  const result = core.searchIndex(fixture, 'How can I tell whether my process is stable?');
  assert.equal(result.results[0].id, 'control-charts');
  assert.ok(result.intents.includes('control-chart-monitoring'));
});

test('excerpts are bounded and highlighting returns inert text segments, never markup', () => {
  const hostile = '<img src=x onerror=alert(1)> Before the harmonic mean example, there is context. ' + 'padding '.repeat(40);
  const excerpt = core.createExcerpt(hostile, 'harmonic mean', { maxLength: 100 });
  assert.ok(excerpt.text.length <= 102);
  assert.ok(excerpt.highlightRanges.length > 0);

  const segments = core.highlightText(excerpt.text, excerpt.highlightRanges);
  assert.equal(segments.map(segment => segment.text).join(''), excerpt.text);
  assert.ok(segments.some(segment => segment.highlighted && /harmonic mean/i.test(segment.text)));
  assert.equal(segments.some(segment => Object.hasOwn(segment, 'html')), false);

  const untrusted = core.highlightText('<script>alert(1)</script>', 'script');
  assert.equal(untrusted.map(segment => segment.text).join(''), '<script>alert(1)</script>');
});

test('related queries recover from typos using future catalog titles and headings', () => {
  const suggestions = core.relatedQueries('harmnic', fixture, { limit: 5 });
  assert.ok(suggestions.includes('Harmonic Mean'));

  const futureIndex = {
    lessons: [lesson({
      title: 'Bayesian Forecasting',
      sections: [{ id: 'posterior', heading: 'Posterior Predictive Checks', text: '', kinds: ['section'] }]
    })]
  };
  assert.ok(core.relatedQueries('postreior', futureIndex).includes('Posterior Predictive Checks'));
});

test('search output is deterministic and does not mutate lessons or sections', () => {
  const before = JSON.stringify(fixture);
  const first = core.searchIndex(fixture, 'average speed');
  const second = core.searchIndex(fixture, 'average speed');
  assert.deepEqual(first, second);
  assert.equal(JSON.stringify(fixture), before);
});
