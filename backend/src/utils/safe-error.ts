/** Return a client-safe error message; log details server-side. */
export function clientError(err: unknown, fallback = 'Something went wrong. Please try again.'): string {
  if (err instanceof Error) {
    // Allow intentionally thrown validation messages (short, no stack/path leakage)
    const msg = err.message || '';
    const looksInternal =
      /ENOENT|EACCES|EPERM|stack|at Object\.|\/Users\/|\/home\/|C:\\|node_modules|Postgrest|SQL/i.test(msg) ||
      msg.length > 180;
    if (!looksInternal && msg.length > 0) return msg;
    console.error('[DocFlow]', err);
    return fallback;
  }
  console.error('[DocFlow]', err);
  return fallback;
}
