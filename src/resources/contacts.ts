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
   * GET /contacts
   */
  async list(params?: ContactListParams): Promise<PaginatedResponse<Contact>> {
    const queryParams: Record<string, string | number | undefined> = {
      ...buildPaginationParams(params),
    };
    if (params?.companyId) {
      queryParams['companyId'] = params.companyId;
    }

    return this.httpClient.request<PaginatedResponse<Contact>>('/contacts', {
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
      '/contacts',
      params,
      additionalParams
    );
  }

  /**
   * Get a single contact by ID
   * GET /contacts/{id}
   */
  async get(id: string): Promise<Contact> {
    return this.httpClient.request<Contact>(`/contacts/${id}`);
  }

  /**
   * Create a new contact
   * POST /contacts
   */
  async create(data: ContactCreateRequest): Promise<Contact> {
    return this.httpClient.request<Contact>('/contacts', { method: 'POST', body: data });
  }

  /**
   * Update an existing contact
   * PUT /contacts/{id}
   */
  async update(id: string, data: ContactUpdateRequest): Promise<Contact> {
    return this.httpClient.request<Contact>(`/contacts/${id}`, { method: 'PUT', body: data });
  }

  /**
   * Delete a contact
   * DELETE /contacts/{id}
   */
  async delete(id: string): Promise<void> {
    await this.httpClient.request<void>(`/contacts/${id}`, { method: 'DELETE' });
  }
}
