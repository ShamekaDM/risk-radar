import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import EditModal from "../../components/EditModal";
import { BrowserRouter } from "react-router-dom"; // Ensure the router is available

const mockThreat = {
  _id: "1",
  title: "Phishing Attempt",
  description: "Fake email detected",
  severity: "Medium",
  type: "Phishing",
  location: "New York",
};

const mockSetEditThreat = jest.fn();
const mockOnUpdate = jest.fn();

describe("EditModal Component", () => {
  test("renders edit modal with correct values", () => {
    render(
      <BrowserRouter>
        <EditModal
          editThreat={mockThreat}
          setEditThreat={mockSetEditThreat}
          onUpdate={mockOnUpdate}
        />
      </BrowserRouter>
    );

    expect(screen.getByDisplayValue("Phishing Attempt")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Fake email detected")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Medium")).toBeInTheDocument();
    expect(screen.getByDisplayValue(/Phishing/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue("New York")).toBeInTheDocument();
  });

  test("allows editing and saving threat", () => {
    render(
      <BrowserRouter>
        <EditModal
          editThreat={mockThreat}
          setEditThreat={mockSetEditThreat}
          onUpdate={mockOnUpdate}
        />
      </BrowserRouter>
    );

    const titleInput = screen.getByLabelText("Title:");
    fireEvent.change(titleInput, { target: { value: "Updated Phishing" } });

    const saveButton = screen.getByText("Update");
    fireEvent.click(saveButton);

    expect(mockOnUpdate).toHaveBeenCalled();
  });
});