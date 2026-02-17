/**
 * Main SalesBuildr Client
 */

import type { SalesbuildrConfig, ResolvedConfig } from './config.js';
import { resolveConfig } from './config.js';
import { HttpClient } from './http.js';
import { RateLimiter } from './rate-limiter.js';
import { CompaniesResource } from './resources/companies.js';
import { ContactsResource } from './resources/contacts.js';
import { ProductsResource } from './resources/products.js';
import { OpportunitiesResource } from './resources/opportunities.js';
import { QuotesResource } from './resources/quotes.js';

/**
 * SalesBuildr API Client
 *
 * @example
 * ```typescript
 * const client = new SalesbuildrClient({
 *   apiKey: 'your-api-key',
 * });
 *
 * // List companies
 * const companies = await client.companies.list({ size: 50 });
 *
 * // Auto-paginate all contacts
 * for await (const contact of client.contacts.listAll()) {
 *   console.log(contact.firstName, contact.lastName);
 * }
 *
 * // Create an opportunity
 * const opportunity = await client.opportunities.create({
 *   name: 'New Deal',
 *   companyId: 'abc-123',
 *   value: 50000,
 *   stage: 'proposal',
 * });
 * ```
 */
export class SalesbuildrClient {
  private readonly config: ResolvedConfig;
  private readonly rateLimiter: RateLimiter;
  private readonly httpClient: HttpClient;

  /** Company operations */
  readonly companies: CompaniesResource;
  /** Contact operations */
  readonly contacts: ContactsResource;
  /** Product operations (read-only) */
  readonly products: ProductsResource;
  /** Opportunity operations */
  readonly opportunities: OpportunitiesResource;
  /** Quote operations */
  readonly quotes: QuotesResource;

  constructor(config: SalesbuildrConfig) {
    this.config = resolveConfig(config);
    this.rateLimiter = new RateLimiter(this.config.rateLimit);
    this.httpClient = new HttpClient(this.config, this.rateLimiter);

    // Initialize resources
    this.companies = new CompaniesResource(this.httpClient, this.config);
    this.contacts = new ContactsResource(this.httpClient, this.config);
    this.products = new ProductsResource(this.httpClient, this.config);
    this.opportunities = new OpportunitiesResource(this.httpClient, this.config);
    this.quotes = new QuotesResource(this.httpClient, this.config);
  }

  /**
   * Get the current configuration
   */
  getConfig(): Readonly<ResolvedConfig> {
    return this.config;
  }

  /**
   * Get the current rate limiter state
   */
  getRateLimiterState(): { currentRate: number; remainingRequests: number } {
    return {
      currentRate: this.rateLimiter.getCurrentRate(),
      remainingRequests: this.rateLimiter.getRemainingRequests(),
    };
  }
}
