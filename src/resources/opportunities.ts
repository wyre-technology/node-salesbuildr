/**
 * Opportunities resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginatedResponse } from '../pagination.js';
import { buildPaginationParams, createPaginatedIterable, type PaginatedIterable } from '../pagination.js';
import type {
  Opportunity,
  OpportunityListParams,
  OpportunityCreateRequest,
  OpportunityUpdateRequest,
} from '../types/opportunities.js';

/**
 * Opportunities resource operations
 */
export class OpportunitiesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List opportunities with pagination
   * GET /opportunities
   */
  async list(params?: OpportunityListParams): Promise<PaginatedResponse<Opportunity>> {
    return this.httpClient.request<PaginatedResponse<Opportunity>>('/opportunities', {
      params: buildPaginationParams(params),
    });
  }

  /**
   * List all opportunities with automatic pagination
   */
  listAll(params?: OpportunityListParams): PaginatedIterable<Opportunity> {
    return createPaginatedIterable<Opportunity>(
      this.httpClient,
      this.config.baseUrl,
      '/opportunities',
      params
    );
  }

  /**
   * Get a single opportunity by ID
   * GET /opportunities/{id}
   */
  async get(id: string): Promise<Opportunity> {
    return this.httpClient.request<Opportunity>(`/opportunities/${id}`);
  }

  /**
   * Create a new opportunity
   * POST /opportunities
   */
  async create(data: OpportunityCreateRequest): Promise<Opportunity> {
    return this.httpClient.request<Opportunity>('/opportunities', { method: 'POST', body: data });
  }

  /**
   * Update an existing opportunity
   * PUT /opportunities/{id}
   */
  async update(id: string, data: OpportunityUpdateRequest): Promise<Opportunity> {
    return this.httpClient.request<Opportunity>(`/opportunities/${id}`, { method: 'PUT', body: data });
  }
}
