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

    const newThreat = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        location: formData.location,
        latitude: parseFloat(formData.latitude), // Ensure it's a number
        longitude: parseFloat(formData.longitude) // Ensure it's a number
    };

    try {
        const response = await axios.post("http://127.0.0.1:8000/threats/", newThreat);
        if (response.status === 200) {
            alert("Threat added successfully!");
            setFormData({ title: "", description: "", severity: "Low", location: "", latitude: "", longitude: "" });
        }
    } catch (error) {
        alert("Failed to add threat");
        console.error("Error adding threat:", error.response?.data || error);
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

        <label>Latitude:</label>
        <input
          type="numberfloat"
          name="latitude"
          value={formData.latitude}
          onChange={handleChange}
          required
        />

        <label>Longitude:</label>
        <input
          type="numberfloat"
          name="longitude"
          value={formData.longitude}
          onChange={handleChange}
          required
        />

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddThreat;
