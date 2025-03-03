import React from "react";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import axios from "axios";
import Dashboard from "../../pages/Dashboard";

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Ensures Jest loads real `react-router-dom`
  useNavigate: jest.fn(),
}));

// Mock axios
jest.mock("axios");

describe("Dashboard Component - Filtering Integration Test", () => {
  const mockThreats = [
    { _id: '1', title: "Unauthorized Access", description: "Login attempt", severity: "High", location: "DC", cluster: "Cluster 1" },
    { _id: '2', title: "Malware", description: "Malware detected", severity: "Medium", location: "NY", cluster: "Cluster 2" },
    { _id: '3', title: "Phishing", description: "Email scam", severity: "Low", location: "LA", cluster: "Cluster 3" },
  ];

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: mockThreats });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("initially displays all threats", async () => {
    render(<Dashboard />);
    
    expect(axios.get).toHaveBeenCalledWith("http://127.0.0.1:8000/threats/");

    await waitFor(() => {
      expect(screen.getByText("Unauthorized Access")).toBeInTheDocument();
      expect(screen.getByText("Malware")).toBeInTheDocument();
      expect(screen.getByText("Phishing")).toBeInTheDocument();
    });
  });

  test("filters threats by severity", async () => {
    render(<Dashboard />);

    // Mock API response for filtered threats
    axios.get.mockResolvedValueOnce({ data: [mockThreats[0]] });

    // Simulate selecting "High" severity from filter dropdown
    const filterDropdown = screen.getByLabelText("Severity Filter"); // Update this to match your actual label
    fireEvent.change(filterDropdown, { target: { value: "High" } });

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith("http://127.0.0.1:8000/threats/?severity=High");
      
      // Only "High" severity threat should be visible
      expect(screen.getByText("Unauthorized Access")).toBeInTheDocument();
      expect(screen.queryByText("Malware")).not.toBeInTheDocument();
      expect(screen.queryByText("Phishing")).not.toBeInTheDocument();
    });
  });
});