// Token bucket per customerId: 5 rps, burst 5
const buckets = new Map<string, { tokens: number; last: number }>();
const RATE = 5; // tokens per second
const BURST = 5; // bucket capacity

export function allow(customerId: string): boolean {
  const now = Date.now();
  const b = buckets.get(customerId) || { tokens: BURST, last: now };
  const elapsed = (now - b.last) / 1000;
  b.tokens = Math.min(BURST, b.tokens + elapsed * RATE);
  b.last = now;
  if (b.tokens >= 1) {
    b.tokens -= 1;
    buckets.set(customerId, b);
    return true;
  }
  buckets.set(customerId, b);
  return false;
}
