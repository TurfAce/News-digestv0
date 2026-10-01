// A bounded cache with coalescing and a process-wide generation budget.
export function createAnalysisCache<T>(
  generate: (key: string) => Promise<T>,
  now = Date.now,
  limit = 60,
) {
  const cache = new Map<string, { value: T; expires: number }>();
  const pending = new Map<string, Promise<T>>();
  let start = now();
  let calls = 0;
  return async (key: string): Promise<T> => {
    const time = now();
    const saved = cache.get(key);
    if (saved && saved.expires > time) return saved.value;
    const active = pending.get(key);
    if (active) return active;
    if (time - start >= 3600000) {
      start = time;
      calls = 0;
    }
    if (calls >= limit || pending.size >= 3) throw new Error("RATE_LIMIT");
    calls++;
    const job = Promise.resolve()
      .then(() => generate(key))
      .then((value) => {
        if (cache.size >= 500) cache.delete(cache.keys().next().value!);
        cache.set(key, { value, expires: now() + 86400000 });
        return value;
      })
      .finally(() => pending.delete(key));
    pending.set(key, job);
    return job;
  };
}
