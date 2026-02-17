/**
 * Companies resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginatedResponse } from '../pagination.js';
import { buildPaginationParams, createPaginatedIterable, type PaginatedIterable } from '../pagination.js';
import type {
  Company,
  CompanyListParams,
  CompanyCreateRequest,
  CompanyUpdateRequest,
} from '../types/companies.js';

/**
 * Companies resource operations
 */
export class CompaniesResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List companies with pagination
   * GET /companies
   */
  async list(params?: CompanyListParams): Promise<PaginatedResponse<Company>> {
    return this.httpClient.request<PaginatedResponse<Company>>('/companies', {
      params: buildPaginationParams(params),
    });
  }

  /**
   * List all companies with automatic pagination
   */
  listAll(params?: CompanyListParams): PaginatedIterable<Company> {
    return createPaginatedIterable<Company>(
      this.httpClient,
      this.config.baseUrl,
      '/companies',
      params
    );
  }

  /**
   * Get a single company by ID
   * GET /companies/{id}
   */
  async get(id: string): Promise<Company> {
    return this.httpClient.request<Company>(`/companies/${id}`);
  }

  /**
   * Create a new company
   * POST /companies
   */
  async create(data: CompanyCreateRequest): Promise<Company> {
    return this.httpClient.request<Company>('/companies', { method: 'POST', body: data });
  }

  /**
   * Update an existing company
   * PUT /companies/{id}
   */
  async update(id: string, data: CompanyUpdateRequest): Promise<Company> {
    return this.httpClient.request<Company>(`/companies/${id}`, { method: 'PUT', body: data });
  }

  /**
   * Delete a company
   * DELETE /companies/{id}
   */
  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>(`/companies/${id}`, { method: 'DELETE' });
  }
}
