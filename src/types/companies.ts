/**
 * Company types for the SalesBuildr API
 */

import type { Timestamps } from './common.js';

/**
 * Company entity
 */
export interface Company extends Timestamps {
  id: string;
  name: string;
  domain?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  website?: string;
  industry?: string;
  notes?: string;
}

/**
 * Parameters for listing companies
 */
export interface CompanyListParams {
  /** Starting index (0-based) */
  from?: number;
  /** Page size (max 100) */
  size?: number;
  /** Free-text search query */
  query?: string;
  /** Sort expression, e.g. "-createdAt,+name" */
  sort?: string;
}

/**
 * Request body for creating a company
 */
export interface CompanyCreateRequest {
  name: string;
  domain?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  website?: string;
  industry?: string;
  notes?: string;
}

/**
 * Request body for updating a company
 */
export interface CompanyUpdateRequest {
  name?: string;
  domain?: string;
  phone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  website?: string;
  industry?: string;
  notes?: string;
}
