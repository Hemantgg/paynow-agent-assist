// In-memory demo store; swap with real DB later
export type Customer = { id: string; dailyLimit: number; balance: number; disputes30d: number; deviceChanged: boolean };
export type Payee = { id: string; riskScore: number };
export type Payment = { id: string; customerId: string; payeeId: string; amount: number; currency: string; decision: string };

export const customers = new Map<string, Customer>([
  ['c_123', { id: 'c_123', dailyLimit: 200, balance: 300, disputes30d: 2, deviceChanged: true }],
  ['c_999', { id: 'c_999', dailyLimit: 1000, balance: 5000, disputes30d: 0, deviceChanged: false }]
]);

export const payees = new Map<string, Payee>([
  ['p_789', { id: 'p_789', riskScore: 70 }],
  ['p_safe', { id: 'p_safe', riskScore: 5 }]
]);

export const payments = new Map<string, Payment>();
