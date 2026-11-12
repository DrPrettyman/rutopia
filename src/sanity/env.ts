export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion = "2025-10-01";

/** False until NEXT_PUBLIC_SANITY_PROJECT_ID is set, so the site still builds before Sanity is hooked up. */
export const isSanityConfigured = /^[a-z0-9-]+$/.test(projectId);
