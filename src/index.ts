/**
 * node-salesbuildr
 * Comprehensive, fully-typed Node.js/TypeScript library for the SalesBuildr public API
 */

// Main client
export { SalesbuildrClient } from './client.js';

// Configuration
export type { SalesbuildrConfig, RateLimitConfig } from './config.js';
export { DEFAULT_RATE_LIMIT_CONFIG, DEFAULT_BASE_URL } from './config.js';

// Error classes
export {
  SalesbuildrError,
  SalesbuildrAuthenticationError,
  SalesbuildrNotFoundError,
  SalesbuildrValidationError,
  SalesbuildrRateLimitError,
  SalesbuildrServerError,
} from './errors.js';

// Pagination
export type { PaginationParams, PaginatedResponse } from './pagination.js';
export { PaginatedIterable } from './pagination.js';

// Types
export * from './types/index.js';
