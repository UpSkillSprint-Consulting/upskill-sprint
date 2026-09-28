const assert = require('node:assert/strict');
const test = require('node:test');

let analytics;
let cleanup;

class MemoryBlobStore {
  constructor() {
    this.entries = new Map();
    this.etag = 0;
    this.deleted = [];
  }

  async get(key) {
    return this.entries.has(key) ? this.entries.get(key).data : null;
  }

  async getWithMetadata(key) {
    const entry = this.entries.get(key);
    if (!entry) return null;
    return {
      data: structuredClone(entry.data),
      etag: entry.etag,
      metadata: {},
    };
  }

  async set(key, data, options = {}) {
    return this.#write(key, data, options);
  }

  async setJSON(key, data, options = {}) {
    return this.#write(key, structuredClone(data), options);
  }

  #write(key, data, options) {
    const existing = this.entries.get(key);
    if (options.onlyIfNew && existing) return { modified: false };
    if (options.onlyIfMatch && (!existing || existing.etag !== options.onlyIfMatch)) {
      return { modified: false };
    }
    const etag = `etag-${++this.etag}`;
    this.entries.set(key, { data, etag });
    return { modified: true, etag };
  }

  async list({ prefix = '' } = {}) {
    return {
      blobs: [...this.entries.keys()]
        .filter((key) => key.startsWith(prefix))
        .sort()
        .map((key) => ({ key, etag: this.entries.get(key).etag })),
      directories: [],
    };
  }

  async delete(key) {
    this.deleted.push(key);
    this.entries.delete(key);
  }
}

function productionEnvironment() {
  return { get: (name) => (name === 'CONTEXT' ? 'production' : undefined) };
}

function committedEvent(overrides = {}) {
  return {
    event: 'search_committed',
    query: 'harmonic mean',
    resultCount: 2,
    sectionCount: 4,
    topic: 'statistics',
    level: 'beginner',
    interactive: 'all',
    mode: 'all',
    ...overrides,
  };
}

function analyticsRequest(payload, { headers = {}, method = 'POST', url = 'https://upskillsprint.com/.netlify/functions/lesson-search-analytics' } = {}) {
  return new Request(url, {
    method,
    headers: {
      Origin: 'https://upskillsprint.com',
      'Content-Type': 'application/json',
      'Sec-Fetch-Site': 'same-origin',
      ...headers,
    },
    body: method === 'POST' ? JSON.stringify(payload) : undefined,
  });
}

async function callHandler(payload, store, requestOptions = {}, handlerOptions = {}) {
  return analytics.handleLessonSearchAnalytics(analyticsRequest(payload, requestOptions), {
    environment: productionEnvironment(),
    getStoreImpl: () => store,
    now: () => new Date('2026-09-28T12:00:00.000Z'),
    randomSource: () => 'a'.repeat(64),
    ...handlerOptions,
  });
}

test.before(async () => {
  [analytics, cleanup] = await Promise.all([
    import('../netlify/functions/lesson-search-analytics.mjs'),
    import('../netlify/functions/lesson-search-analytics-cleanup.mjs'),
  ]);
});

test('accepts a valid same-origin production event and stores one aggregate', async () => {
  const store = new MemoryBlobStore();
  const response = await callHandler(committedEvent(), store);

  assert.equal(response.status, 204);
  const aggregateKeys = [...store.entries.keys()].filter((key) => /search_committed\/[a-f0-9]+\.json$/.test(key));
  assert.equal(aggregateKeys.length, 1);
  const aggregate = store.entries.get(aggregateKeys[0]).data;
  assert.equal(aggregate.count, 1);
  assert.equal(aggregate.resultCounts['1-5'], 1);
  assert.equal(aggregate.topics.statistics, 1);
  assert.equal('query' in aggregate, false, 'plaintext query must not be retained');
});

test('never stores readable query text, including after repeated searches', async () => {
  const store = new MemoryBlobStore();
  await callHandler(committedEvent(), store);
  await callHandler(committedEvent(), store);

  let aggregate = [...store.entries]
    .find(([key]) => /search_committed\/[a-f0-9]+\.json$/.test(key))[1].data;
  assert.equal(aggregate.count, 2);
  assert.equal('query' in aggregate, false);

  await callHandler(committedEvent(), store);
  aggregate = [...store.entries]
    .find(([key]) => /search_committed\/[a-f0-9]+\.json$/.test(key))[1].data;
  assert.equal(aggregate.count, 3);
  assert.equal('query' in aggregate, false);
  assert.equal(aggregate.resultCounts['1-5'], 3);
  assert.equal(JSON.stringify([...store.entries]).includes('harmonic mean'), false);
});

test('updating a legacy aggregate removes every nested readable query field', () => {
  const aggregate = analytics.applyEventToAggregate({
    version: 1,
    date: '2026-09-28',
    event: 'search_reformulated',
    queryHash: 'current-hash',
    query: 'legacy current query',
    count: 2,
    previousQueries: {
      'updated-hash': { query: 'legacy updated previous query', count: 1 },
      'untouched-hash': { previousQuery: 'legacy untouched previous query', count: 1 },
    },
  }, {
    event: 'search_reformulated',
    previousQuery: 'new previous query',
    query: 'new current query',
  }, {
    date: '2026-09-28',
    queryHash: 'current-hash',
    previousQueryHash: 'updated-hash',
  });

  assert.equal(aggregate.count, 3);
  assert.equal(aggregate.previousQueries['updated-hash'].count, 2);
  assert.equal(aggregate.previousQueries['untouched-hash'].count, 1);
  const serialized = JSON.stringify(aggregate);
  for (const readableQuery of [
    'legacy current query', 'legacy updated previous query',
    'legacy untouched previous query', 'new previous query', 'new current query',
  ]) {
    assert.equal(serialized.includes(readableQuery), false);
  }
});

test('strictly rejects cross-origin, missing-origin, non-JSON, oversized, and extra-field requests', async () => {
  const store = new MemoryBlobStore();

  const crossOrigin = await callHandler(committedEvent(), store, {
    headers: { Origin: 'https://attacker.example', 'Sec-Fetch-Site': 'cross-site' },
  });
  assert.equal(crossOrigin.status, 403);

  const missingOriginRequest = analyticsRequest(committedEvent());
  missingOriginRequest.headers.delete('Origin');
  const missingOrigin = await analytics.handleLessonSearchAnalytics(missingOriginRequest, {
    environment: productionEnvironment(),
    getStoreImpl: () => store,
  });
  assert.equal(missingOrigin.status, 403);

  const wrongType = await callHandler(committedEvent(), store, {
    headers: { 'Content-Type': 'text/plain' },
  });
  assert.equal(wrongType.status, 415);

  const oversized = await callHandler(committedEvent({ query: 'x'.repeat(5000) }), store);
  assert.equal(oversized.status, 413);

  const extraField = await callHandler({ ...committedEvent(), visitorId: 'not-allowed' }, store);
  assert.equal(extraField.status, 400);
  assert.equal([...store.entries.keys()].some((key) => key.startsWith('daily/')), false);
});

test('rejects PII-like terms and unsafe result targets', async () => {
  assert.equal(analytics.sanitizeQuery('person@example.com'), null);
  assert.equal(analytics.sanitizeQuery('https://example.com/private'), null);
  assert.equal(analytics.sanitizeQuery('+1 (306) 555-0199'), null);
  assert.equal(analytics.sanitizeQuery('control charts\nprivate note'), null);
  assert.equal(analytics.sanitizeQuery('Cp and Cpk'), 'Cp and Cpk');

  const validSelection = analytics.validateEventPayload({
    event: 'result_selected',
    query: 'control limits',
    targetPath: '/lessons/control-charts-explained.html',
    sectionId: 'special-cause-variation',
    rank: 2,
    matchType: 'heading',
    resultCount: 7,
  }, 'https://upskillsprint.com');
  assert.equal(validSelection.ok, true);

  const unsafeSelection = analytics.validateEventPayload({
    ...validSelection.value,
    targetPath: 'https://attacker.example/lessons/phishing',
  }, 'https://upskillsprint.com');
  assert.deepEqual(unsafeSelection, { ok: false, reason: 'invalid_selection' });
});

test('GPC, DNT, and non-production requests never open the analytics store', async () => {
  for (const headers of [{ 'Sec-GPC': '1' }, { DNT: '1' }]) {
    let opened = false;
    const response = await analytics.handleLessonSearchAnalytics(
      analyticsRequest(committedEvent(), { headers }),
      {
        environment: productionEnvironment(),
        getStoreImpl: () => {
          opened = true;
          return new MemoryBlobStore();
        },
      },
    );
    assert.equal(response.status, 204);
    assert.equal(opened, false);
  }

  let opened = false;
  const response = await analytics.handleLessonSearchAnalytics(analyticsRequest(committedEvent()), {
    environment: { get: () => 'deploy-preview' },
    getStoreImpl: () => {
      opened = true;
      return new MemoryBlobStore();
    },
  });
  assert.equal(response.status, 204);
  assert.equal(opened, false);
});

test('selection and reformulation records are aggregates, not raw event logs', async () => {
  const store = new MemoryBlobStore();
  const selection = {
    event: 'result_selected',
    query: 'spc chart',
    targetPath: '/lessons/control-charts-explained.html',
    sectionId: 'choosing-a-chart',
    rank: 6,
    matchType: 'semantic',
    resultCount: 9,
  };
  const reformulation = {
    event: 'search_reformulated',
    previousQuery: 'process graph',
    query: 'spc chart',
  };
  for (let index = 0; index < 3; index += 1) {
    await callHandler(selection, store);
    await callHandler(reformulation, store);
  }

  const selectionRecord = [...store.entries]
    .find(([key]) => /result_selected\/[a-f0-9]+\.json$/.test(key))[1].data;
  assert.equal(selectionRecord.count, 3);
  assert.equal(Object.keys(selectionRecord.targets).length, 1);
  assert.equal(Object.values(selectionRecord.targets)[0].count, 3);
  assert.equal(Object.values(selectionRecord.targets)[0].ranks['4-10'], 3);

  const reformulationRecord = [...store.entries]
    .find(([key]) => /search_reformulated\/[a-f0-9]+\.json$/.test(key))[1].data;
  assert.equal('query' in reformulationRecord, false);
  assert.equal('query' in Object.values(reformulationRecord.previousQueries)[0], false);
  assert.equal(Object.values(reformulationRecord.previousQueries)[0].count, 3);
  const serializedStore = JSON.stringify([...store.entries]);
  assert.equal(serializedStore.includes('spc chart'), false);
  assert.equal(serializedStore.includes('process graph'), false);

  const aggregateKeys = [...store.entries.keys()].filter((key) => /\/[a-f0-9]+\.json$/.test(key));
  assert.equal(aggregateKeys.length, 2, 'repeated events must update stable aggregate keys');
});

test('daily query cardinality and per-query target cardinality are bounded', async () => {
  const store = new MemoryBlobStore();
  assert.equal(await analytics.reserveDailyQueryHash(store, '2026-09-28', 'search_committed', 'hash-a', 1), true);
  assert.equal(await analytics.reserveDailyQueryHash(store, '2026-09-28', 'search_committed', 'hash-a', 1), true);
  assert.equal(await analytics.reserveDailyQueryHash(store, '2026-09-28', 'search_committed', 'hash-b', 1), false);

  let aggregate;
  for (let index = 0; index < analytics.MAX_TARGETS_PER_QUERY + 5; index += 1) {
    aggregate = analytics.applyEventToAggregate(aggregate, {
      event: 'result_selected',
      query: 'control chart',
      targetPath: `/lessons/chart-${index}.html`,
      sectionId: `section-${index}`,
      rank: 1,
      matchType: 'title',
      resultCount: 1,
    }, { date: '2026-09-28', queryHash: 'query-hash' });
  }
  assert.equal(Object.keys(aggregate.targets).length, analytics.MAX_TARGETS_PER_QUERY);
  assert.equal(aggregate.otherTargetCount, 5);
});

test('scheduled cleanup deletes only aggregates older than the 90-day retention window', async () => {
  const store = new MemoryBlobStore();
  await store.setJSON('daily/2026-06-29/search_committed/a.json', { count: 1 });
  await store.setJSON('daily/2026-06-30/search_committed/b.json', { count: 1 });
  await store.setJSON('daily/2026-09-28/search_committed/c.json', { count: 1 });
  await store.set('config/query-hash-salt', 'a'.repeat(64));

  let openedStoreName;
  const result = await cleanup.runLessonSearchAnalyticsCleanup({
    getStoreImpl: (name) => {
      openedStoreName = name;
      return store;
    },
    now: () => new Date('2026-09-28T12:00:00.000Z'),
  });
  assert.equal(openedStoreName, analytics.ANALYTICS_STORE_NAME);
  assert.deepEqual(cleanup.config, { schedule: '@daily' });
  assert.equal(result.cutoff, '2026-06-30');
  assert.deepEqual(store.deleted, ['daily/2026-06-29/search_committed/a.json']);
  assert.equal(store.entries.has('daily/2026-06-30/search_committed/b.json'), true);
  assert.equal(store.entries.has('config/query-hash-salt'), true);
});

test('scheduled cleanup surfaces deletion failures', async () => {
  const store = new MemoryBlobStore();
  await store.setJSON('daily/2026-06-29/search_committed/a.json', { count: 1 });
  store.delete = async () => {
    throw new Error('simulated delete failure');
  };

  await assert.rejects(
    cleanup.runLessonSearchAnalyticsCleanup({
      getStoreImpl: () => store,
      now: () => new Date('2026-09-28T12:00:00.000Z'),
    }),
    /Failed to delete 1 expired analytics aggregate/,
  );
});

test('offline improvement report exposes query text only from reviewed labels', () => {
  const report = analytics.summarizeImprovementSignals([
    {
      event: 'search_committed', queryHash: 'gap-reviewed', query: 'ignored stored content gap', count: 5,
      resultCounts: { 0: 4, '1-5': 1 },
    },
    {
      event: 'search_committed', queryHash: 'gap-unreviewed', query: 'ignored rare phrase', count: 2,
      resultCounts: { 0: 2 },
    },
    {
      event: 'search_reformulated', queryHash: 'to-reviewed', query: 'ignored current phrase',
      previousQueries: {
        'from-reviewed': { query: 'ignored previous phrase', count: 3 },
        'from-unreviewed': { query: 'ignored unreviewed reformulation', count: 4 },
      },
    },
    {
      event: 'result_selected', queryHash: 'selection-hash', query: 'ignored selection phrase', targets: {
        abc: {
          path: '/lessons/control-charts-explained.html', sectionId: 'chart-selection', count: 8,
          ranks: { '1': 2, '4-10': 5, '11+': 1 },
        },
      },
    },
  ], {
    approvedQueryLabels: new Map([
      ['gap-reviewed', 'hazard bathtub'],
      ['gap-unreviewed', 'person@example.com'],
      ['to-reviewed', 'harmonic mean'],
      ['from-reviewed', 'average equal distance'],
    ]),
  });

  assert.deepEqual(report.contentGaps, [
    { query: 'hazard bathtub', zeroResultCount: 4, totalSearches: 5 },
  ]);
  assert.deepEqual(report.reformulations, [
    { from: 'average equal distance', to: 'harmonic mean', count: 3 },
  ]);
  assert.deepEqual(report.selectedSections, [
    {
      path: '/lessons/control-charts-explained.html', sectionId: 'chart-selection',
      selections: 8, lowRankSelections: 6,
    },
  ]);
  assert.equal(report.unresolvedContentGapSearches, 2);
  assert.equal(report.unresolvedReformulations, 4);
  const serializedReport = JSON.stringify(report);
  for (const forbidden of [
    'gap-reviewed', 'gap-unreviewed', 'to-reviewed', 'from-reviewed', 'from-unreviewed',
    'ignored stored content gap', 'ignored rare phrase', 'ignored current phrase',
    'ignored previous phrase', 'ignored unreviewed reformulation', 'ignored selection phrase',
  ]) {
    assert.equal(serializedReport.includes(forbidden), false, `report must omit ${forbidden}`);
  }
});

test('analytics endpoint has a short-window IP and domain rate limit', () => {
  assert.deepEqual(analytics.config, {
    path: '/.netlify/functions/lesson-search-analytics',
    rateLimit: {
      windowLimit: 30,
      windowSize: 60,
      aggregateBy: ['ip', 'domain'],
    },
  });
});

test('privacy policy documents aggregate search analytics and retention', async () => {
  const { readFile } = require('node:fs/promises');
  const path = require('node:path');
  const privacy = await readFile(path.join(__dirname, '..', 'privacy.html'), 'utf8');
  assert.match(privacy, /Lesson search analytics/);
  assert.match(privacy, /daily aggregates, not a log of individual searches/i);
  assert.match(privacy, /never stored in readable form/i);
  assert.match(privacy, /separately reviewed label/i);
  assert.match(privacy, /deleted after 90 days/i);
  assert.match(privacy, /Global Privacy Control or Do Not Track/i);
  assert.match(privacy, /short-window abuse-prevention rate limit/i);
  assert.doesNotMatch(privacy, /at least three times/i);
});
