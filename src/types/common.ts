/**
 * Common types shared across SalesBuildr resources
 */

/**
 * Opportunity stage values
 */
export type OpportunityStage =
  | 'prospect'
  | 'qualification'
  | 'proposal'
  | 'negotiation'
  | 'closed_won'
  | 'closed_lost'
  | string;

/**
 * Quote status values
 */
export type QuoteStatus =
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'accepted'
  | 'declined'
  | 'expired'
  | string;

/**
 * Common timestamp fields present on most resources
 */
export interface Timestamps {
  createdAt?: string;
  updatedAt?: string;
}
