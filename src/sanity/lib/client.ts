import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, isSanityConfigured, projectId } from "../env";

export const client = isSanityConfigured
  ? createClient({ projectId, dataset, apiVersion, useCdn: true })
  : null;

/** Every query shares this tag; the Sanity webhook (/api/revalidate) busts it on publish. */
export const SANITY_TAG = "sanity";

export async function sanityFetch<T>(query: string, params: QueryParams = {}): Promise<T | null> {
  if (!client) return null;
  return client.fetch<T>(query, params, {
    // Webhook revalidation is the main mechanism; the hourly fallback covers a missed webhook.
    next: { revalidate: 3600, tags: [SANITY_TAG] },
  });
}
