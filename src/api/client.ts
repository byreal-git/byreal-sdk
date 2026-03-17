import type { Result } from "../types/common.js";
import type { ByrealError } from "../errors/errors.js";
import { networkError, apiError } from "../errors/errors.js";
import { ok, err } from "../types/common.js";

// ============================================
// API Client Configuration
// ============================================

export interface ApiClientConfig {
  baseUrl: string;
  timeout?: number;
  headers?: Record<string, string>;
  debug?: boolean;
}

// ============================================
// API Client Class
// ============================================

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  private headers: Record<string, string>;
  private debug: boolean;

  constructor(config: ApiClientConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.timeout = config.timeout ?? 30000;
    this.headers = {
      "Content-Type": "application/json",
      "User-Agent": "byreal-sdk",
      ...config.headers,
    };
    this.debug = config.debug ?? false;
  }

  async get<T>(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<Result<T, ByrealError>> {
    try {
      const url = this.buildUrl(endpoint, params);
      if (this.debug) {
        console.error(`[DEBUG] GET ${url}`);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: "GET",
        headers: this.headers,
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        return err(apiError(`${response.status} ${response.statusText}`, response.status));
      }

      const data = (await response.json()) as T;
      return ok(data);
    } catch (error) {
      return err(this.handleError(error));
    }
  }

  async post<T>(endpoint: string, body: Record<string, unknown>): Promise<Result<T, ByrealError>> {
    try {
      const url = this.buildUrl(endpoint);
      if (this.debug) {
        console.error(`[DEBUG] POST ${url}`);
      }

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(url, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (!response.ok) {
        return err(apiError(`${response.status} ${response.statusText}`, response.status));
      }

      const data = (await response.json()) as T;
      return ok(data);
    } catch (error) {
      return err(this.handleError(error));
    }
  }

  private buildUrl(
    endpoint: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): string {
    const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    const url = new URL(`${this.baseUrl}${path}`);

    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined) {
          url.searchParams.set(key, String(value));
        }
      }
    }

    return url.toString();
  }

  private handleError(error: unknown): ByrealError {
    if (error instanceof DOMException && error.name === "AbortError") {
      return networkError("Request timed out", { timeout_ms: this.timeout });
    }
    if (error instanceof TypeError) {
      return networkError(error.message);
    }
    if (error instanceof Error) {
      if ("code" in error) {
        return networkError(error.message, { code: (error as NodeJS.ErrnoException).code });
      }
      return networkError(error.message);
    }
    return networkError("Unknown error occurred");
  }
}
