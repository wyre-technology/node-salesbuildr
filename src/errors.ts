/**
 * Custom error classes for the SalesBuildr client
 */

/**
 * Base error class for all SalesBuildr errors
 */
export class SalesbuildrError extends Error {
  /** HTTP status code if applicable */
  readonly statusCode: number;
  /** Raw response data if available */
  readonly response: unknown;

  constructor(message: string, statusCode: number = 0, response?: unknown) {
    super(message);
    this.name = 'SalesbuildrError';
    this.statusCode = statusCode;
    this.response = response;
    Object.setPrototypeOf(this, SalesbuildrError.prototype);
  }
}

/**
 * Authentication error (401 unauthorized)
 */
export class SalesbuildrAuthenticationError extends SalesbuildrError {
  constructor(message: string, response?: unknown) {
    super(message, 401, response);
    this.name = 'SalesbuildrAuthenticationError';
    Object.setPrototypeOf(this, SalesbuildrAuthenticationError.prototype);
  }
}

/**
 * Resource not found error (404)
 */
export class SalesbuildrNotFoundError extends SalesbuildrError {
  constructor(message: string, response?: unknown) {
    super(message, 404, response);
    this.name = 'SalesbuildrNotFoundError';
    Object.setPrototypeOf(this, SalesbuildrNotFoundError.prototype);
  }
}

/**
 * Validation error (400)
 */
export class SalesbuildrValidationError extends SalesbuildrError {
  /** Parsed validation errors */
  readonly errors: Array<{ message: string; field?: string }>;

  constructor(message: string, errors: Array<{ message: string; field?: string }> = [], response?: unknown) {
    super(message, 400, response);
    this.name = 'SalesbuildrValidationError';
    this.errors = errors;
    Object.setPrototypeOf(this, SalesbuildrValidationError.prototype);
  }
}

/**
 * Rate limit exceeded error (429)
 */
export class SalesbuildrRateLimitError extends SalesbuildrError {
  /** Suggested retry delay in milliseconds */
  readonly retryAfter: number;

  constructor(message: string, retryAfter: number = 5000, response?: unknown) {
    super(message, 429, response);
    this.name = 'SalesbuildrRateLimitError';
    this.retryAfter = retryAfter;
    Object.setPrototypeOf(this, SalesbuildrRateLimitError.prototype);
  }
}

/**
 * Server error (500+)
 */
export class SalesbuildrServerError extends SalesbuildrError {
  constructor(message: string, statusCode: number = 500, response?: unknown) {
    super(message, statusCode, response);
    this.name = 'SalesbuildrServerError';
    Object.setPrototypeOf(this, SalesbuildrServerError.prototype);
  }
}
