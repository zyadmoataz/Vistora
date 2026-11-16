/**
 * Centralized observability & error telemetry adapter.
 * Connects easily to external APM providers (e.g. Sentry, Datadog) without coupling UI boundaries.
 */
export function reportClientError(context: string, error: unknown): void {
  if (process.env.NODE_ENV !== "production") {
    console.error(`[Vistora:${context}]`, error);
  }
}
