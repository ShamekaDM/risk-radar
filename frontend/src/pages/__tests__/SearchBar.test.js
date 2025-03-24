import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../../components/SearchBar";

test("calls search function on input", () => {
  const mockSearch = jest.fn();

  render(<SearchBar onSearch={mockSearch} />);

  const input = screen.getByPlaceholderText("Search threats...");
  fireEvent.change(input, { target: { value: "Malware" } });

  expect(mockSearch).toHaveBeenCalledWith("Malware");
});