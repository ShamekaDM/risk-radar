import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Filter from "../../components/Filter";

const mockSeverityFilter = jest.fn();
const mockTypeFilter = jest.fn();
const mockLocationFilter = jest.fn();

describe("Filter Component", () => {
  test("renders filter options and allows selection", () => {
    render(
      <Filter
        onSeverityFilter={mockSeverityFilter}
        onTypeFilter={mockTypeFilter}
        onLocationFilter={mockLocationFilter}
      />
    );

    fireEvent.change(screen.getByRole("combobox", { name: "" }), {
      target: { value: "High" },
    });
    expect(mockSeverityFilter).toHaveBeenCalledWith("High");

    fireEvent.change(screen.getByRole("combobox", { name: "" }), {
      target: { value: "Phishing" },
    });
    expect(mockTypeFilter).toHaveBeenCalledWith("Phishing");
  });
});