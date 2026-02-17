/**
 * Opportunity types for the SalesBuildr API
 */

import type { Timestamps, OpportunityStage } from './common.js';

/**
 * Opportunity entity
 */
export interface Opportunity extends Timestamps {
  id: string;
  name: string;
  companyId?: string;
  companyName?: string;
  contactId?: string;
  contactName?: string;
  value?: number;
  stage?: OpportunityStage;
  expectedCloseDate?: string;
  description?: string;
  probability?: number;
  owner?: string;
}

/**
 * Parameters for listing opportunities
 */
export interface OpportunityListParams {
  /** Starting index (0-based) */
  from?: number;
  /** Page size (max 100) */
  size?: number;
  /** Free-text search query */
  query?: string;
  /** Sort expression, e.g. "-value,+name" */
  sort?: string;
}

/**
 * Request body for creating an opportunity
 */
export interface OpportunityCreateRequest {
  name: string;
  companyId?: string;
  contactId?: string;
  value?: number;
  stage?: OpportunityStage;
  expectedCloseDate?: string;
  description?: string;
  probability?: number;
}

/**
 * Request body for updating an opportunity
 */
export interface OpportunityUpdateRequest {
  name?: string;
  companyId?: string;
  contactId?: string;
  value?: number;
  stage?: OpportunityStage;
  expectedCloseDate?: string;
  description?: string;
  probability?: number;
}
