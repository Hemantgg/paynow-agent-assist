// Stores response bodies keyed by idempotencyKey
const store = new Map<string, any>();

export function getByKey(key: string) {
  return store.get(key);
}
export function setIfAbsent(key: string, value: any) {
  if (!store.has(key)) store.set(key, value);
  return store.get(key);
}
