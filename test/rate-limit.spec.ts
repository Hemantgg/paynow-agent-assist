import { allow } from '../src/common/rate-limiter';

test('rate limiter enforces ~5 rps burst', () => {
  const id = 'c_test';
  let ok = 0, denied = 0;
  for (let i = 0; i < 10; i++) (allow(id) ? ok++ : denied++);
  expect(ok).toBeLessThanOrEqual(5);
  expect(denied).toBeGreaterThan(0);
});
