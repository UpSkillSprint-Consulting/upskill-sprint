/*
 * UpSkill Sprint lesson search engine.
 *
 * This module deliberately has no DOM or network dependencies. The same code is
 * used by the lesson-library page, Node-based index validation, and unit tests.
 */
(function lessonSearchCoreModule(root, factory) {
  'use strict';

  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.LessonSearchCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function lessonSearchCoreFactory() {
  'use strict';

  const VERSION = 1;
  const MODES = new Set(['all', 'titles', 'sections', 'examples', 'formulas']);
  const FIELD_WEIGHTS = Object.freeze({
    title: 64,
    heading: 40,
    keywords: 24,
    breadcrumb: 18,
    description: 12,
    body: 6
  });
  const INDEX_PREPARATION_CACHE = new WeakMap();
  const DISTINCTIVE_SEMANTIC_TOKENS = new Set([
    'anova', 'cp', 'cpk', 'doe', 'kpi', 'msa', 'oee', 'pp', 'ppk', 'spc', 'sql'
  ]);

  const STOP_WORDS = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'can', 'could', 'do',
    'does', 'find', 'for', 'from', 'get', 'help', 'how', 'i', 'if', 'in', 'into', 'is', 'it',
    'know', 'lesson', 'me', 'my', 'need', 'of', 'on', 'one', 'or', 'should', 'show', 'tell', 'than',
    'that', 'the', 'then', 'there', 'these', 'this', 'to', 'two', 'three',
    'four', 'five', 'use', 'using', 'want', 'what', 'when', 'where', 'which',
    'who', 'why', 'will', 'with', 'would'
  ]);

  // Keep these groups domain-focused. Broad dictionary synonyms create noisy
  // matches; these concepts mirror the vocabulary used in the lesson catalog.
  const SYNONYM_GROUPS = Object.freeze([
    // Keep bare "mean" out of this group: it is a useful literal term for all
    // three means, but treating it as an arithmetic-mean synonym would drown
    // out a more specific (possibly misspelled) "harmonic mean" query.
    ['average', 'arithmetic mean'],
    ['geometric mean', 'compound growth', 'compound return', 'growth rate'],
    ['harmonic mean', 'average rate', 'average speed', 'equal distance'],
    ['log', 'logarithm', 'log transformation', 'log scale'],
    ['square root', 'sqrt', 'root transformation'],
    ['reciprocal', 'inverse transformation', 'one over x'],
    ['standardization', 'standardisation', 'z score', 'scaling and centering', 'normalization'],
    ['spc', 'statistical process control', 'control chart', 'process control'],
    ['msa', 'measurement system analysis', 'gage r&r', 'gauge r&r'],
    ['doe', 'design of experiments', 'experimental design'],
    ['anova', 'analysis of variance'],
    ['capability', 'process capability', 'cp', 'cpk', 'pp', 'ppk'],
    ['chi square', 'chi squared', 'goodness of fit'],
    ['oee', 'overall equipment effectiveness'],
    ['kpi', 'key performance indicator'],
    ['sql', 'structured query language'],
    ['power bi', 'business intelligence'],
    ['reliability', 'failure rate', 'hazard rate', 'survival analysis'],
    ['correlation', 'association', 'relationship'],
    ['regression', 'prediction model', 'predictive model'],
    ['histogram', 'frequency distribution'],
    ['variation', 'variance', 'spread', 'dispersion']
  ]);

  const INTENT_RULES = Object.freeze([
    {
      id: 'harmonic-mean-equal-distance',
      test: text => /\b(equal|same)\s+distance\b/.test(text) &&
        /\b(average|speed|rate|trip|travel|journey)\b/.test(text),
      terms: ['harmonic mean', 'average speed', 'average rate', 'equal distance'],
      suggestion: 'harmonic mean for equal-distance trips'
    },
    {
      id: 'harmonic-mean-rates',
      test: text => /\baverage\s+(?:of\s+)?(?:speeds?|rates?)\b/.test(text),
      terms: ['harmonic mean', 'average rate', 'average speed'],
      suggestion: 'harmonic mean for rates'
    },
    {
      id: 'geometric-mean-growth',
      test: text => /\b(compound|compounding|multi[ -]?period|year[ -]?over[ -]?year)\b/.test(text) &&
        /\b(growth|return|rate|average)\b/.test(text),
      terms: ['geometric mean', 'compound growth', 'compound return'],
      suggestion: 'geometric mean for compound growth'
    },
    {
      id: 'log-large-range',
      test: text => /\b(orders? of magnitude|huge range|very large range|exponential growth)\b/.test(text),
      terms: ['log transformation', 'log scale', 'logarithm'],
      suggestion: 'log transformation for large ranges'
    },
    {
      id: 'square-root-counts',
      test: text => /\b(count|counts|occurrences?|events?)\b/.test(text) &&
        /\b(variance|stabilize|stabilise|transform|transformation)\b/.test(text),
      terms: ['square root transformation', 'count data', 'stabilize variance'],
      suggestion: 'square root transformation for count data'
    },
    {
      id: 'reciprocal-rate',
      test: text => /\b(per\s+(?:minute|hour|day|task)|duration|cycle time)\b/.test(text) &&
        /\b(invert|inverse|reciprocal|convert|rate|tasks?)\b/.test(text),
      terms: ['reciprocal transformation', 'one over x', 'rate'],
      suggestion: 'reciprocal transformation for rates'
    },
    {
      id: 'z-score-scales',
      test: text => /\b(compare|different|same|shared)\b/.test(text) &&
        /\b(scales?|units?|features?|variables?)\b/.test(text),
      terms: ['z score', 'standardization', 'scaling and centering'],
      suggestion: 'z-score standardization for different scales'
    },
    {
      id: 'control-chart-monitoring',
      test: text => /\b(monitor|detect|track|stable|stability|in control)\b/.test(text) &&
        /\b(process|variation|data|defects?)\b/.test(text),
      terms: ['statistical process control', 'control chart', 'spc', 'process stability', 'common cause variation'],
      suggestion: 'SPC control charts'
    }
  ]);

  function replaceMathAliases(value) {
    return String(value == null ? '' : value)
      .replace(/χ\s*[²2]/giu, ' chi square ')
      .replace(/χ/gu, ' chi ')
      .replace(/σ/gu, ' sigma standard deviation ')
      .replace(/μ/gu, ' mu mean ')
      .replace(/x̄/gu, ' x bar mean ')
      .replace(/√\s*x?/giu, ' square root ')
      .replace(/\bsqrt\s*\(?\s*x?\s*\)?/giu, ' square root ')
      .replace(/\b1\s*\/\s*x\b/giu, ' reciprocal one over x ')
      .replace(/\bz\s*[-–—]\s*score\b/giu, ' z score ')
      .replace(/\bgage\s+r\s*&\s*r\b/giu, ' gage r&r ')
      .replace(/\bgauge\s+r\s*&\s*r\b/giu, ' gauge r&r ');
  }

  function normalizeText(value) {
    return replaceMathAliases(value)
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/&/g, ' and ')
      .replace(/[’'`]/g, '')
      .replace(/[‐‑‒–—−_-]+/g, ' ')
      .replace(/[^a-z0-9+#.]+/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function tokenizeQuery(value, options) {
    const settings = options || {};
    const tokens = normalizeText(value).split(' ').filter(Boolean);
    if (settings.keepStopWords) return tokens;
    const meaningful = tokens.filter(token => !STOP_WORDS.has(token));
    return meaningful.length ? meaningful : tokens;
  }

  function damerauLevenshtein(leftValue, rightValue, maxDistance) {
    const left = normalizeText(leftValue);
    const right = normalizeText(rightValue);
    if (left === right) return 0;
    if (!left.length) return right.length;
    if (!right.length) return left.length;

    const limit = Number.isFinite(maxDistance) ? Math.max(0, maxDistance) : Infinity;
    if (Math.abs(left.length - right.length) > limit) return limit + 1;

    let previousPrevious = null;
    let previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let row = 1; row <= left.length; row += 1) {
      const current = [row];
      let rowMinimum = row;
      for (let column = 1; column <= right.length; column += 1) {
        const substitutionCost = left[row - 1] === right[column - 1] ? 0 : 1;
        let distance = Math.min(
          current[column - 1] + 1,
          previous[column] + 1,
          previous[column - 1] + substitutionCost
        );
        if (
          previousPrevious && row > 1 && column > 1 &&
          left[row - 1] === right[column - 2] &&
          left[row - 2] === right[column - 1]
        ) {
          distance = Math.min(distance, previousPrevious[column - 2] + 1);
        }
        current[column] = distance;
        rowMinimum = Math.min(rowMinimum, distance);
      }
      if (rowMinimum > limit) return limit + 1;
      previousPrevious = previous;
      previous = current;
    }
    return previous[right.length];
  }

  function unique(values) {
    return [...new Set(values.filter(Boolean))];
  }

  function prepareField(value) {
    const normalized = normalizeText(value);
    const tokens = unique(normalized.split(' ').filter(Boolean));
    return {
      __lessonSearchPreparedField: true,
      normalized,
      tokens,
      tokenSet: new Set(tokens)
    };
  }

  function prepareFields(fields) {
    return Object.fromEntries(Object.entries(fields).map(([name, value]) => [name, prepareField(value)]));
  }

  function includesPhrase(text, phrase) {
    if (!text || !phrase) return false;
    return (` ${text} `).includes(` ${phrase} `) || text.includes(phrase);
  }

  function expandQuery(query) {
    const normalized = normalizeText(query);
    const tokens = tokenizeQuery(normalized);
    const phrases = [];
    const terms = [];
    const matchedGroups = [];

    for (const group of SYNONYM_GROUPS) {
      const normalizedGroup = group.map(normalizeText);
      const matched = normalizedGroup.some(alias => {
        if (alias.includes(' ')) {
          if (includesPhrase(normalized, alias)) return true;
          const aliasTokens = alias.split(' ');
          return tokens.length === aliasTokens.length && tokens.every(token =>
            bestTokenMatch(token, aliasTokens, true, new Set(aliasTokens)).quality > 0
          );
        }
        return tokens.includes(alias);
      });
      if (!matched) continue;
      matchedGroups.push(group[0]);
      for (const alias of normalizedGroup) {
        if (alias.includes(' ')) phrases.push(alias);
        terms.push(...alias.split(' '));
      }
    }

    const intents = INTENT_RULES.filter(rule => rule.test(normalized)).map(rule => ({
      id: rule.id,
      terms: rule.terms.map(normalizeText),
      suggestion: rule.suggestion
    }));
    for (const intent of intents) {
      for (const term of intent.terms) {
        if (term.includes(' ')) phrases.push(term);
        terms.push(...term.split(' '));
      }
    }

    return {
      raw: String(query == null ? '' : query),
      normalized,
      tokens,
      expandedTokens: unique(terms.filter(term => !tokens.includes(term) && !STOP_WORDS.has(term))),
      expandedPhrases: unique(phrases.filter(phrase => phrase !== normalized)),
      intentPhrases: unique(intents.flatMap(intent => intent.terms.filter(term => term.includes(' ')))),
      matchedGroups: unique(matchedGroups),
      intents
    };
  }

  function fuzzyThreshold(token) {
    if (token.length < 4) return 0;
    return token.length >= 8 ? 2 : 1;
  }

  function isSubsequence(shorter, longer) {
    let cursor = 0;
    for (const character of longer) {
      if (character === shorter[cursor]) cursor += 1;
      if (cursor === shorter.length) return true;
    }
    return false;
  }

  function bestTokenMatch(queryToken, fieldTokens, allowFuzzy, fieldTokenSet) {
    if (!queryToken || !fieldTokens.length) return { quality: 0, kind: null, token: null };
    if (fieldTokenSet && fieldTokenSet.has(queryToken)) {
      return { quality: 1, kind: 'exact', token: queryToken };
    }
    let best = { quality: 0, kind: null, token: null };
    for (const fieldToken of fieldTokens) {
      if (queryToken === fieldToken) return { quality: 1, kind: 'exact', token: fieldToken };
      const forwardPrefix = queryToken.length >= 4 && fieldToken.length >= 4 &&
        fieldToken.startsWith(queryToken);
      // Retain close suffix variations such as "transformations" →
      // "transformation", but never let a long unrelated token match merely
      // because it starts with a valid, much shorter word.
      const closeReversePrefix = queryToken.length >= 4 && fieldToken.length >= 4 &&
        queryToken.startsWith(fieldToken) && queryToken.length - fieldToken.length <= 3 &&
        fieldToken.length / queryToken.length >= 0.72;
      if (forwardPrefix || closeReversePrefix) {
        if (best.quality < 0.72) best = { quality: 0.72, kind: 'prefix', token: fieldToken };
      }
      const threshold = allowFuzzy ? fuzzyThreshold(queryToken) : 0;
      if (threshold && Math.abs(queryToken.length - fieldToken.length) <= threshold) {
        const distance = damerauLevenshtein(queryToken, fieldToken, threshold);
        if (distance <= threshold) {
          const quality = distance === 1 ? 0.58 : 0.42;
          if (best.quality < quality) best = { quality, kind: 'typo', token: fieldToken };
        }
      }
      // Mobile typing often drops two adjacent interior letters ("sqre" for
      // "square"). Admit that narrow pattern without enabling a general
      // two-edit match for short words, which would create substantial noise.
      if (
        allowFuzzy && queryToken.length >= 4 && fieldToken.length === queryToken.length + 2 &&
        queryToken.slice(0, 2) === fieldToken.slice(0, 2) &&
        queryToken[queryToken.length - 1] === fieldToken[fieldToken.length - 1] &&
        isSubsequence(queryToken, fieldToken)
      ) {
        if (best.quality < 0.42) best = { quality: 0.42, kind: 'typo', token: fieldToken };
      }
    }
    return best;
  }

  function scoreField(value, model, fieldName, settings) {
    const prepared = value && value.__lessonSearchPreparedField === true
      ? value
      : prepareField(value);
    const normalized = prepared.normalized;
    if (!normalized) return { score: 0, matchedExplicit: [], reasons: [], semanticHit: false };

    const weight = FIELD_WEIGHTS[fieldName] || 1;
    const fieldTokens = prepared.tokens;
    const reasons = [];
    const matchedExplicit = [];
    let score = 0;
    let semanticHit = false;
    let intentPhraseHit = false;

    if (model.normalized.length >= 2 && includesPhrase(normalized, model.normalized)) {
      score += weight * 2.6;
      reasons.push({ field: fieldName, kind: 'phrase', value: model.normalized });
      matchedExplicit.push(...model.tokens);
    }

    for (const token of model.tokens) {
      const allowFuzzy = settings.allowFuzzy !== false && fieldName !== 'body' && fieldName !== 'description';
      const match = bestTokenMatch(token, fieldTokens, allowFuzzy, prepared.tokenSet);
      if (!match.quality) continue;
      score += weight * match.quality;
      matchedExplicit.push(token);
      reasons.push({ field: fieldName, kind: match.kind, value: token, matched: match.token });
    }

    for (const phrase of model.expandedPhrases) {
      if (!includesPhrase(normalized, phrase)) continue;
      score += weight * 0.88;
      const phrasePosition = normalized.indexOf(phrase);
      // Lead sentences and headings normally state a section's subject; a
      // glossary/table mention hundreds of characters later is supporting
      // material. This small positional bonus resolves otherwise identical
      // body scores without making document length a ranking signal.
      if (fieldName === 'body' && phrasePosition >= 0 && phrasePosition < 240) {
        score += weight * 0.3 * (1 - (phrasePosition / 240));
      }
      const isIntentPhrase = model.intentPhrases.includes(phrase);
      if (isIntentPhrase) intentPhraseHit = true;
      semanticHit = true;
      reasons.push({ field: fieldName, kind: 'semantic', value: phrase, intent: isIntentPhrase });
    }

    // Single-word aliases (SPC, MSA, DOE, sqrt, etc.) still need to match
    // when the long form appears in content. Cap their contribution so a
    // loose synonym never beats a student's exact wording.
    let semanticTokenMatches = 0;
    for (const token of model.expandedTokens) {
      if (!prepared.tokenSet.has(token)) continue;
      semanticTokenMatches += 1;
      // Only distinctive aliases (for example, Cpk or DOE) can admit a result
      // on their own. Generic expansion tokens such as "mean", "process", or
      // "control" are ranking hints and cannot flood the result set.
      if (
        DISTINCTIVE_SEMANTIC_TOKENS.has(token) &&
        (fieldName === 'title' || fieldName === 'heading' || fieldName === 'keywords')
      ) {
        semanticHit = true;
      }
      if (semanticTokenMatches <= 4) score += weight * 0.24;
      reasons.push({ field: fieldName, kind: 'semantic', value: token, matched: token });
    }

    return {
      score,
      matchedExplicit: unique(matchedExplicit),
      reasons,
      semanticHit,
      intentPhraseHit
    };
  }

  function combineFieldScores(fields, model, settings) {
    let score = 0;
    let semanticHit = false;
    let intentPhraseHit = false;
    const matchedExplicit = [];
    const reasons = [];
    for (const [fieldName, value] of Object.entries(fields)) {
      const result = scoreField(value, model, fieldName, settings);
      score += result.score;
      semanticHit = semanticHit || result.semanticHit;
      intentPhraseHit = intentPhraseHit || result.intentPhraseHit;
      matchedExplicit.push(...result.matchedExplicit);
      reasons.push(...result.reasons);
    }
    // Natural-language questions contain generic surface words (for example,
    // "process"). Apply one concept bonus per lesson/section record—not once
    // per field—so a concept repeated in metadata cannot inflate the score.
    if (intentPhraseHit) score += 36;
    return { score, semanticHit, intentPhraseHit, matchedExplicit: unique(matchedExplicit), reasons };
  }

  function coverageThreshold(tokenCount) {
    if (tokenCount <= 2) return 1;
    return 0.6;
  }

  function qualifies(scoreResult, model) {
    if (scoreResult.score <= 0) return false;
    const tokenCount = model.tokens.length || 1;
    const coverage = scoreResult.matchedExplicit.length / tokenCount;
    if (model.intents.length) return scoreResult.semanticHit;
    return coverage >= coverageThreshold(tokenCount) || scoreResult.semanticHit;
  }

  function normalizeKinds(section) {
    const source = Array.isArray(section && section.kinds) ? section.kinds : [];
    return source.map(normalizeText).filter(Boolean);
  }

  function modeAllowsSection(section, mode) {
    if (mode === 'examples') return normalizeKinds(section).includes('example');
    if (mode === 'formulas') return normalizeKinds(section).includes('formula');
    return mode !== 'titles';
  }

  function filterMatches(value, expected) {
    if (expected == null || expected === '' || expected === 'all') return true;
    const wanted = Array.isArray(expected) ? expected : [expected];
    return wanted.some(item => normalizeText(item) === normalizeText(value));
  }

  function booleanFilterMatches(value, expected) {
    if (expected == null || expected === '' || expected === 'all') return true;
    const wanted = typeof expected === 'boolean'
      ? expected
      : ['true', 'yes', 'interactive', '1'].includes(normalizeText(expected));
    const actual = typeof value === 'boolean'
      ? value
      : ['true', 'yes', 'interactive', '1'].includes(normalizeText(value));
    return actual === wanted;
  }

  function asBoolean(value) {
    return typeof value === 'boolean'
      ? value
      : ['true', 'yes', 'interactive', '1'].includes(normalizeText(value));
  }

  function lessonPassesFilters(lesson, options) {
    const filters = Object.assign({}, options && options.filters, options || {});
    return filterMatches(lesson.topic || lesson.category, filters.topic || filters.category) &&
      filterMatches(lesson.level, filters.level) &&
      booleanFilterMatches(lesson.interactive, filters.interactive);
  }

  function safeText(value) {
    return String(value == null ? '' : value).replace(/\s+/g, ' ').trim();
  }

  function highlightCandidates(queryOrModel) {
    const model = typeof queryOrModel === 'string' ? expandQuery(queryOrModel) : (queryOrModel || expandQuery(''));
    return unique([
      model.normalized,
      ...model.tokens,
      ...(model.expandedPhrases || []),
      ...(model.expandedTokens || [])
    ]).filter(value => value.length >= 2 && !STOP_WORDS.has(value)).sort((a, b) => b.length - a.length);
  }

  function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function findHighlightRanges(textValue, queryOrModel, limit) {
    const text = String(textValue == null ? '' : textValue);
    if (!text) return [];
    const ranges = [];
    for (const candidate of highlightCandidates(queryOrModel)) {
      const pattern = escapeRegExp(candidate).replace(/\\?\s+/g, '[\\s‐‑‒–—_-]+');
      let expression;
      try {
        expression = new RegExp(pattern, 'giu');
      } catch (_error) {
        continue;
      }
      let match;
      while ((match = expression.exec(text)) && ranges.length < (limit || 12)) {
        if (!match[0].length) break;
        ranges.push({ start: match.index, end: match.index + match[0].length });
      }
      if (ranges.length >= (limit || 12)) break;
    }
    ranges.sort((a, b) => a.start - b.start || b.end - a.end);
    const merged = [];
    for (const range of ranges) {
      const previous = merged[merged.length - 1];
      if (previous && range.start <= previous.end) previous.end = Math.max(previous.end, range.end);
      else merged.push({ start: range.start, end: range.end });
    }
    return merged.slice(0, limit || 12);
  }

  function createExcerpt(textValue, queryOrModel, options) {
    const settings = options || {};
    const maxLength = Math.max(80, Number(settings.maxLength) || 220);
    const source = safeText(textValue);
    if (!source) return { text: '', ranges: [], highlightRanges: [], start: 0, end: 0 };

    const sourceRanges = findHighlightRanges(source, queryOrModel, 16);
    const focus = sourceRanges.length ? sourceRanges[0].start : 0;
    let start = Math.max(0, focus - Math.floor(maxLength * 0.34));
    let end = Math.min(source.length, start + maxLength);
    if (end - start < maxLength) start = Math.max(0, end - maxLength);

    if (start > 0) {
      const nextSpace = source.indexOf(' ', start);
      if (nextSpace !== -1 && nextSpace < start + 28) start = nextSpace + 1;
    }
    if (end < source.length) {
      const previousSpace = source.lastIndexOf(' ', end);
      if (previousSpace > start + Math.floor(maxLength * 0.7)) end = previousSpace;
    }

    const prefix = start > 0 ? '…' : '';
    const suffix = end < source.length ? '…' : '';
    const excerptText = prefix + source.slice(start, end).trim() + suffix;
    const offset = prefix.length - start;
    const ranges = sourceRanges
      .filter(range => range.end > start && range.start < end)
      .map(range => ({
        start: Math.max(start, range.start) + offset,
        end: Math.min(end, range.end) + offset
      }))
      .filter(range => range.start < range.end);

    return { text: excerptText, ranges, highlightRanges: ranges, start, end };
  }

  // Returns text segments, never HTML. Callers can create <mark> elements with
  // textContent, which keeps lesson text and student input inert.
  function highlightText(textValue, queryOrRanges) {
    const text = String(textValue == null ? '' : textValue);
    const ranges = Array.isArray(queryOrRanges)
      ? queryOrRanges
      : findHighlightRanges(text, queryOrRanges, 20);
    if (!ranges.length) return [{ text, highlighted: false }];
    const segments = [];
    let cursor = 0;
    for (const range of ranges) {
      const start = Math.max(cursor, Math.min(text.length, Number(range.start) || 0));
      const end = Math.max(start, Math.min(text.length, Number(range.end) || 0));
      if (start > cursor) segments.push({ text: text.slice(cursor, start), highlighted: false });
      if (end > start) segments.push({ text: text.slice(start, end), highlighted: true });
      cursor = end;
    }
    if (cursor < text.length) segments.push({ text: text.slice(cursor), highlighted: false });
    return segments;
  }

  function resultMatchType(reasons) {
    const priority = ['phrase', 'exact', 'prefix', 'typo', 'semantic'];
    for (const kind of priority) {
      if (reasons.some(reason => reason.kind === kind)) return kind;
    }
    return 'semantic';
  }

  function sectionSearchFields(lesson, section) {
    const heading = section.heading;
    const breadcrumbParts = Array.isArray(section.breadcrumb)
      ? section.breadcrumb
      : String(section.breadcrumb || '').split(/\s*[›>]\s*/);
    const breadcrumb = breadcrumbParts.filter(part => {
      const normalizedPart = normalizeText(part);
      return normalizedPart && normalizedPart !== normalizeText(lesson.title) &&
        normalizedPart !== normalizeText(section.heading);
    }).join(' ');
    const keywords = (Array.isArray(section.keywords) ? section.keywords : [section.keywords])
      .filter(Boolean)
      .join(' ');
    const common = {
      heading,
      keywords,
      breadcrumb,
      body: [section.text, section.excerpt].filter(Boolean).join(' ')
    };
    return common;
  }

  function compareResults(left, right) {
    return right.score - left.score ||
      safeText(left.lesson.title).localeCompare(safeText(right.lesson.title)) ||
      safeText(left.lesson.path).localeCompare(safeText(right.lesson.path));
  }

  function compareSections(left, right) {
    return right.score - left.score ||
      safeText(left.section.heading).localeCompare(safeText(right.section.heading)) ||
      safeText(left.section.id).localeCompare(safeText(right.section.id));
  }

  function unpackLessons(index) {
    if (Array.isArray(index)) return index;
    if (index && Array.isArray(index.lessons)) return index.lessons;
    return [];
  }

  function prepareIndex(index) {
    const cacheable = Boolean(index && (typeof index === 'object' || typeof index === 'function'));
    if (cacheable && INDEX_PREPARATION_CACHE.has(index)) return INDEX_PREPARATION_CACHE.get(index);

    const prepared = {
      lessons: unpackLessons(index).map(lesson => ({
        lesson,
        titleFields: prepareFields({
          title: lesson.title,
          keywords: Array.isArray(lesson.keywords) ? lesson.keywords.join(' ') : lesson.keywords,
          description: lesson.description
        }),
        sections: (Array.isArray(lesson.sections) ? lesson.sections : []).map(section => ({
          section,
          isLessonHeading: normalizeText(section.heading) === normalizeText(lesson.title),
          fields: prepareFields(sectionSearchFields(lesson, section))
        }))
      }))
    };

    if (cacheable) INDEX_PREPARATION_CACHE.set(index, prepared);
    return prepared;
  }

  function searchIndex(index, query, options) {
    const settings = options || {};
    const mode = MODES.has(settings.mode) ? settings.mode : 'all';
    const model = expandQuery(query);
    const maxResults = Math.max(1, Number(settings.limit || settings.maxResults) || 12);
    const maxSections = Math.max(1, Number(settings.sectionsPerLesson || settings.maxSections) || 3);
    const preparedIndex = prepareIndex(index);
    const filteredLessons = preparedIndex.lessons.filter(record => lessonPassesFilters(record.lesson, settings));

    if (!model.normalized) {
      return {
        query: String(query == null ? '' : query),
        normalizedQuery: '',
        mode,
        totalLessons: 0,
        totalSections: 0,
        searchedLessons: filteredLessons.length,
        results: [],
        expandedTerms: [],
        intents: [],
        suggestions: []
      };
    }

    const results = [];
    for (const lessonRecord of filteredLessons) {
      const lesson = lessonRecord.lesson;
      const titleResult = mode === 'sections' || mode === 'examples' || mode === 'formulas'
        ? { score: 0, semanticHit: false, matchedExplicit: [], reasons: [] }
        : combineFieldScores(
            mode === 'titles' ? { title: lessonRecord.titleFields.title } : lessonRecord.titleFields,
            model,
            settings
          );

      const sectionMatches = [];
      for (const sectionRecord of lessonRecord.sections) {
        const section = sectionRecord.section;
        if (!modeAllowsSection(section, mode)) continue;
        const sectionResult = combineFieldScores(sectionRecord.fields, model, settings);
        if (!qualifies(sectionResult, model)) continue;
        const excerptSource = section.text || section.excerpt || section.heading || lesson.description || lesson.title;
        const excerpt = createExcerpt(excerptSource, model, { maxLength: settings.excerptLength });
        sectionMatches.push({
          id: section.id,
          heading: section.heading,
          breadcrumb: section.breadcrumb,
          kinds: Array.isArray(section.kinds) ? section.kinds.slice() : [],
          score: Number(sectionResult.score.toFixed(4)),
          matchType: resultMatchType(sectionResult.reasons),
          reasons: sectionResult.reasons,
          excerpt: excerpt.text,
          highlightRanges: excerpt.ranges,
          isLessonHeading: sectionRecord.isLessonHeading,
          section
        });
      }
      sectionMatches.sort(compareSections);
      // The index includes the page H1 as a section. It remains a useful
      // lesson-ranking signal, but the lesson card already links to that
      // destination, so do not let it displace a useful subsection deep link.
      const deepSectionMatches = sectionMatches.filter(match => !match.isLessonHeading);
      const sectionRelevanceFloor = deepSectionMatches.length > maxSections && deepSectionMatches[0]
        ? Math.max(3, deepSectionMatches[0].score * 0.12)
        : 0;
      const relevantSectionMatches = sectionRelevanceFloor
        ? deepSectionMatches.filter(match => match.score >= sectionRelevanceFloor)
        : deepSectionMatches;

      const titleQualifies = qualifies(titleResult, model);
      if (!titleQualifies && !relevantSectionMatches.length) continue;
      const bestSectionScore = mode === 'all' && sectionMatches.length
        ? sectionMatches[0].score
        : (relevantSectionMatches.length ? relevantSectionMatches[0].score : 0);
      // The best section drives discovery, while a direct title hit remains the
      // strongest signal. A small second-section bonus rewards broad coverage
      // without allowing long lessons to win merely because they are long.
      const totalScore = titleResult.score + bestSectionScore +
        (relevantSectionMatches[1] ? Math.min(relevantSectionMatches[1].score, 20) * 0.15 : 0);
      const combinedReasons = titleResult.reasons.concat(relevantSectionMatches[0] ? relevantSectionMatches[0].reasons : []);
      const titleExcerpt = createExcerpt(lesson.description || lesson.title, model, { maxLength: settings.excerptLength });
      results.push({
        id: lesson.id,
        path: lesson.path,
        title: lesson.title,
        description: lesson.description,
        topic: lesson.topic || lesson.category,
        level: lesson.level,
        minutes: lesson.minutes,
        interactive: asBoolean(lesson.interactive),
        score: Number(totalScore.toFixed(4)),
        matchType: resultMatchType(combinedReasons),
        reasons: combinedReasons,
        excerpt: relevantSectionMatches.length ? relevantSectionMatches[0].excerpt : titleExcerpt.text,
        highlightRanges: relevantSectionMatches.length ? relevantSectionMatches[0].highlightRanges : titleExcerpt.ranges,
        totalSectionMatches: relevantSectionMatches.length,
        sections: mode === 'titles' ? [] : relevantSectionMatches.slice(0, maxSections),
        lesson
      });
    }

    results.sort(compareResults);
    // Long lesson bodies inevitably contain generic words. When a query would
    // overflow the visible result set, remove the weak tail relative to the
    // strongest match instead of presenting technically-matching noise.
    const relevanceFloor = results.length > Math.min(maxResults, 12) && results[0]
      ? Math.max(8, results[0].score * 0.15)
      : 0;
    const relevantResults = relevanceFloor
      ? results.filter(result => result.score >= relevanceFloor)
      : results;
    const visibleResults = relevantResults.slice(0, maxResults);
    return {
      query: model.raw,
      normalizedQuery: model.normalized,
      mode,
      totalLessons: relevantResults.length,
      totalSections: relevantResults.reduce((total, result) => total + result.totalSectionMatches, 0),
      searchedLessons: filteredLessons.length,
      results: visibleResults,
      expandedTerms: unique(model.expandedPhrases.concat(model.expandedTokens)),
      intents: model.intents.map(intent => intent.id),
      suggestions: relevantResults.length ? [] : relatedQueries(query, index, { limit: 5 })
    };
  }

  function relatedQueries(query, index, options) {
    const settings = options || {};
    const limit = Math.max(1, Number(settings.limit) || 5);
    const model = expandQuery(query);
    const suggestions = [];
    for (const intent of model.intents) suggestions.push(intent.suggestion);
    suggestions.push(...model.expandedPhrases);

    // Use the catalog itself, so this continues to work as future lessons and
    // sections are added. A one-edit typo in any substantial query token can
    // surface the real title or heading without a hard-coded lesson list.
    const candidates = [];
    for (const lesson of unpackLessons(index)) {
      candidates.push(safeText(lesson.title));
      for (const section of Array.isArray(lesson.sections) ? lesson.sections : []) {
        candidates.push(safeText(section.heading));
      }
    }
    for (const candidate of candidates) {
      if (!candidate) continue;
      const candidateTokens = tokenizeQuery(candidate);
      let relevance = 0;
      for (const token of model.tokens) {
        const match = bestTokenMatch(token, candidateTokens, true);
        relevance += match.quality;
      }
      if (relevance > 0) suggestions.push({ value: candidate, score: relevance });
    }

    const scored = new Map();
    for (const suggestion of suggestions) {
      const value = typeof suggestion === 'string' ? suggestion : suggestion.value;
      const score = typeof suggestion === 'string' ? 2 : suggestion.score;
      const normalized = normalizeText(value);
      if (!normalized || normalized === model.normalized) continue;
      const previous = scored.get(normalized);
      if (!previous || previous.score < score) scored.set(normalized, { value, score });
    }
    return [...scored.values()]
      .sort((left, right) => right.score - left.score || left.value.localeCompare(right.value))
      .slice(0, limit)
      .map(item => item.value);
  }

  return Object.freeze({
    VERSION,
    MODES: Object.freeze([...MODES]),
    FIELD_WEIGHTS,
    normalizeText,
    tokenizeQuery,
    damerauLevenshtein,
    expandQuery,
    searchIndex,
    createExcerpt,
    findHighlightRanges,
    highlightText,
    relatedQueries,
    prepareIndex
  });
}));
