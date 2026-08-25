# @wyre-ai/node-salesbuildr

Comprehensive, fully-typed Node.js/TypeScript client library for the [SalesBuildr](https://salesbuildr.com) public API.

## Features

- Full TypeScript support with strict types
- Zero runtime dependencies (uses native `fetch`)
- Built-in sliding-window rate limiter (500 requests / 10 minutes)
- Automatic retry with exponential backoff on 429 and 5xx errors
- Async iterable pagination for automatic page traversal
- Custom error hierarchy for granular error handling

## Requirements

- Node.js >= 22.0.0
- A SalesBuildr API key

## Installation

```bash
npm install @wyre-ai/node-salesbuildr
```

> **Note:** This package is published to GitHub Packages. Configure your `.npmrc`:
>
> ```
> @wyre-ai:registry=https://npm.pkg.github.com
> //npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
> ```

## Quick Start

```typescript
import { SalesbuildrClient } from '@wyre-ai/node-salesbuildr';

const client = new SalesbuildrClient({
  apiKey: process.env.SALESBUILDR_API_KEY!,
});

// List companies
const { results, total } = await client.companies.list({ size: 50 });
console.log(`Found ${total} companies`);

// Auto-paginate all contacts
for await (const contact of client.contacts.listAll()) {
  console.log(contact.firstName, contact.lastName);
}
```

## API Reference

### Client Configuration

```typescript
const client = new SalesbuildrClient({
  apiKey: 'your-api-key',
  baseUrl: 'https://portal.salesbuildr.com/public-api', // optional, this is the default
  rateLimit: {
    enabled: true,       // default: true
    maxRequests: 500,    // default: 500
    windowMs: 600_000,   // default: 600000 (10 minutes)
  },
});
```

### Companies

```typescript
// List with pagination
const page = await client.companies.list({ from: 0, size: 20, query: 'acme' });

// Auto-paginate
const all = await client.companies.listAll({ query: 'acme' }).toArray();

// Get by ID
const company = await client.companies.get('company-id');

// Create
const created = await client.companies.create({ name: 'Acme Corp' });

// Update
const updated = await client.companies.update('company-id', { name: 'Acme Inc' });

// Delete
await client.companies.delete('company-id');
```

### Contacts

```typescript
// List with company filter
const page = await client.contacts.list({ companyId: 'company-id' });

// Auto-paginate
for await (const contact of client.contacts.listAll()) {
  console.log(contact.email);
}

// Get, create, update, delete
const contact = await client.contacts.get('contact-id');
const created = await client.contacts.create({
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane@example.com',
  companyId: 'company-id',
});
const updated = await client.contacts.update('contact-id', { phone: '555-0100' });
await client.contacts.delete('contact-id');
```

### Products (read-only)

```typescript
const page = await client.products.list({ query: 'firewall' });
const product = await client.products.get('product-id');
const all = await client.products.listAll().toArray();
```

### Opportunities

```typescript
const page = await client.opportunities.list({ sort: '-value' });
const opp = await client.opportunities.get('opp-id');
const created = await client.opportunities.create({
  name: 'Network Refresh',
  companyId: 'company-id',
  value: 75000,
  stage: 'proposal',
  expectedCloseDate: '2026-06-30',
});
const updated = await client.opportunities.update('opp-id', { stage: 'negotiation' });
```

### Quotes

```typescript
// List with filters
const page = await client.quotes.list({
  companyId: 'company-id',
  opportunityId: 'opp-id',
});

// Get with line items
const quote = await client.quotes.get('quote-id');

// Create with items
const created = await client.quotes.create({
  title: 'Network Refresh Proposal',
  companyId: 'company-id',
  contactId: 'contact-id',
  opportunityId: 'opp-id',
  items: [
    { productId: 'prod-1', quantity: 10, unitPrice: 500 },
    { description: 'Installation labor', quantity: 8, unitPrice: 150 },
  ],
});
```

## Pagination

SalesBuildr uses offset-based pagination. Every `list()` method returns `{ results: T[], total: number }`.

For automatic pagination, use `listAll()` which returns an `AsyncIterable<T>`:

```typescript
// Iterate one-by-one
for await (const company of client.companies.listAll({ query: 'tech' })) {
  console.log(company.name);
}

// Collect all results into an array
const all = await client.contacts.listAll().toArray();
```

Parameters:
- `from` - Starting index (0-based, default: 0)
- `size` - Page size (default: 20, max: 100)
- `query` - Free-text search
- `sort` - Sort expression, e.g. `-createdAt,+name`

## Error Handling

All errors extend `SalesbuildrError` and include `statusCode` and `response` properties:

```typescript
import {
  SalesbuildrError,
  SalesbuildrAuthenticationError,
  SalesbuildrNotFoundError,
  SalesbuildrValidationError,
  SalesbuildrRateLimitError,
  SalesbuildrServerError,
} from '@wyre-ai/node-salesbuildr';

try {
  await client.companies.get('nonexistent');
} catch (error) {
  if (error instanceof SalesbuildrNotFoundError) {
    console.log('Company not found');
  } else if (error instanceof SalesbuildrAuthenticationError) {
    console.log('Invalid API key');
  } else if (error instanceof SalesbuildrRateLimitError) {
    console.log(`Rate limited, retry after ${error.retryAfter}ms`);
  } else if (error instanceof SalesbuildrValidationError) {
    console.log('Validation errors:', error.errors);
  } else if (error instanceof SalesbuildrServerError) {
    console.log(`Server error: ${error.statusCode}`);
  }
}
```

## Rate Limiting

The client includes a built-in sliding-window rate limiter matching SalesBuildr's 500 requests per 10-minute limit. It will:

1. Throttle requests as you approach the limit (at 80% capacity by default)
2. Automatically wait when the limit is reached
3. Retry on 429 responses with exponential backoff (up to 3 retries)

Check current state:

```typescript
const { currentRate, remainingRequests } = client.getRateLimiterState();
console.log(`${remainingRequests} requests remaining`);
```

## License

Apache-2.0
