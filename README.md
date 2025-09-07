# PayNow + Agent Assist (Backend — NestJS & Frontend — Next.js)

A tiny, production-minded slice of a payment decisioning flow with an agent that calls tools and produces a trace.

## Run locally (backend)
```bash
# 1) install
npm i -g @nestjs/cli && npm i

# 2) set API key
export API_KEY=devkey

# 3) start backend
npm run start
# server on http://localhost:3000
```

## Run locally (frontend UI)
```bash
cd ui
npm install # only needed once
npm run dev
# UI on http://localhost:3001 (or next available port)
```

- The frontend will call the backend at http://localhost:3000/payments/decide
- Make sure the backend is running and API_KEY is set to `devkey`.
- CORS is enabled for local development.

## Using the UI
- Open http://localhost:3001 in your browser.
- Fill the payment form with values (see below for test cases).
- You will see the decision, reasons, and agent trace from the backend.

### Example test values
| customerId | amount | currency | payeeId | idempotencyKey | Expected Decision |
|------------|--------|----------|---------|----------------|------------------|
| c_999      | 10     | USD      | p_safe  | e1             | allow            |
| c_123      | 999    | USD      | p_safe  | e2             | block            |
| c_123      | 50     | USD      | p_789   | e3             | review           |
| c_999      | 20     | USD      | p_999   | e4             | block            |
| c_123      | 250    | USD      | p_safe  | e5             | review           |

- Try invalid or missing fields to see error handling.
- Try submitting with the backend stopped to see network error handling.

## Sample cURL (backend only)
```bash
curl -X POST http://localhost:3000/payments/decide \
  -H 'Content-Type: application/json' \
  -H 'X-API-Key: devkey' \
  -d '{
    "customerId": "c_123",
    "amount": 125.50,
    "currency": "USD",
    "payeeId": "p_789",
    "idempotencyKey": "uuid-1"
  }' | jq
```

### Response (example)
```json
{
  "decision": "review",
  "reasons": ["recent_disputes","amount_above_daily_threshold"],
  "agentTrace": [
    {"step":"plan","detail":"Check balance, risk, and limits"},
    {"step":"tool:getBalance","detail":"balance=300.00"},
    {"step":"tool:getRiskSignals","detail":"recent_disputes=2, device_change=true, payee_risk=70"},
    {"step":"tool:createCase","detail":"opened case_ab12cd"}
  ],
  "requestId": "req_..."
}
```

## Architecture (ASCII)
```
Client -> [API Gateway]
   -> NestJS Controller -> API Key Guard -> Validation Pipe
   -> PaymentsService
       -> Idempotency Store (in-memory)
       -> RateLimiter (per customer)
       -> withLock(customer) { Agent.decide() }
           -> Tools: getBalance(), getRiskSignals(), createCase()
       -> (on allow) reserve balance
   -> Metrics (/metrics) & Logs (rid correlation)
```

## What I optimized
- **Latency:** simple in-memory stores, pre-validation, minimal deps
- **Simplicity:** plain agent orchestrator with retry/guardrails; single-file tools
- **Security:** API key, PII redaction, validation, no PII in logs

## Trade-offs
- **In-memory rate limiter & idempotency** are easy locally; Redis is better for multi-instance.
- **In-memory balance** simulation for demo; real impl: DB txn with pessimistic lock or atomic update.
- **/metrics** is minimal; Prometheus exporter would be used in prod.

## Observability
- Logs include `requestId` (either header `X-Request-Id` or generated).
- `GET /metrics` -> `{ total_requests, decision_counts, p95_latency_ms }`.

## Agentic-AI basics
- Agent plans then calls **two tools** (`getBalance`, `getRiskSignals`), retries each up to 2x.
- Fallback example: if a tool throws, retry; if still fails, you could default to `review` (TODO).

## Defense-in-depth
- Do not log `customerId` directly; redacted in `LoggingInterceptor`.
- Validation guards inputs; separates **user display text** (response) from internal reasons.

## TODO (if time bound)
- [ ] Wire metrics increments & p95 around `/payments/decide` execution
- [ ] Replace in-memory stores with Redis/Postgres
- [ ] Add Prometheus `/metrics` exporter
- [ ] Add WebSocket push for `payment.decided` events
- [ ] Expand tests for concurrency & idempotency across processes
