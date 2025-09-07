import { customers, payees } from '../store/db';

export type AgentTrace = { step: string; detail: string };

export async function getBalance(customerId: string): Promise<{ balance: number; trace: AgentTrace }> {
  const c = customers.get(customerId);
  const balance = c?.balance ?? 0;
  return { balance, trace: { step: 'tool:getBalance', detail: `balance=${balance.toFixed(2)}` } };
}

export async function getRiskSignals(customerId: string, payeeId: string): Promise<{ signals: any; trace: AgentTrace }> {
  const c = customers.get(customerId);
  const p = payees.get(payeeId);
  const signals = { recent_disputes: c?.disputes30d ?? 0, device_change: !!c?.deviceChanged, payee_risk: p?.riskScore ?? 0 };
  const detail = `recent_disputes=${signals.recent_disputes}, device_change=${signals.device_change}, payee_risk=${signals.payee_risk}`;
  return { signals, trace: { step: 'tool:getRiskSignals', detail } };
}

export async function createCase(payload: any): Promise<{ id: string; trace: AgentTrace }> {
  const id = `case_${Math.random().toString(36).slice(2, 8)}`;
  // Simulate event publish
  console.log(JSON.stringify({ level: 'info', event: 'payment.decided', payload: { ...payload, caseId: id } }));
  return { id, trace: { step: 'tool:createCase', detail: `opened ${id}` } };
}
