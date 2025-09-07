import { Injectable } from '@nestjs/common';
import { DecidePaymentDto, DecideResponse } from './dto';
import { getByKey, setIfAbsent } from '../store/idempotency.store';
import { AgentService } from '../agent/agent.service';
import { allow } from '../common/rate-limiter';
import { withLock } from '../common/lock-manager';
import { customers, payments } from '../store/db';

@Injectable()
export class PaymentsService {
  constructor(private readonly agent: AgentService) {}

  async decide(dto: DecidePaymentDto, requestId: string): Promise<DecideResponse> {
    // Rate limit per customer
    if (!allow(dto.customerId)) throw new Error('rate_limited');

    // Idempotency: return cached response if exists
    const cached = getByKey(dto.idempotencyKey);
    if (cached) return { ...cached, requestId };

    // Concurrency safety: lock per-customer for balance updates
    const result = await withLock(`cust:${dto.customerId}`, async () => {
      const { decision, reasons, trace } = await this.agent.decide({ customerId: dto.customerId, amount: dto.amount, payeeId: dto.payeeId });

      // simulate balance reserve on allow
      if (decision === 'allow') {
        const c = customers.get(dto.customerId);
        if (c) c.balance = Math.max(0, c.balance - dto.amount);
      }

      const body = { decision, reasons, agentTrace: trace, requestId };
      // Save payment record & idempotent response
      payments.set(dto.idempotencyKey, { id: dto.idempotencyKey, customerId: dto.customerId, payeeId: dto.payeeId, amount: dto.amount, currency: dto.currency, decision });
      setIfAbsent(dto.idempotencyKey, body);
      return body;
    });

    return result;
  }
}
