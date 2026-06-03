/**
 * Minimal API wrapper. Frontend is served same-origin as the API in production,
 * so all paths are relative. In dev, Vite proxies /api → :8091.
 */

async function send(method, path, body) {
  const opts = { method, headers: { Accept: 'application/json' } };
  if (body !== undefined) {
    opts.headers['Content-Type'] = 'application/json';
    opts.body = JSON.stringify(body);
  }
  const res = await fetch(path, opts);
  if (!res.ok) {
    let detail = '';
    try { detail = await res.text(); } catch {}
    throw new Error(`HTTP ${res.status} on ${path}${detail ? ': ' + detail : ''}`);
  }
  if (res.status === 204) return null;
  try { return await res.json(); } catch { return null; }
}

export const api = {
  listExpenses:   (month) => send('GET', `/api/expenses${month ? `?month=${encodeURIComponent(month)}` : ''}`),
  addExpense:     (req)   => send('POST', '/api/expenses', req),
  editExpense:    (i, req) => send('PUT', `/api/expenses/${i}`, req),
  markPaid:       (i)     => send('POST', `/api/expenses/${i}/pay`),
  deleteExpense:  (i)     => send('DELETE', `/api/expenses/${i}`),
  summary:        ()      => send('GET', '/api/summary'),
  months:         ()      => send('GET', '/api/months'),
};
