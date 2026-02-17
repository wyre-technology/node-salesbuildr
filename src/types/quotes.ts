/**
 * Quote types for the SalesBuildr API
 */

import type { Timestamps, QuoteStatus } from './common.js';

/**
 * Quote line item
 */
export interface QuoteLineItem {
  id?: string;
  productId?: string;
  productName?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  total?: number;
  recurring?: boolean;
  recurringInterval?: string;
}

/**
 * Quote entity
 */
export interface Quote extends Timestamps {
  id: string;
  title: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  opportunityId?: string;
  status?: QuoteStatus;
  expiresAt?: string;
  subtotal?: number;
  discount?: number;
  tax?: number;
  total?: number;
  notes?: string;
  items?: QuoteLineItem[];
}

/**
 * Parameters for listing quotes
 */
export interface QuoteListParams {
  /** Starting index (0-based) */
  from?: number;
  /** Page size (max 100) */
  size?: number;
  /** Free-text search query */
  query?: string;
  /** Sort expression, e.g. "-createdAt,+title" */
  sort?: string;
  /** Filter by company ID */
  companyId?: string;
  /** Filter by opportunity ID */
  opportunityId?: string;
}

/**
 * Line item in a quote creation request
 */
export interface QuoteLineItemRequest {
  productId?: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  discount?: number;
  recurring?: boolean;
  recurringInterval?: string;
}

/**
 * Request body for creating a quote
 */
export interface QuoteCreateRequest {
  title: string;
  companyId?: string;
  contactId?: string;
  opportunityId?: string;
  expiresAt?: string;
  notes?: string;
  items?: QuoteLineItemRequest[];
}
