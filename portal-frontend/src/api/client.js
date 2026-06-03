/**
 * Portal API client.
 *
 * The frontend is served from the same origin as the API in production
 * (Spring Boot's static-resources handler) so all paths are relative.
 * In dev, Vite proxies `/api/**` to `http://localhost:8090`.
 */

const DEFAULT_TIMEOUT_MS = 10_000;

class ApiError extends Error {
  constructor(message, { status, cause } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status ?? 0;
    if (cause) this.cause = cause;
  }
}

async function fetchJson(path, { signal, timeoutMs = DEFAULT_TIMEOUT_MS } = {}) {
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);

  // Chain caller's signal with our timeout signal.
  // We track which side initiated the abort so we can report the right error.
  if (signal) {
    if (signal.aborted) controller.abort();
    else signal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  let response;
  try {
    response = await fetch(path, {
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      if (timedOut) {
        // OUR timer fired — this is a real timeout.
        throw new ApiError('Request timed out', { cause: err });
      }
      // The caller aborted (component unmounted, etc.). Re-throw as a plain
      // AbortError so callers can ignore it via `err.name === 'AbortError'`.
      const abortErr = new Error('Request aborted by caller');
      abortErr.name = 'AbortError';
      throw abortErr;
    }
    throw new ApiError('Network error — is the portal backend running on port 8090?', { cause: err });
  }
  clearTimeout(timer);

  if (!response.ok) {
    throw new ApiError(`Request failed with HTTP ${response.status}`, { status: response.status });
  }

  try {
    return await response.json();
  } catch (err) {
    throw new ApiError('Response was not valid JSON', { cause: err });
  }
}

export function fetchModules(opts) {
  return fetchJson('/api/modules', opts);
}

export function fetchGroup(opts) {
  return fetchJson('/api/group', opts);
}

export function fetchHealth(opts) {
  return fetchJson('/api/health', opts);
}

export { ApiError };
