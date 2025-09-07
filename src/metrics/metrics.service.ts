import { Injectable } from '@nestjs/common';

@Injectable()
export class MetricsModule {
  private totals = 0;
  private byDecision: Record<string, number> = {};
  private latencies: number[] = [];

  inc(decision: string) {
    this.totals += 1;
    this.byDecision[decision] = (this.byDecision[decision] || 0) + 1;
  }

  observeLatency(ms: number) {
    this.latencies.push(ms);
  }

  snapshot() {
    const sorted = [...this.latencies].sort((a, b) => a - b);
    const p95 = sorted.length ? sorted[Math.floor(sorted.length * 0.95) - 1] ?? sorted[sorted.length - 1] : 0;
    return { total_requests: this.totals, decision_counts: this.byDecision, p95_latency_ms: Math.max(0, p95 || 0) };
  }
}
