import { getStore } from "@netlify/blobs";
import {
  ANALYTICS_STORE_NAME,
  cleanupExpiredAggregates,
} from "./lesson-search-analytics.mjs";

export async function runLessonSearchAnalyticsCleanup(options = {}) {
  const storeFactory = options.getStoreImpl ?? getStore;
  const store = storeFactory(ANALYTICS_STORE_NAME);
  const now = options.now?.() ?? new Date();
  return cleanupExpiredAggregates(store, now);
}

export default async function lessonSearchAnalyticsCleanup() {
  await runLessonSearchAnalyticsCleanup();
}

export const config = {
  schedule: "@daily",
};
