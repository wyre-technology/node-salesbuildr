/**
 * Configuration types and defaults for the SalesBuildr client
 */

/**
 * Rate limiting configuration
 */
export interface RateLimitConfig {
  /** Whether rate limiting is enabled (default: true) */
  enabled: boolean;
  /** Maximum requests per window (default: 500) */
  maxRequests: number;
  /** Window duration in milliseconds (default: 600000 = 10 minutes) */
  windowMs: number;
  /** Threshold percentage to start throttling (default: 0.8 = 80%) */
  throttleThreshold: number;
  /** Delay between retries on 429 (default: 5000ms) */
  retryAfterMs: number;
  /** Maximum retry attempts on rate limit errors (default: 3) */
  maxRetries: number;
}

/**
 * Default rate limit configuration for SalesBuildr (500 req/10 min)
 */
export const DEFAULT_RATE_LIMIT_CONFIG: RateLimitConfig = {
  enabled: true,
  maxRequests: 500,
  windowMs: 600_000,
  throttleThreshold: 0.8,
  retryAfterMs: 5_000,
  maxRetries: 3,
};

/**
 * Default base URL for the SalesBuildr API
 */
export const DEFAULT_BASE_URL = 'https://portal.salesbuildr.com/public-api';

/**
 * Configuration for the SalesBuildr client
 */
export interface SalesbuildrConfig {
  /** API Key for authentication (api-key header) */
  apiKey: string;
  /** Base URL for the API (default: https://portal.salesbuildr.com/public-api) */
  baseUrl?: string;
  /** Rate limiting configuration */
  rateLimit?: Partial<RateLimitConfig>;
}

/**
 * Resolved configuration with all defaults applied
 */
export interface ResolvedConfig {
  apiKey: string;
  baseUrl: string;
  rateLimit: RateLimitConfig;
}

/**
 * Resolves a configuration object by applying defaults
 */
export function resolveConfig(config: SalesbuildrConfig): ResolvedConfig {
  if (!config.apiKey) {
    throw new Error('API key is required');
  }

  return {
    apiKey: config.apiKey,
    baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
    rateLimit: {
      ...DEFAULT_RATE_LIMIT_CONFIG,
      ...config.rateLimit,
    },
  };
}
