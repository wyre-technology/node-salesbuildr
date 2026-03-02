/**
 * Products resource operations
 */

import type { HttpClient } from '../http.js';
import type { ResolvedConfig } from '../config.js';
import type { PaginatedResponse } from '../pagination.js';
import { buildPaginationParams, createPaginatedIterable, type PaginatedIterable } from '../pagination.js';
import type { Product, ProductListParams } from '../types/products.js';

/**
 * Products resource operations (read-only)
 */
export class ProductsResource {
  private readonly httpClient: HttpClient;
  private readonly config: ResolvedConfig;

  constructor(httpClient: HttpClient, config: ResolvedConfig) {
    this.httpClient = httpClient;
    this.config = config;
  }

  /**
   * List products with pagination
   * GET /product
   */
  async list(params?: ProductListParams): Promise<PaginatedResponse<Product>> {
    return this.httpClient.request<PaginatedResponse<Product>>('/product', {
      params: buildPaginationParams(params),
    });
  }

  /**
   * List all products with automatic pagination
   */
  listAll(params?: ProductListParams): PaginatedIterable<Product> {
    return createPaginatedIterable<Product>(
      this.httpClient,
      this.config.baseUrl,
      '/product',
      params
    );
  }

  /**
   * Get a single product by ID
   * GET /product/{id}
   */
  async get(id: string): Promise<Product> {
    return this.httpClient.request<Product>(`/product/${id}`);
  }
}
