/**
 * Contact types for the SalesBuildr API
 */

import type { Timestamps } from './common.js';

/**
 * Contact entity
 */
export interface Contact extends Timestamps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  companyName?: string;
  jobTitle?: string;
  notes?: string;
}

/**
 * Parameters for listing contacts
 */
export interface ContactListParams {
  /** Starting index (0-based) */
  from?: number;
  /** Page size (max 100) */
  size?: number;
  /** Free-text search query */
  query?: string;
  /** Sort expression, e.g. "-createdAt,+lastName" */
  sort?: string;
  /** Filter by company ID */
  companyId?: string;
}

/**
 * Request body for creating a contact
 */
export interface ContactCreateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  companyId?: string;
  jobTitle?: string;
  notes?: string;
}

/**
 * Request body for updating a contact
 */
export interface ContactUpdateRequest {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  companyId?: string;
  jobTitle?: string;
  notes?: string;
}
