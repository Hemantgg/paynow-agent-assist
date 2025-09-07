import { render, screen } from "@testing-library/react";
import '@testing-library/jest-dom';
import { Input } from "./Input";

describe("Input", () => {
  it("renders label and input", () => {
    render(<Input label="Test" id="test" value="" onChange={() => {}} />);
    expect(screen.getByLabelText("Test")).toBeInTheDocument();
  });
});
