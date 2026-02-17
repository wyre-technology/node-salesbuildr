/**
 * Pagination utilities for the SalesBuildr API
 *
 * SalesBuildr uses offset-based pagination with `from` (starting index) and `size` (page size).
 * List responses return `{ results: T[], total: number }`.
 */

import type { HttpClient } from './http.js';

/**
 * Pagination parameters for list requests
 */
export interface PaginationParams {
  /** Starting index (0-based, default: 0) */
  from?: number;
  /** Page size (default: 20, max: 100) */
  size?: number;
  /** Free-text search query */
  query?: string;
  /** Sort expression, e.g. "-createdAt,+name" */
  sort?: string;
}

/**
 * Generic paginated response structure from SalesBuildr
 */
export interface PaginatedResponse<T> {
  /** Array of items in the current page */
  results: T[];
  /** Total number of items matching the query */
  total: number;
}

/**
 * Async iterable wrapper for paginated results
 *
 * Automatically fetches subsequent pages by advancing `from` by `size`
 * until `from >= total`.
 */
export class PaginatedIterable<T> implements AsyncIterable<T> {
  private readonly httpClient: HttpClient;
  private readonly basePath: string;
  private readonly baseUrl: string;
  private readonly params: PaginationParams;
  private readonly additionalParams: Record<string, string | number | boolean | undefined>;

  constructor(
    httpClient: HttpClient,
    baseUrl: string,
    basePath: string,
    params: PaginationParams = {},
    additionalParams: Record<string, string | number | boolean | undefined> = {}
  ) {
    this.httpClient = httpClient;
    this.baseUrl = baseUrl;
    this.basePath = basePath;
    this.params = params;
    this.additionalParams = additionalParams;
  }

  async *[Symbol.asyncIterator](): AsyncIterator<T> {
    const size = this.params.size ?? 20;
    let from = this.params.from ?? 0;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const url = this.buildUrl(from, size);
      const response = await this.httpClient.requestUrl<PaginatedResponse<T>>(url);

      if (response.results) {
        for (const item of response.results) {
          yield item;
        }
      }

      // Advance the offset
      from += size;

      // Stop when we've fetched all results
      if (from >= response.total) {
        break;
      }
    }
  }

  /**
   * Collect all items into an array
   */
  async toArray(): Promise<T[]> {
    const items: T[] = [];
    for await (const item of this) {
      items.push(item);
    }
    return items;
  }

  /**
   * Build a URL for a specific offset
   */
  private buildUrl(from: number, size: number): string {
    const searchParams = new URLSearchParams();

    searchParams.append('from', String(from));
    searchParams.append('size', String(size));

    if (this.params.query) {
      searchParams.append('query', this.params.query);
    }
    if (this.params.sort) {
      searchParams.append('sort', this.params.sort);
    }

    // Add any additional filter parameters
    for (const [key, value] of Object.entries(this.additionalParams)) {
      if (value !== undefined) {
        searchParams.append(key, String(value));
      }
    }

    const queryString = searchParams.toString();
    return `${this.baseUrl}${this.basePath}?${queryString}`;
  }
}

/**
 * Build pagination query parameters for SalesBuildr API
 */
export function buildPaginationParams(params?: PaginationParams): Record<string, string | number | undefined> {
  if (!params) {
    return {};
  }
  return {
    from: params.from,
    size: params.size,
    query: params.query,
    sort: params.sort,
  };
}

/**
 * Create a paginated iterable for a resource
 */
export function createPaginatedIterable<T>(
  httpClient: HttpClient,
  baseUrl: string,
  path: string,
  params?: PaginationParams,
  additionalParams?: Record<string, string | number | boolean | undefined>
): PaginatedIterable<T> {
  return new PaginatedIterable<T>(
    httpClient,
    baseUrl,
    path,
    params,
    additionalParams
  );
}
