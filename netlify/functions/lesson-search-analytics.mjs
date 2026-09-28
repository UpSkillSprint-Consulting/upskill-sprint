import { createHash, createHmac, randomBytes } from "node:crypto";
import { getStore } from "@netlify/blobs";

export const ANALYTICS_STORE_NAME = "lesson-search-analytics";
export const MAX_REQUEST_BYTES = 4096;
export const MAX_QUERY_LENGTH = 100;
export const MAX_UNIQUE_QUERIES_PER_EVENT_PER_DAY = 500;
export const MAX_TARGETS_PER_QUERY = 40;
export const RETENTION_DAYS = 90;

const MAX_CAS_ATTEMPTS = 7;
const MAX_CLEANUP_DELETES = 2000;
const EVENT_NAMES = new Set([
  "search_committed",
  "result_selected",
  "search_reformulated",
]);
const SEARCH_MODES = new Set(["all", "titles", "sections", "examples", "formulas"]);
const INTERACTIVE_FILTERS = new Set(["all", "interactive", "noninteractive"]);
const MATCH_TYPES = new Set([
  "phrase",
  "exact",
  "prefix",
  "typo",
  "title",
  "heading",
  "keyword",
  "description",
  "body",
  "semantic",
  "formula",
  "example",
]);

const EVENT_FIELDS = Object.freeze({
  search_committed: [
    "event",
    "interactive",
    "level",
    "mode",
    "query",
    "resultCount",
    "sectionCount",
    "topic",
  ],
  result_selected: [
    "event",
    "matchType",
    "query",
    "rank",
    "resultCount",
    "sectionId",
    "targetPath",
  ],
  search_reformulated: ["event", "previousQuery", "query"],
});

const CONTROL_CHARACTERS = /[\u0000-\u001f\u007f]/u;
const EMAIL_ADDRESS = /\b[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9-]+(?:\.[a-z0-9-]+)+\b/iu;
const WEB_ADDRESS = /(?:https?:\/\/|www\.|\b[a-z0-9-]+(?:\.[a-z0-9-]+)*\.(?:app|ca|co|com|dev|edu|gov|io|net|org)(?:\/|\b))/iu;
const SAFE_SLUG_OR_EMPTY = /^(?:|[a-z0-9]+(?:-[a-z0-9]+)*)$/u;
const SAFE_SECTION_ID = /^(?:|[A-Za-z][A-Za-z0-9_.:~-]{0,119})$/u;

function responseHeaders(extra = {}) {
  return {
    "Cache-Control": "no-store, max-age=0",
    "Content-Security-Policy": "default-src 'none'; frame-ancestors 'none'",
    "X-Content-Type-Options": "nosniff",
    ...extra,
  };
}

function emptyResponse(status = 204) {
  return new Response(null, { status, headers: responseHeaders() });
}

function errorResponse(status, code) {
  return new Response(JSON.stringify({ error: code }), {
    status,
    headers: responseHeaders({ "Content-Type": "application/json; charset=utf-8" }),
  });
}

function sortedKeys(value) {
  return Object.keys(value).sort();
}

function hasExactKeys(value, expected) {
  const actual = sortedKeys(value);
  const wanted = [...expected].sort();
  return actual.length === wanted.length && actual.every((key, index) => key === wanted[index]);
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value) && Object.getPrototypeOf(value) === Object.prototype;
}

function isBoundedInteger(value, minimum, maximum) {
  return Number.isInteger(value) && value >= minimum && value <= maximum;
}

function containsPhoneLikeNumber(value) {
  const candidates = value.match(/\+?\d[\d\s().-]{5,}\d/gu) || [];
  return candidates.some((candidate) => {
    const digitCount = (candidate.match(/\d/g) || []).length;
    const hasPhoneFormatting = /^\s*\+/u.test(candidate) || /[().-]/u.test(candidate);
    return digitCount >= 10 || (digitCount >= 7 && hasPhoneFormatting);
  });
}

export function sanitizeQuery(value) {
  if (typeof value !== "string" || CONTROL_CHARACTERS.test(value)) {
    return null;
  }

  const query = value.normalize("NFKC").replace(/\s+/gu, " ").trim();
  if (!query || Array.from(query).length > MAX_QUERY_LENGTH) {
    return null;
  }

  if (EMAIL_ADDRESS.test(query) || WEB_ADDRESS.test(query) || containsPhoneLikeNumber(query)) {
    return null;
  }

  return query;
}

function normalizeTargetPath(value, requestOrigin) {
  if (typeof value !== "string" || !value || value.length > 240 || CONTROL_CHARACTERS.test(value)) {
    return null;
  }

  let candidate = value.trim();
  if (/^(?:lessons\/|lesson-template\.html$)/u.test(candidate)) {
    candidate = `/${candidate}`;
  }

  if (candidate.includes("?") || candidate.includes("#")) {
    return null;
  }

  try {
    const url = new URL(candidate, `${requestOrigin}/`);
    if (url.origin !== requestOrigin || url.username || url.password) {
      return null;
    }
    if (!/^\/(?:lessons\/[^?#]+|lesson-template\.html)$/u.test(url.pathname)) {
      return null;
    }
    if (CONTROL_CHARACTERS.test(decodeURIComponent(url.pathname))) {
      return null;
    }
    return url.pathname;
  } catch {
    return null;
  }
}

function validateSlug(value) {
  return typeof value === "string" && value.length <= 60 && SAFE_SLUG_OR_EMPTY.test(value);
}

export function validateEventPayload(payload, requestOrigin) {
  if (!isPlainObject(payload) || !EVENT_NAMES.has(payload.event)) {
    return { ok: false, reason: "invalid_event" };
  }

  if (!hasExactKeys(payload, EVENT_FIELDS[payload.event])) {
    return { ok: false, reason: "invalid_schema" };
  }

  const query = sanitizeQuery(payload.query);
  if (!query) {
    return { ok: false, reason: "invalid_query" };
  }

  if (payload.event === "search_committed") {
    if (
      !isBoundedInteger(payload.resultCount, 0, 10_000) ||
      !isBoundedInteger(payload.sectionCount, 0, 50_000) ||
      !validateSlug(payload.topic) ||
      !validateSlug(payload.level) ||
      !INTERACTIVE_FILTERS.has(payload.interactive) ||
      !SEARCH_MODES.has(payload.mode)
    ) {
      return { ok: false, reason: "invalid_search" };
    }
    return {
      ok: true,
      value: {
        event: payload.event,
        query,
        resultCount: payload.resultCount,
        sectionCount: payload.sectionCount,
        topic: payload.topic || "all",
        level: payload.level || "all",
        interactive: payload.interactive,
        mode: payload.mode,
      },
    };
  }

  if (payload.event === "result_selected") {
    const targetPath = normalizeTargetPath(payload.targetPath, requestOrigin);
    if (
      !targetPath ||
      !SAFE_SECTION_ID.test(payload.sectionId) ||
      !isBoundedInteger(payload.rank, 1, 500) ||
      !isBoundedInteger(payload.resultCount, 1, 10_000) ||
      !MATCH_TYPES.has(payload.matchType)
    ) {
      return { ok: false, reason: "invalid_selection" };
    }
    return {
      ok: true,
      value: {
        event: payload.event,
        query,
        targetPath,
        sectionId: payload.sectionId,
        rank: payload.rank,
        matchType: payload.matchType,
        resultCount: payload.resultCount,
      },
    };
  }

  const previousQuery = sanitizeQuery(payload.previousQuery);
  if (!previousQuery || previousQuery === query) {
    return { ok: false, reason: "invalid_reformulation" };
  }
  return {
    ok: true,
    value: {
      event: payload.event,
      previousQuery,
      query,
    },
  };
}

export function requestIsPrivacySuppressed(request) {
  return request.headers.get("Sec-GPC") === "1" || request.headers.get("DNT") === "1";
}

export function requestIsSameOrigin(request) {
  const origin = request.headers.get("Origin");
  const fetchSite = request.headers.get("Sec-Fetch-Site");
  if (!origin || (fetchSite && fetchSite !== "same-origin")) {
    return false;
  }
  try {
    return new URL(origin).origin === new URL(request.url).origin;
  } catch {
    return false;
  }
}

function readNetlifyEnvironment(environment, name) {
  try {
    return environment && typeof environment.get === "function" ? environment.get(name) : undefined;
  } catch {
    return undefined;
  }
}

export function isProductionEnvironment(environment, context) {
  return readNetlifyEnvironment(environment, "CONTEXT") === "production" || context?.deploy?.context === "production";
}

async function readJsonRequest(request) {
  const declaredLength = Number(request.headers.get("Content-Length"));
  if (Number.isFinite(declaredLength) && declaredLength > MAX_REQUEST_BYTES) {
    return { ok: false, status: 413, reason: "payload_too_large" };
  }

  const bytes = new Uint8Array(await request.arrayBuffer());
  if (bytes.byteLength > MAX_REQUEST_BYTES) {
    return { ok: false, status: 413, reason: "payload_too_large" };
  }

  try {
    return { ok: true, value: JSON.parse(new TextDecoder().decode(bytes)) };
  } catch {
    return { ok: false, status: 400, reason: "invalid_json" };
  }
}

function dayKey(now) {
  return now.toISOString().slice(0, 10);
}

function countBucket(value) {
  if (value === 0) return "0";
  if (value <= 5) return "1-5";
  if (value <= 20) return "6-20";
  return "21+";
}

function rankBucket(value) {
  if (value === 1) return "1";
  if (value <= 3) return "2-3";
  if (value <= 10) return "4-10";
  return "11+";
}

function increment(map, key, maximumKeys = 50) {
  const output = isPlainObject(map) ? { ...map } : {};
  if (Object.prototype.hasOwnProperty.call(output, key)) {
    output[key] = Math.min(Number.MAX_SAFE_INTEGER, (Number(output[key]) || 0) + 1);
    return output;
  }
  if (Object.keys(output).length < maximumKeys) {
    output[key] = 1;
  } else {
    output.other = Math.min(Number.MAX_SAFE_INTEGER, (Number(output.other) || 0) + 1);
  }
  return output;
}

function stableDigest(value) {
  return createHash("sha256").update(value).digest("hex").slice(0, 24);
}

export function fingerprintQuery(query, salt) {
  return createHmac("sha256", salt).update(query.normalize("NFKC").toLocaleLowerCase("en-US")).digest("hex").slice(0, 32);
}

export async function getOrCreateHashSalt(store, randomSource = () => randomBytes(32).toString("hex")) {
  const key = "config/query-hash-salt";
  const current = await store.get(key, { consistency: "strong" });
  if (typeof current === "string" && current.length >= 32) {
    return current;
  }

  const candidate = randomSource();
  const write = await store.set(key, candidate, { onlyIfNew: true });
  if (write.modified) {
    return candidate;
  }

  const winner = await store.get(key, { consistency: "strong" });
  if (typeof winner !== "string" || winner.length < 32) {
    throw new Error("Analytics hash salt is unavailable");
  }
  return winner;
}

async function getJsonWithMetadata(store, key) {
  const result = await store.getWithMetadata(key, { type: "json", consistency: "strong" });
  if (!result) return null;
  return result;
}

export async function reserveDailyQueryHash(
  store,
  date,
  eventName,
  queryHash,
  limit = MAX_UNIQUE_QUERIES_PER_EVENT_PER_DAY,
) {
  const key = `daily/${date}/${eventName}/_cardinality.json`;
  for (let attempt = 0; attempt < MAX_CAS_ATTEMPTS; attempt += 1) {
    const current = await getJsonWithMetadata(store, key);
    const hashes = Array.isArray(current?.data?.hashes) ? current.data.hashes : [];
    if (hashes.includes(queryHash)) return true;
    if (hashes.length >= limit) return false;

    const next = { version: 1, date, event: eventName, hashes: [...hashes, queryHash].sort() };
    const options = current?.etag ? { onlyIfMatch: current.etag } : { onlyIfNew: true };
    const result = await store.setJSON(key, next, options);
    if (result.modified) return true;
  }
  return false;
}

function newAggregate(date, eventName, queryHash) {
  return {
    version: 1,
    date,
    event: eventName,
    queryHash,
    count: 0,
  };
}

function removeReadableQueryFields(value) {
  if (Array.isArray(value)) {
    return value.map(removeReadableQueryFields);
  }
  if (!isPlainObject(value)) {
    return value;
  }

  const output = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    if (key === "query" || key === "previousQuery") continue;
    output[key] = removeReadableQueryFields(nestedValue);
  }
  return output;
}

export function applyEventToAggregate(current, event, { date, queryHash, previousQueryHash }) {
  const aggregate = isPlainObject(current)
    ? removeReadableQueryFields(current)
    : newAggregate(date, event.event, queryHash);
  aggregate.count = Math.min(Number.MAX_SAFE_INTEGER, (Number(aggregate.count) || 0) + 1);

  // The validated text is used only to compute a keyed digest. It is never
  // persisted: repeated requests must not be able to force a phrase into
  // readable storage.
  delete aggregate.query;

  if (event.event === "search_committed") {
    aggregate.resultCounts = increment(aggregate.resultCounts, countBucket(event.resultCount), 4);
    aggregate.sectionCounts = increment(aggregate.sectionCounts, countBucket(event.sectionCount), 4);
    aggregate.topics = increment(aggregate.topics, event.topic, 30);
    aggregate.levels = increment(aggregate.levels, event.level, 15);
    aggregate.interactive = increment(aggregate.interactive, event.interactive, 3);
    aggregate.modes = increment(aggregate.modes, event.mode, 5);
  } else if (event.event === "result_selected") {
    const targetKey = stableDigest(`${event.targetPath}#${event.sectionId}`);
    const targets = isPlainObject(aggregate.targets) ? { ...aggregate.targets } : {};
    if (Object.prototype.hasOwnProperty.call(targets, targetKey) || Object.keys(targets).length < MAX_TARGETS_PER_QUERY) {
      const target = isPlainObject(targets[targetKey])
        ? { ...targets[targetKey] }
        : { path: event.targetPath, sectionId: event.sectionId, count: 0 };
      target.count = Math.min(Number.MAX_SAFE_INTEGER, (Number(target.count) || 0) + 1);
      target.ranks = increment(target.ranks, rankBucket(event.rank), 4);
      target.matchTypes = increment(target.matchTypes, event.matchType, MATCH_TYPES.size);
      target.resultCounts = increment(target.resultCounts, countBucket(event.resultCount), 4);
      targets[targetKey] = target;
    } else {
      aggregate.otherTargetCount = Math.min(Number.MAX_SAFE_INTEGER, (Number(aggregate.otherTargetCount) || 0) + 1);
    }
    aggregate.targets = targets;
  } else {
    const prior = isPlainObject(aggregate.previousQueries) ? { ...aggregate.previousQueries } : {};
    const priorKey = previousQueryHash || stableDigest(event.previousQuery);
    const existing = isPlainObject(prior[priorKey])
      ? { ...prior[priorKey] }
      : { count: 0 };
    existing.count = Math.min(Number.MAX_SAFE_INTEGER, (Number(existing.count) || 0) + 1);
    delete existing.query;
    if (Object.prototype.hasOwnProperty.call(prior, priorKey) || Object.keys(prior).length < 40) {
      prior[priorKey] = existing;
    } else {
      aggregate.otherPreviousQueryCount = Math.min(Number.MAX_SAFE_INTEGER, (Number(aggregate.otherPreviousQueryCount) || 0) + 1);
    }
    aggregate.previousQueries = prior;
  }

  return aggregate;
}

export async function persistAggregateEvent(store, event, now = new Date(), randomSource) {
  const date = dayKey(now);
  const salt = await getOrCreateHashSalt(store, randomSource);
  const queryHash = fingerprintQuery(event.query, salt);
  const previousQueryHash = event.previousQuery ? fingerprintQuery(event.previousQuery, salt) : undefined;
  const reserved = await reserveDailyQueryHash(store, date, event.event, queryHash);
  if (!reserved) return { stored: false, reason: "daily_cardinality_limit" };

  const key = `daily/${date}/${event.event}/${queryHash}.json`;
  for (let attempt = 0; attempt < MAX_CAS_ATTEMPTS; attempt += 1) {
    const current = await getJsonWithMetadata(store, key);
    const next = applyEventToAggregate(current?.data, event, {
      date,
      queryHash,
      previousQueryHash,
    });
    const options = current?.etag ? { onlyIfMatch: current.etag } : { onlyIfNew: true };
    const result = await store.setJSON(key, next, options);
    if (result.modified) return { stored: true, key, aggregate: next };
  }
  return { stored: false, reason: "contention" };
}

export async function cleanupExpiredAggregates(store, now = new Date(), maxDeletes = MAX_CLEANUP_DELETES) {
  const cutoff = new Date(now.getTime() - RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const result = await store.list({ prefix: "daily/" });
  const expired = (result?.blobs || [])
    .map((blob) => blob.key)
    .filter((key) => {
      const match = /^daily\/(\d{4}-\d{2}-\d{2})\//u.exec(key);
      return Boolean(match && match[1] < cutoff);
    })
    .sort()
    .slice(0, maxDeletes);
  const deletions = await Promise.allSettled(expired.map((key) => store.delete(key)));
  const failures = deletions
    .filter((result) => result.status === "rejected")
    .map((result) => result.reason);
  if (failures.length > 0) {
    throw new AggregateError(failures, `Failed to delete ${failures.length} expired analytics aggregate(s)`);
  }
  return { cutoff, deleted: expired.length };
}

function byDescendingCount(field) {
  return (left, right) => right[field] - left[field]
    || String(left.query || left.path || left.from || "").localeCompare(String(right.query || right.path || right.from || ""));
}

// Intended for an offline/admin report. Stored records never supply readable
// query text: a reviewed hash-to-label mapping must be provided separately.
// The report deliberately omits hashes, and there is no public read endpoint.
export function summarizeImprovementSignals(records, options = {}) {
  const limit = isBoundedInteger(options.limit, 1, 100) ? options.limit : 20;
  const reviewedLabels = options.approvedQueryLabels instanceof Map
    ? options.approvedQueryLabels
    : new Map(Object.entries(isPlainObject(options.approvedQueryLabels) ? options.approvedQueryLabels : {}));
  const contentGaps = [];
  const reformulations = [];
  const selectedBySection = new Map();
  let unresolvedContentGapSearches = 0;
  let unresolvedReformulations = 0;
  const reviewedLabel = (hash) => sanitizeQuery(reviewedLabels.get(hash));

  for (const record of Array.isArray(records) ? records : []) {
    if (!isPlainObject(record) || typeof record.queryHash !== "string") continue;

    if (record.event === "search_committed") {
      const zeroResultCount = Number(record.resultCounts?.["0"]) || 0;
      const reviewedQuery = reviewedLabel(record.queryHash);
      if (zeroResultCount > 0 && reviewedQuery) {
        contentGaps.push({
          query: reviewedQuery,
          zeroResultCount,
          totalSearches: Number(record.count) || zeroResultCount,
        });
      } else if (zeroResultCount > 0) {
        unresolvedContentGapSearches += zeroResultCount;
      }
    } else if (record.event === "search_reformulated") {
      const reviewedCurrent = reviewedLabel(record.queryHash);
      for (const [previousHash, previous] of Object.entries(isPlainObject(record.previousQueries) ? record.previousQueries : {})) {
        if (!isPlainObject(previous)) continue;
        const count = Number(previous.count) || 0;
        const reviewedPrevious = reviewedLabel(previousHash);
        if (reviewedCurrent && reviewedPrevious) {
          reformulations.push({ from: reviewedPrevious, to: reviewedCurrent, count });
        } else {
          unresolvedReformulations += count;
        }
      }
    } else if (record.event === "result_selected") {
      for (const target of Object.values(isPlainObject(record.targets) ? record.targets : {})) {
        if (!isPlainObject(target) || typeof target.path !== "string" || typeof target.sectionId !== "string") continue;
        const key = `${target.path}#${target.sectionId}`;
        const current = selectedBySection.get(key) || {
          path: target.path,
          sectionId: target.sectionId,
          selections: 0,
          lowRankSelections: 0,
        };
        current.selections += Number(target.count) || 0;
        current.lowRankSelections += (Number(target.ranks?.["4-10"]) || 0) + (Number(target.ranks?.["11+"]) || 0);
        selectedBySection.set(key, current);
      }
    }
  }

  return {
    contentGaps: contentGaps.sort(byDescendingCount("zeroResultCount")).slice(0, limit),
    reformulations: reformulations.sort(byDescendingCount("count")).slice(0, limit),
    selectedSections: [...selectedBySection.values()].sort(byDescendingCount("selections")).slice(0, limit),
    unresolvedContentGapSearches,
    unresolvedReformulations,
  };
}

export async function handleLessonSearchAnalytics(request, options = {}) {
  if (request.method !== "POST") {
    return errorResponse(405, "method_not_allowed");
  }
  if (!requestIsSameOrigin(request)) {
    return errorResponse(403, "same_origin_required");
  }
  if (requestIsPrivacySuppressed(request)) {
    return emptyResponse();
  }
  if (!/^application\/json(?:\s*;|$)/iu.test(request.headers.get("Content-Type") || "")) {
    return errorResponse(415, "json_required");
  }

  const parsed = await readJsonRequest(request);
  if (!parsed.ok) {
    return errorResponse(parsed.status, parsed.reason);
  }

  const requestOrigin = new URL(request.url).origin;
  const validated = validateEventPayload(parsed.value, requestOrigin);
  if (!validated.ok) {
    return errorResponse(400, validated.reason);
  }

  const environment = options.environment ?? globalThis.Netlify?.env;
  if (!isProductionEnvironment(environment, options.context)) {
    return emptyResponse();
  }

  const storeFactory = options.getStoreImpl ?? getStore;
  try {
    const store = storeFactory(ANALYTICS_STORE_NAME);
    const now = options.now?.() ?? new Date();
    await persistAggregateEvent(store, validated.value, now, options.randomSource);
    return emptyResponse();
  } catch {
    // Analytics is intentionally non-critical: a storage outage must never block search.
    return emptyResponse(202);
  }
}

export default async function lessonSearchAnalytics(request, context) {
  return handleLessonSearchAnalytics(request, { context });
}

export const config = {
  path: "/.netlify/functions/lesson-search-analytics",
  rateLimit: {
    windowLimit: 30,
    windowSize: 60,
    aggregateBy: ["ip", "domain"],
  },
};
