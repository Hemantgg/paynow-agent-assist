// Simple per-customer async lock using a Promise chain
const locks = new Map<string, Promise<any>>();

export async function withLock(key: string, fn: () => Promise<any>) {
  const prev = locks.get(key) || Promise.resolve();
  let release!: () => void;
  const p = new Promise<void>(res => (release = res));
  locks.set(key, prev.then(() => p));
  try {
    const result = await fn();
    return result;
  } finally {
    release();
    if (locks.get(key) === p) locks.delete(key);
  }
}
