import "../styles/AddThreat.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddThreat = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Low",
    location: "",
  });

  const navigate = useNavigate(); // Hook for navigation

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:8000/threats/", formData);
      alert("Threat added successfully!");
      navigate("/"); // Redirect to the dashboard after submission
    } catch (error) {
      console.error("Error adding threat:", error);
      alert("Failed to add threat.");
    }
  };

  return (
    <div className="form-container">
      <h2>Add New Threat</h2>
      <form onSubmit={handleSubmit}>
        <label>Threat Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
        />

        <label>Severity:</label>
        <select name="severity" value={formData.severity} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddThreat;
