"use client";

import React, { useState } from "react";
import { Card } from "./Card";
import { Input } from "./Input";
import { Button } from "./Button";

export type PaymentResponse = {
  decision: string;
  reasons: string[];
  agentTrace: Array<{ step: string; detail: string }>;
  requestId: string;
};

export const PaymentForm: React.FC = () => {
  const [amount, setAmount] = useState("");
  const [payee, setPayee] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [idempotencyKey, setIdempotencyKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [response, setResponse] = useState<PaymentResponse | null>(null);
  const [showTrace, setShowTrace] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponse(null);
    setShowTrace(false);
    setLoading(true);
    setLatency(null);
    const start = performance.now();
    console.time("payment-request");
    try {
      // Call real backend
      const res = await fetch("http://localhost:3000/payments/decide", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": "devkey",
        },
        body: JSON.stringify({
          customerId,
          amount: Number(amount),
          currency,
          payeeId: payee,
          idempotencyKey: idempotencyKey || Math.random().toString(36).slice(2),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Unknown error");
      setResponse(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
      const end = performance.now();
      setLatency(end - start);
      console.timeEnd("payment-request");
    }
  };

  return (
    <Card className="max-w-md w-full">
      <h1 className="text-2xl font-bold mb-4">Payment Form</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4" aria-label="Payment form">
        <Input
          label="Customer ID"
          id="customerId"
          type="text"
          value={customerId}
          onChange={e => setCustomerId(e.target.value)}
          required
        />
        <Input
          label="Amount"
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
        />
        <Input
          label="Currency"
          id="currency"
          type="text"
          value={currency}
          onChange={e => setCurrency(e.target.value)}
          required
        />
        <Input
          label="Payee ID"
          id="payee"
          type="text"
          value={payee}
          onChange={e => setPayee(e.target.value)}
          required
        />
        <Input
          label="Idempotency Key (optional)"
          id="idempotencyKey"
          type="text"
          value={idempotencyKey}
          onChange={e => setIdempotencyKey(e.target.value)}
        />
        <Button type="submit" disabled={loading} aria-busy={loading} aria-disabled={loading}>
          {loading ? "Processing..." : "Submit"}
        </Button>
      </form>
      {latency !== null && (
        <div className="mt-2 text-xs text-gray-500">Request latency: {latency.toFixed(0)} ms</div>
      )}
      {error && <div className="mt-2 text-red-600">{error}</div>}
      {response && (
        <div className="mt-4">
          <div className="font-semibold">Decision: <span className="font-mono">{response.decision}</span></div>
          <div className="mt-2">
            <span className="font-semibold">Reasons:</span>
            <ul className="list-disc ml-6">
              {response.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>
          <Button
            type="button"
            className="mt-2 text-xs px-2 py-1"
            onClick={() => setShowTrace(v => !v)}
            aria-expanded={showTrace}
            aria-controls="agent-trace"
          >
            {showTrace ? "Hide" : "Show"} Agent Trace
          </Button>
          {showTrace && (
            <div id="agent-trace" className="mt-2 border rounded bg-gray-50 dark:bg-gray-800 p-2 text-xs overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left">Step</th>
                    <th className="text-left">Detail</th>
                  </tr>
                </thead>
                <tbody>
                  {response.agentTrace.map((t, i) => (
                    <tr key={i}>
                      <td>{t.step}</td>
                      <td>{t.detail}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
