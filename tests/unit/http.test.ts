/**
 * HttpClient response-handling tests.
 *
 * Regression (ported from connectwise-automate-mcp#54): API-backed calls
 * returned an empty object (200 with a non-JSON body was swallowed as `{}`),
 * and error paths threw "Body is unusable: Body has already been read" (the
 * error path consumed the body with response.json() and then re-read it with
 * response.text() in the catch). The body must be read exactly once.
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { HttpClient } from '../../src/http.js';
import { RateLimiter } from '../../src/rate-limiter.js';
import {
  SalesbuildrError,
  SalesbuildrNotFoundError,
  SalesbuildrServerError,
} from '../../src/errors.js';
import type { ResolvedConfig } from '../../src/config.js';

const config: ResolvedConfig = {
  apiKey: 'test-api-key',
  baseUrl: 'https://portal.salesbuildr.com/public-api',
  rateLimit: {
    enabled: true,
    maxRequests: 500,
    windowMs: 600_000,
    throttleThreshold: 0.8,
    retryAfterMs: 1000,
    maxRetries: 3,
  },
};

function makeClient(): HttpClient {
  return new HttpClient(config, new RateLimiter(config.rateLimit));
}

/** A real Response so body semantics (one-shot stream) are exercised. */
function realResponse(body: string, init: ResponseInit = {}): Response {
  return new Response(body, {
    status: 200,
    headers: { 'content-type': 'application/json' },
    ...init,
  });
}

describe('HttpClient response handling', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('parses a JSON 200 response', async () => {
    vi.mocked(fetch).mockResolvedValue(realResponse('[{"id":1}]'));
    const result = await makeClient().request('/companies');
    expect(result).toEqual([{ id: 1 }]);
  });

  it('parses JSON even when the content-type header is wrong', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('{"id":7}', { headers: { 'content-type': 'text/plain' } })
    );
    const result = await makeClient().request('/companies/7');
    expect(result).toEqual({ id: 7 });
  });

  it('returns {} for a genuinely empty 200/204 body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('', { status: 200, headers: { 'content-type': 'text/plain' } })
    );
    const result = await makeClient().request('/companies/7', { method: 'DELETE' });
    expect(result).toEqual({});
  });

  it('throws a descriptive error (not {}) for a 200 with a non-JSON body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('<html>WAF challenge page</html>', {
        headers: { 'content-type': 'text/html' },
      })
    );
    await expect(makeClient().request('/companies')).rejects.toThrow(
      /Expected JSON .* text\/html.*WAF challenge page/
    );
  });

  it('reads a non-JSON error body exactly once — no "Body is unusable"', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('<html>gateway error</html>', {
        status: 404,
        headers: { 'content-type': 'text/html' },
      })
    );
    // Before the fix this threw TypeError "Body is unusable: Body has already
    // been read" instead of the typed not-found error carrying the real body.
    const err = await makeClient()
      .request('/companies/999')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SalesbuildrNotFoundError);
    expect((err as SalesbuildrNotFoundError).response).toContain('gateway error');
  });

  it('passes a parsed JSON error body to the typed error', async () => {
    // 5xx retries once, then throws — both responses must be fresh.
    vi.mocked(fetch).mockResolvedValueOnce(realResponse('{"message":"boom"}', { status: 503 }));
    vi.mocked(fetch).mockResolvedValueOnce(realResponse('{"message":"boom"}', { status: 503 }));
    const err = await makeClient()
      .request('/companies')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SalesbuildrServerError);
    expect((err as SalesbuildrServerError).response).toEqual({ message: 'boom' });
  }, 15000);

  it('generic non-2xx statuses raise SalesbuildrError with the raw body', async () => {
    vi.mocked(fetch).mockResolvedValue(
      realResponse('teapot', { status: 418, headers: { 'content-type': 'text/plain' } })
    );
    const err = await makeClient()
      .request('/companies')
      .catch((e: unknown) => e);
    expect(err).toBeInstanceOf(SalesbuildrError);
    expect((err as SalesbuildrError).response).toBe('teapot');
  });
});
