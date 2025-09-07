import { PaymentsService } from '../src/payments/payments.service';
import { AgentService } from '../src/agent/agent.service';

const svc = new PaymentsService(new AgentService());

// monkeypatch rate limiter to avoid flakiness in tests
jest.mock('../src/common/rate-limiter', () => ({ allow: () => true }));

it('returns identical response for same idempotencyKey', async () => {
  const dto = { customerId: 'c_999', amount: 10, currency: 'USD', payeeId: 'p_safe', idempotencyKey: 'uuid-1' } as any;
  const a = await svc.decide(dto, 'req1');
  const b = await svc.decide(dto, 'req2');
  expect(a.decision).toBe(b.decision);
  expect(a.agentTrace).toEqual(b.agentTrace);
});
