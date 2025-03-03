import { render, screen } from "@testing-library/react";
import Button from "./Button.test.js";

test("renders the button with correct text", () => {
    render(<Button text="Click me" />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
});