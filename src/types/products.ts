/**
 * Product types for the SalesBuildr API
 */

import type { Timestamps } from './common.js';

/**
 * Product entity
 */
export interface Product extends Timestamps {
  id: string;
  name: string;
  description?: string;
  sku?: string;
  price?: number;
  cost?: number;
  category?: string;
  recurring?: boolean;
  recurringInterval?: string;
  active?: boolean;
}

/**
 * Parameters for listing products
 */
export interface ProductListParams {
  /** Starting index (0-based) */
  from?: number;
  /** Page size (max 100) */
  size?: number;
  /** Free-text search query */
  query?: string;
  /** Sort expression, e.g. "-price,+name" */
  sort?: string;
}
