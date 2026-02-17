/**
 * Quotes resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginatedResponse } from '../pagination.js';
import { buildPaginationParams, createPaginatedIterable, type PaginatedIterable } from '../pagination.js';
import type { Quote, QuoteListParams, QuoteCreateRequest } from '../types/quotes.js';

/**
 * Quotes resource operations
 */
export class QuotesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List quotes with pagination
   * GET /quotes
   */
  async list(params?: QuoteListParams): Promise<PaginatedResponse<Quote>> {
    const queryParams: Record<string, string | number | undefined> = {
      ...buildPaginationParams(params),
    };
    if (params?.companyId) {
      queryParams['companyId'] = params.companyId;
    }
    if (params?.opportunityId) {
      queryParams['opportunityId'] = params.opportunityId;
    }

    return this.httpClient.request<PaginatedResponse<Quote>>('/quotes', {
      params: queryParams,
    });
  }

  /**
   * List all quotes with automatic pagination
   */
  listAll(params?: QuoteListParams): PaginatedIterable<Quote> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};
    if (params?.companyId) {
      additionalParams['companyId'] = params.companyId;
    }
    if (params?.opportunityId) {
      additionalParams['opportunityId'] = params.opportunityId;
    }

    return createPaginatedIterable<Quote>(
      this.httpClient,
      this.config.baseUrl,
      '/quotes',
      params,
      additionalParams
    );
  }

  /**
   * Get a single quote by ID (includes line items)
   * GET /quotes/{id}
   */
  async get(id: string): Promise<Quote> {
    return this.httpClient.request<Quote>(`/quotes/${id}`);
  }

  /**
   * Create a new quote
   * POST /quotes
   */
  async create(data: QuoteCreateRequest): Promise<Quote> {
    return this.httpClient.request<Quote>('/quotes', { method: 'POST', body: data });
  }
}
