import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { PaymentForm } from "./PaymentForm";

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () =>
      Promise.resolve({
        decision: "allow",
        reasons: ["Test reason"],
        agentTrace: [],
        requestId: "req_test"
      }),
  })
) as jest.Mock;

describe("PaymentForm", () => {
  it("renders and submits form", async () => {
    render(<PaymentForm />);
    fireEvent.change(screen.getByLabelText(/customer id/i), { target: { value: "c_999" } });
    fireEvent.change(screen.getByLabelText(/amount/i), { target: { value: "10" } });
    fireEvent.change(screen.getByLabelText(/currency/i), { target: { value: "USD" } });
    fireEvent.change(screen.getByLabelText(/payee id/i), { target: { value: "p_safe" } });
    fireEvent.click(screen.getByRole("button", { name: /submit/i }));
    await waitFor(() => screen.getByText(/decision/i));
    expect(screen.getByText(/allow/i)).toBeInTheDocument();
  });
});
