import cases from './cases.json';
import { PaymentsService } from '../src/payments/payments.service';
import { AgentService } from '../src/agent/agent.service';

(async () => {
  const svc = new PaymentsService(new AgentService());
  let pass = 0;
  for (const c of cases as any[]) {
    const res = await svc.decide(c.input, `req_${c.name}`);
    const ok = res.decision === c.expect;
    console.log(`${c.name}: ${ok ? 'PASS' : 'FAIL'} -> ${res.decision}`);
    if (ok) pass++;
  }
  console.log(`\nAccuracy: ${pass}/${(cases as any[]).length}`);
})();
