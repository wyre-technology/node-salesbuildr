/**
 * Contacts resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginatedResponse } from '../pagination.js';
import { buildPaginationParams, createPaginatedIterable, type PaginatedIterable } from '../pagination.js';
import type {
  Contact,
  ContactListParams,
  ContactCreateRequest,
  ContactUpdateRequest,
} from '../types/contacts.js';

/**
 * Contacts resource operations
 */
export class ContactsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List contacts with pagination
   * GET /contact
   */
  async list(params?: ContactListParams): Promise<PaginatedResponse<Contact>> {
    const queryParams: Record<string, string | number | undefined> = {
      ...buildPaginationParams(params),
    };
    if (params?.companyId) {
      queryParams['companyId'] = params.companyId;
    }

    return this.httpClient.request<PaginatedResponse<Contact>>('/contact', {
      params: queryParams,
    });
  }

  /**
   * List all contacts with automatic pagination
   */
  listAll(params?: ContactListParams): PaginatedIterable<Contact> {
    const additionalParams: Record<string, string | number | boolean | undefined> = {};
    if (params?.companyId) {
      additionalParams['companyId'] = params.companyId;
    }

    return createPaginatedIterable<Contact>(
      this.httpClient,
      this.config.baseUrl,
      '/contact',
      params,
      additionalParams
    );
  }

  /**
   * Get a single contact by ID
   * GET /contact/{id}
   */
  async get(id: string): Promise<Contact> {
    return this.httpClient.request<Contact>(`/contact/${id}`);
  }

  /**
   * Create a new contact
   * POST /contact
   */
  async create(data: ContactCreateRequest): Promise<Contact> {
    return this.httpClient.request<Contact>('/contact', { method: 'POST', body: data });
  }

  /**
   * Update an existing contact
   * PUT /contact/{id}
   */
  async update(id: string, data: ContactUpdateRequest): Promise<Contact> {
    return this.httpClient.request<Contact>(`/contact/${id}`, { method: 'PUT', body: data });
  }

  /**
   * Delete a contact
   * DELETE /contact/{id}
   */
  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>(`/contact/${id}`, { method: 'DELETE' });
  }
}
