import { NextResponse } from "next/server";

export async function POST(req: Request) {
  // Simulate a payment decision
  const { amount, payee } = await req.json();
  // Simulate latency
  await new Promise((r) => setTimeout(r, 500));
  if (!amount || !payee) {
    return NextResponse.json({ message: "Missing amount or payee" }, { status: 400 });
  }
  // Fake decision logic
  const approved = Number(amount) < 1000;
  return NextResponse.json({
    decision: approved ? "APPROVED" : "DECLINED",
    reasons: approved
      ? ["Amount is within allowed limit.", `Payee: ${payee}`]
      : ["Amount exceeds approval threshold.", `Payee: ${payee}`],
    agentTrace: [
      {
        step: "1",
        tool: "CheckAmount",
        input: amount,
        output: approved ? "OK" : "Too high",
      },
      {
        step: "2",
        tool: "CheckPayee",
        input: payee,
        output: payee ? "OK" : "Missing",
      },
    ],
  });
}
