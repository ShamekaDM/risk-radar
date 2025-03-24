import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import Dashboard from "../../pages/Dashboard";

// Mock axios requests
jest.mock("axios", () => ({
  get: jest.fn(() => Promise.resolve({ data: [
    { _id: "1", title: "Threat 1", description: "Test Description", severity: "High", type: "Phishing", location: "New York" }
  ] })),
  put: jest.fn(() => Promise.resolve({ status: 200 })),
  delete: jest.fn(() => Promise.resolve({ status: 200 })),
}));

describe("Dashboard Component", () => {
  test("renders Dashboard with title", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    expect(screen.getByText("Threat Dashboard")).toBeInTheDocument();
  });

  test("opens edit modal on edit button click", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const editButton = await screen.findByText("Edit");
    fireEvent.click(editButton);

    expect(screen.getByText("Edit Threat")).toBeInTheDocument();
  });

  test("deletes threat on delete button click", async () => {
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );

    const deleteButton = await screen.findByText("Delete");
    fireEvent.click(deleteButton);

    expect(screen.queryByText("Threat 1")).not.toBeInTheDocument();
  });
});