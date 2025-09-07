import { AgentService } from '../src/agent/agent.service';

test('decision path: review for disputes and threshold', async () => {
  const agent = new AgentService();
  const res = await agent.decide({ customerId: 'c_123', amount: 250, payeeId: 'p_789' });
  expect(res.decision).toBe('review');
  expect(res.reasons).toEqual(expect.arrayContaining(['recent_disputes', 'amount_above_daily_threshold']));
  expect(res.trace.find(t => t.step === 'tool:getBalance')).toBeTruthy();
});
