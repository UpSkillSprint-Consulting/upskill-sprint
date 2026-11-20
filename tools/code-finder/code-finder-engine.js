/* Code Finder search engine.
 *
 * Pure functions, no DOM: build an index from the catalog in data/code-finder/,
 * then search it with a plain-language query plus facet filters.
 *
 * Why not a library: at ~600 records a field-weighted scorer is ~250 lines,
 * needs no dependency, and lets us add the parts that matter here (synonyms,
 * designation matching such as "z245.1", "why this matched" reasons).
 * The design plan moves to Pagefind only past ~5,000 records.
 */
(function (root, factory) {
  'use strict';
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CodeFinderEngine = factory();
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  // Facet keys used in records, filters and the URL.
  var FACETS = ['industries', 'categories', 'useCases', 'docTypes', 'bodies', 'jurisdictions'];
  // Record field that holds each facet's value(s).
  var FACET_FIELD = {industries: 'industries', categories: 'categories', useCases: 'useCases',
    docTypes: 'docType', bodies: 'body', jurisdictions: 'jurisdictions'};
  // Field weights: a hit on the designation matters most, the long summary least.
  var WEIGHT = {designation: 12, title: 5, facet: 3, summary: 1.5};
  var SYNONYM_RECORD_BOOST = 14;
  var SYNONYM_FACET_BOOST = 4;
  var STOP = {the: 1, a: 1, an: 1, and: 1, or: 1, of: 1, for: 1, to: 1, in: 1, on: 1, with: 1, by: 1,
    is: 1, what: 1, which: 1, code: 1, codes: 1, standard: 1, standards: 1, do: 1, i: 1, need: 1, my: 1, how: 1, at: 1};

  function normalize(text) {
    return String(text || '').toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[^a-z0-9.\-/+\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  // "Z245.1", "z 245-1" and "z2451" all compact to "z2451".
  function compact(text) { return String(text || '').toLowerCase().replace(/[^a-z0-9]/g, ''); }
  function words(text) {
    return normalize(text).split(/[\s.\-/+]+/).filter(Boolean);
  }
  function queryTokens(text) {
    return words(text).filter(function (word) { return !STOP[word]; });
  }

  // Simple plural folding so "valves" finds "valve" and "tanks" finds "tank".
  function stem(word) {
    if (word.length > 4 && /ies$/.test(word)) return word.slice(0, -3) + 'y';
    if (word.length > 3 && /[^s]s$/.test(word)) return word.slice(0, -1);
    return word;
  }

  // Levenshtein distance capped at 2 (enough to catch "charpey", "hydrotst").
  function closeEnough(a, b) {
    if (Math.abs(a.length - b.length) > 1) return false;
    var prev = [], cur, i, j;
    for (j = 0; j <= b.length; j++) prev[j] = j;
    for (i = 1; i <= a.length; i++) {
      cur = [i];
      var rowMin = i;
      for (j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
        if (cur[j] < rowMin) rowMin = cur[j];
      }
      if (rowMin > 1) return false;
      prev = cur;
    }
    return prev[b.length] <= 1;
  }

  function labelMap(list) {
    var map = {};
    (list || []).forEach(function (entry) { map[entry.slug || entry.code] = entry.label || entry.name; });
    return map;
  }

  // ---------- Index ----------
  function buildIndex(catalog) {
    var taxonomy = catalog.taxonomy;
    var labels = {
      industries: labelMap(taxonomy.facets.industries),
      categories: labelMap(taxonomy.facets.categories),
      useCases: labelMap(taxonomy.facets.useCases),
      docTypes: labelMap(taxonomy.facets.docTypes),
      jurisdictions: labelMap(taxonomy.facets.jurisdictions),
      bodies: labelMap(taxonomy.bodies.map(function (body) { return {slug: body.code, label: body.code}; })),
      materials: labelMap(taxonomy.materials),
      relationTypes: labelMap(taxonomy.relationTypes)
    };
    var parents = {};
    ['industries', 'jurisdictions'].forEach(function (facet) {
      parents[facet] = {};
      taxonomy.facets[facet].forEach(function (entry) { if (entry.parent) parents[facet][entry.slug] = entry.parent; });
    });
    var records = catalog.standards.standards;
    var byId = {};
    var docs = records.map(function (record) {
      byId[record.id] = record;
      var facetWords = [];
      ['industries', 'categories', 'useCases', 'jurisdictions'].forEach(function (facet) {
        record[facet].forEach(function (slug) { facetWords = facetWords.concat(words(labels[facet][slug])); });
      });
      facetWords = facetWords.concat(words(labels.docTypes[record.docType]));
      (record.materials || []).forEach(function (slug) { facetWords = facetWords.concat(words(labels.materials[slug])); });
      return {
        record: record,
        designationCompact: compact(record.designation),
        // "api spec 5l" -> number part "5l"; "csa z245.1" -> "z2451"
        numberCompact: compact(record.designation.replace(/^(API|CSA|ASTM|ISO\/IEC|ISO|IEC)\s+(Spec|Std|RP|Publ)?\s*/i, '')),
        fields: {
          designation: unique(words(record.designation).concat(words(record.id))),
          title: unique(words(record.title).map(stem)),
          facet: unique(facetWords.map(stem)),
          summary: unique(words(record.summary).map(stem))
        }
      };
    });
    // Synonym phrases, longest first so "line pipe" wins over "pipe".
    var phrases = [];
    catalog.synonyms.synonyms.forEach(function (entry) {
      [entry.term].concat(entry.aliases).forEach(function (phrase) {
        phrases.push({phrase: normalize(phrase), entry: entry});
      });
    });
    phrases.sort(function (a, b) { return b.phrase.length - a.phrase.length; });
    var packs = (catalog.scenarios && catalog.scenarios.packs) || [];
    var packBySlug = {};
    packs.forEach(function (pack) { packBySlug[pack.slug] = pack; });
    return {catalog: catalog, docs: docs, byId: byId, labels: labels, parents: parents, phrases: phrases,
      packs: packs, packBySlug: packBySlug};
  }

  function unique(list) {
    var seen = {}, out = [];
    list.forEach(function (item) { if (item && !seen[item]) { seen[item] = 1; out.push(item); } });
    return out;
  }

  // ---------- Query understanding ----------
  // Finds synonym phrases in the query and removes them, so the leftover words
  // are scored normally. Returns the hits and the remaining text.
  function expandSynonyms(index, query) {
    var text = ' ' + normalize(query) + ' ';
    var hits = [];
    index.phrases.forEach(function (item) {
      var needle = ' ' + item.phrase + ' ';
      if (text.indexOf(needle) !== -1) {
        if (!hits.some(function (hit) { return hit.entry === item.entry; })) hits.push({phrase: item.phrase, entry: item.entry});
        text = text.split(needle).join(' ');
      }
    });
    return {hits: hits, rest: text.trim()};
  }

  function tokenScore(doc, token) {
    var best = 0, where = null;
    var folded = stem(token);
    Object.keys(WEIGHT).forEach(function (field) {
      var list = doc.fields[field], weight = WEIGHT[field], score = 0;
      for (var i = 0; i < list.length && score < weight; i++) {
        var w = list[i];
        if (w === token || w === folded) score = weight;
        else if (token.length >= 3 && w.indexOf(token) === 0) score = Math.max(score, weight * 0.7);
        else if (token.length >= 5 && closeEnough(folded, w)) score = Math.max(score, weight * 0.45);
      }
      if (score > best) { best = score; where = field; }
    });
    return {score: best, field: where};
  }

  // ---------- Filters ----------
  function recordValues(record, facet) {
    var value = record[FACET_FIELD[facet]];
    return Array.isArray(value) ? value : [value];
  }
  // OR within a facet, AND across facets. Picking a parent (oil-gas, ca) also
  // matches records tagged only with a child (oil-gas-midstream, ca-federal).
  function passes(index, record, filters, skipFacet) {
    return FACETS.every(function (facet) {
      if (facet === skipFacet) return true;
      var wanted = filters[facet];
      if (!wanted || !wanted.length) return true;
      var parentOf = index.parents[facet] || {};
      return recordValues(record, facet).some(function (value) {
        return wanted.indexOf(value) !== -1 || (parentOf[value] && wanted.indexOf(parentOf[value]) !== -1);
      });
    });
  }

  // ---------- Search ----------
  function search(index, query, filters, options) {
    filters = filters || {};
    options = options || {};
    var expanded = expandSynonyms(index, query || '');
    var tokens = queryTokens(expanded.rest);
    // Words that formed a synonym still nudge the score at half weight, so
    // "weld procedure qualification" prefers the record whose own title says so.
    var synonymWords = queryTokens(expanded.hits.map(function (hit) { return hit.phrase; }).join(' '));
    var qCompact = compact(query);
    var hasQuery = tokens.length > 0 || expanded.hits.length > 0;

    var synRecords = {}, synFacets = [];
    expanded.hits.forEach(function (hit) {
      (hit.entry.records || []).forEach(function (id) { (synRecords[id] = synRecords[id] || []).push(hit.phrase); });
      ['categories', 'useCases', 'industries'].forEach(function (facet) {
        (hit.entry[facet] || []).forEach(function (slug) { synFacets.push({facet: facet, slug: slug, phrase: hit.phrase}); });
      });
    });

    var scored = [];
    index.docs.forEach(function (doc) {
      var record = doc.record;
      if (!hasQuery) { scored.push({record: record, score: 0, reasons: []}); return; }
      var score = 0, reasons = [], matched = 0;

      // Exact or partial designation typed ("5L", "Z245.1", "A370", "api 1104").
      if (qCompact.length >= 2 && (qCompact === doc.designationCompact || qCompact === doc.numberCompact || qCompact === compact(record.id))) {
        score += 60; reasons.push('Designation');
      } else if (qCompact.length >= 3 && /\d/.test(qCompact) && doc.designationCompact.indexOf(qCompact) !== -1) {
        score += 25; reasons.push('Designation');
      }
      if (synRecords[record.id]) {
        score += SYNONYM_RECORD_BOOST;
        reasons.push('Means "' + synRecords[record.id][0] + '"');
      }
      synFacets.forEach(function (hint) {
        if (recordValues(record, hint.facet).indexOf(hint.slug) !== -1) {
          score += SYNONYM_FACET_BOOST;
          var label = index.labels[hint.facet][hint.slug];
          if (reasons.indexOf(label) === -1) reasons.push(label);
        }
      });
      var fieldsHit = {};
      tokens.forEach(function (token) {
        var hit = tokenScore(doc, token);
        if (hit.score > 0) { matched++; score += hit.score; fieldsHit[hit.field] = true; }
      });
      synonymWords.forEach(function (token) {
        var hit = tokenScore(doc, token);
        if (hit.score > 0 && (synRecords[record.id] || matched)) score += hit.score * 0.5;
      });
      if (tokens.length) {
        // Reward records that match every word; a single stray word should not win.
        var coverage = matched / tokens.length;
        if (!expanded.hits.length && !reasons.length && coverage < 0.5) return;
        score *= 0.4 + 0.6 * coverage * coverage;
        if (fieldsHit.title) reasons.push('Title');
        if (fieldsHit.facet && reasons.length < 3) reasons.push('Topic');
        if (fieldsHit.summary && !fieldsHit.title && !fieldsHit.designation && reasons.length < 3) reasons.push('Summary');
      }
      if (score > 0) scored.push({record: record, score: score, reasons: unique(reasons).slice(0, 4)});
    });

    var counts = facetCounts(index, scored, filters);
    var results = scored.filter(function (item) { return passes(index, item.record, filters); });
    sortResults(results, hasQuery ? (options.sort || 'relevance') : (options.sort === 'relevance' || !options.sort ? 'body' : options.sort));
    return {
      results: results,
      total: results.length,
      counts: counts,
      synonyms: expanded.hits.map(function (hit) { return hit.phrase; }),
      hasQuery: hasQuery
    };
  }

  function sortResults(results, sort) {
    var byDesignation = function (a, b) {
      return a.record.designation.localeCompare(b.record.designation, 'en', {numeric: true});
    };
    if (sort === 'designation') results.sort(byDesignation);
    else if (sort === 'body') results.sort(function (a, b) { return a.record.body.localeCompare(b.record.body) || byDesignation(a, b); });
    else results.sort(function (a, b) { return b.score - a.score || byDesignation(a, b); });
  }

  // Counts per facet value. Each facet ignores its own filter (disjunctive
  // faceting), so ticking "API" still shows how many CSA codes you could add.
  function facetCounts(index, scored, filters) {
    var counts = {};
    FACETS.forEach(function (facet) {
      var tally = {};
      scored.forEach(function (item) {
        if (!passes(index, item.record, filters, facet)) return;
        var values = recordValues(item.record, facet), seen = {};
        values.forEach(function (value) {
          if (!seen[value]) { seen[value] = 1; tally[value] = (tally[value] || 0) + 1; }
          var parent = (index.parents[facet] || {})[value];
          if (parent && !seen[parent]) { seen[parent] = 1; tally[parent] = (tally[parent] || 0) + 1; }
        });
      });
      counts[facet] = tally;
    });
    return counts;
  }

  // ---------- Card helpers ----------
  var INVERSE = {equivalent: 'equivalent', similar: 'similar', references: 'referenced-by', supersedes: 'superseded-by'};
  var RELATION_LABEL = {equivalent: 'Equivalent', similar: 'Similar', references: 'Cites', 'referenced-by': 'Cited by',
    supersedes: 'Replaces', 'superseded-by': 'Replaced by'};
  function related(index, id) {
    var out = [], seen = {};
    index.catalog.standards.standards.forEach(function (record) {
      (record.relations || []).forEach(function (relation) {
        var item = null;
        if (record.id === id) item = {to: relation.to, type: relation.type, note: relation.note};
        else if (relation.to === id) item = {to: record.id, type: INVERSE[relation.type], note: relation.note};
        if (item && !seen[item.to + item.type]) { seen[item.to + item.type] = 1; item.label = RELATION_LABEL[item.type]; out.push(item); }
      });
    });
    var order = ['equivalent', 'similar', 'supersedes', 'superseded-by', 'references', 'referenced-by'];
    return out.sort(function (a, b) { return order.indexOf(a.type) - order.indexOf(b.type); });
  }

  function isStale(record, today, months) {
    if (!record.verified) return true;
    var limit = new Date(today || Date.now());
    limit.setUTCMonth(limit.getUTCMonth() - (months || 12));
    return record.verified < limit.toISOString().slice(0, 10);
  }

  // ---------- Starter packs and wizard ----------
  // A pack's codes in the order the pack lists them, each with its "why".
  function packResults(index, slug) {
    var pack = index.packBySlug[slug];
    if (!pack) return null;
    var results = pack.records.filter(function (item) { return index.byId[item.id]; }).map(function (item) {
      return {record: index.byId[item.id], score: 0, reasons: [], why: item.why};
    });
    return {pack: pack, results: results, total: results.length};
  }

  // Ranks packs for wizard answers ({industries: [...], useCases: [...]}).
  // An industry answer also matches its parent (midstream -> oil and gas), so
  // a pack tagged only "oil-gas" still fits a pipeline answer.
  function recommendPacks(index, answers) {
    var exact = answers.industries || [];
    var industries = expandParents(index, 'industries', exact);
    var tasks = answers.useCases || [];
    return index.packs.map(function (pack) {
      // A pack tagged with the exact sub-sector beats one that only shares the parent.
      var industryHits = pack.industries.reduce(function (sum, slug) {
        return sum + (exact.indexOf(slug) !== -1 ? 2 : industries.indexOf(slug) !== -1 ? 1 : 0);
      }, 0);
      var taskHits = pack.useCases.filter(function (slug) { return tasks.indexOf(slug) !== -1; }).length;
      // Both answers matter; a pack that matches only one still shows, lower down.
      var score = (industryHits ? 2 + industryHits : 0) + (taskHits ? 3 + 2 * taskHits : 0) + (industryHits && taskHits ? 4 : 0);
      return {pack: pack, score: score, both: industryHits > 0 && taskHits > 0};
    }).filter(function (item) { return item.score > 0; })
      .sort(function (a, b) { return b.score - a.score || a.pack.title.localeCompare(b.pack.title); });
  }
  function expandParents(index, facet, values) {
    var out = values.slice();
    values.forEach(function (value) {
      var parent = (index.parents[facet] || {})[value];
      if (parent && out.indexOf(parent) === -1) out.push(parent);
    });
    return out;
  }

  // CSV for a pack export. Cells that start with = + - @ are prefixed with an
  // apostrophe so a spreadsheet never runs them as formulas.
  function csvCell(value) {
    var text = value === null || value === undefined ? '' : String(value);
    if (/^[=+\-@\t\r]/.test(text)) text = "'" + text;
    return /[",\r\n]/.test(text) ? '"' + text.replace(/"/g, '""') + '"' : text;
  }
  function packToCsv(index, slug, options) {
    options = options || {};
    var view = packResults(index, slug);
    if (!view) return '';
    var site = options.siteUrl || 'https://upskillsprint.com';
    var today = options.today || new Date().toISOString().slice(0, 10);
    var rows = [
      ['Code Finder starter pack', view.pack.title],
      ['Generated', today],
      ['Source', site + '/tools/code-finder/?pack=' + view.pack.slug],
      ['Note', 'Metadata only. Confirm the current edition with the publisher and the edition your regulator or contract requires.'],
      [],
      ['Designation', 'Title', 'Publisher', 'Document type', 'Why it is in this pack', 'Check status', 'Current edition', 'Where it is mandatory', 'Summary', 'Code Finder link']
    ];
    view.results.forEach(function (item) {
      var r = item.record;
      rows.push([
        r.designation, r.title, r.body, index.labels.docTypes[r.docType] || r.docType, item.why,
        isStale(r, options.now) ? 'Not yet checked' : 'Checked ' + r.verified, r.edition || '',
        r.adoptions.map(function (a) { return index.labels.jurisdictions[a.jurisdiction] + ': ' + a.regulator + ', ' + a.instrument + ' (' + a.editionCited + ')'; }).join('; '),
        r.summary, site + '/tools/code-finder/?q=' + encodeURIComponent(r.designation)
      ]);
    });
    return rows.map(function (row) { return row.map(csvCell).join(','); }).join('\r\n') + '\r\n';
  }

  // ---------- URL state ----------
  var PARAM = {industries: 'industry', categories: 'category', useCases: 'use', docTypes: 'type', bodies: 'body', jurisdictions: 'where'};
  function stateToParams(state) {
    var params = new URLSearchParams();
    if (state.q) params.set('q', state.q);
    FACETS.forEach(function (facet) {
      if (state.filters[facet] && state.filters[facet].length) params.set(PARAM[facet], state.filters[facet].join(','));
    });
    if (state.sort && state.sort !== 'relevance') params.set('sort', state.sort);
    if (state.pack) params.set('pack', state.pack);
    return params.toString();
  }
  function paramsToState(search, index) {
    var params = new URLSearchParams(search || '');
    var filters = {};
    FACETS.forEach(function (facet) {
      var raw = params.get(PARAM[facet]);
      if (!raw) return;
      var allowed = index ? index.labels[facet] : null;
      filters[facet] = unique(raw.split(',')).filter(function (value) { return !allowed || allowed[value] !== undefined; });
    });
    var sort = params.get('sort');
    var pack = params.get('pack');
    return {q: (params.get('q') || '').slice(0, 120), filters: filters,
      sort: ['relevance', 'body', 'designation'].indexOf(sort) !== -1 ? sort : 'relevance',
      pack: pack && (!index || index.packBySlug[pack]) ? pack : null};
  }

  return {
    FACETS: FACETS, PARAM: PARAM,
    normalize: normalize, compact: compact, closeEnough: closeEnough,
    buildIndex: buildIndex, search: search, related: related, isStale: isStale,
    packResults: packResults, recommendPacks: recommendPacks, packToCsv: packToCsv,
    stateToParams: stateToParams, paramsToState: paramsToState
  };
}));
