import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import App from "../../App";

test("renders the navbar and dashboard", () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  expect(screen.getByText(/Threat Dashboard/i)).toBeInTheDocument();
});