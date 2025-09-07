import { AgentTrace, getBalance, getRiskSignals, createCase } from './tools';

export type Decision = 'allow' | 'review' | 'block';

export class AgentService {
  private maxRetries = 2;

  async decide(input: { customerId: string; amount: number; payeeId: string }): Promise<{ decision: Decision; reasons: string[]; trace: AgentTrace[] }> {
    const trace: AgentTrace[] = [{ step: 'plan', detail: 'Check balance, risk, and limits' }];

    // Guardrailed tool calls with basic retry
    const balanceRes = await this.withRetry(() => getBalance(input.customerId));
    trace.push(balanceRes.trace);

    const riskRes = await this.withRetry(() => getRiskSignals(input.customerId, input.payeeId));
    trace.push(riskRes.trace);

    const reasons: string[] = [];
    let decision: Decision = 'allow';

    if (input.amount > (balanceRes.balance || 0)) {
      decision = 'block';
      reasons.push('insufficient_funds');
    }
    if (input.amount > 0 && input.amount >  (await this.dailyLimit(input.customerId))) {
      decision = decision === 'block' ? 'block' : 'review';
      reasons.push('amount_above_daily_threshold');
    }
    if ((riskRes.signals.recent_disputes ?? 0) >= 2 || riskRes.signals.device_change) {
      decision = decision === 'block' ? 'block' : 'review';
      reasons.push('recent_disputes');
    }
    if ((riskRes.signals.payee_risk ?? 0) >= 80) {
      decision = 'block';
      reasons.push('high_risk_payee');
    }

    if (decision !== 'allow') {
      const c = await this.withRetry(() => createCase({ ...input, reasons }));
      trace.push(c.trace);
    } else {
      trace.push({ step: 'tool:recommend', detail: 'proceed' });
    }

    return { decision, reasons, trace };
  }

  private async dailyLimit(customerId: string) {
    // tiny stub; real impl might aggregate daily payments
    return customerId === 'c_123' ? 200 : 1000;
  }

  private async withRetry<T>(fn: () => Promise<T>, attempt = 0): Promise<T> {
    try {
      return await fn();
    } catch (e) {
      if (attempt >= this.maxRetries) throw e;
      return this.withRetry(fn, attempt + 1);
    }
  }
}
