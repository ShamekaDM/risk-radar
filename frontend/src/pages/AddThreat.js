import "../styles/AddThreat.css";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Mapping of U.S. states to latitude/longitude
const stateCoordinates = {
  Alabama: { latitude: 32.806671, longitude: -86.79113 },
  Alaska: { latitude: 61.370716, longitude: -152.404419 },
  Arizona: { latitude: 33.729759, longitude: -111.431221 },
  Arkansas: { latitude: 34.969704, longitude: -92.373123 },
  California: { latitude: 36.116203, longitude: -119.681564 },
  Colorado: { latitude: 39.550051, longitude: -105.782067 },
  Connecticut: { latitude: 41.603221, longitude: -73.087749 },
  Delaware: { latitude: 38.910832, longitude: -75.52767 },
  Florida: { latitude: 27.994402, longitude: -81.760254 },
  Georgia: { latitude: 32.157435, longitude: -82.907123 },
  Hawaii: { latitude: 19.741755, longitude: -155.844437 },
  Idaho: { latitude: 44.068203, longitude: -114.742043 },
  Illinois: { latitude: 40.633125, longitude: -89.398529 },
  Indiana: { latitude: 40.551217, longitude: -85.602364 },
  Iowa: { latitude: 41.878003, longitude: -93.097702 },
  Kansas: { latitude: 38.50029, longitude: -98.500629 },
  Kentucky: { latitude: 37.839333, longitude: -84.27002 },
  Louisiana: { latitude: 31.244823, longitude: -92.145024 },
  Maine: { latitude: 45.253783, longitude: -69.445469 },
  Maryland: { latitude: 39.045755, longitude: -76.641271 },
  Massachusetts: { latitude: 42.407211, longitude: -71.382437 },
  Michigan: { latitude: 44.314844, longitude: -85.602364 },
  Minnesota: { latitude: 46.729553, longitude: -94.6859 },
  Mississippi: { latitude: 32.741646, longitude: -89.678697 },
  Missouri: { latitude: 37.964253, longitude: -91.831833 },
  Montana: { latitude: 46.879682, longitude: -110.362566 },
  Nebraska: { latitude: 41.492537, longitude: -99.901813 },
  Nevada: { latitude: 38.80261, longitude: -116.419389 },
  New_Hampshire: { latitude: 43.193852, longitude: -71.572395 },
  New_Jersey: { latitude: 40.058324, longitude: -74.405661 },
  New_Mexico: { latitude: 34.97273, longitude: -105.032363 },
  New_York: { latitude: 43.299428, longitude: -74.217933 },
  North_Carolina: { latitude: 35.759573, longitude: -79.0193 },
  North_Dakota: { latitude: 47.551493, longitude: -101.002012 },
  Ohio: { latitude: 40.417287, longitude: -82.907123 },
  Oklahoma: { latitude: 35.007752, longitude: -97.092877 },
  Oregon: { latitude: 43.804133, longitude: -120.554201 },
  Pennsylvania: { latitude: 41.203322, longitude: -77.194525 },
  Rhode_Island: { latitude: 41.580095, longitude: -71.477429 },
  South_Carolina: { latitude: 33.836081, longitude: -81.163725 },
  South_Dakota: { latitude: 43.969515, longitude: -99.901813 },
  Tennessee: { latitude: 35.517491, longitude: -86.580447 },
  Texas: { latitude: 31.968599, longitude: -99.901813 },
  Utah: { latitude: 39.32098, longitude: -111.093731 },
  Vermont: { latitude: 44.558803, longitude: -72.577841 },
  Virginia: { latitude: 37.431573, longitude: -78.656894 },
  Washington: { latitude: 47.751074, longitude: -120.740139 },
  West_Virginia: { latitude: 38.597626, longitude: -80.454903 },
  Wisconsin: { latitude: 44.78444, longitude: -88.787868 },
  Wyoming: { latitude: 43.075968, longitude: -107.290284 },
};

const AddThreat = () => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    severity: "Low",
    type: "Malware",
    location: "Alabama",
    date: new Date(),
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({ ...formData, date });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    const newThreat = {
        title: formData.title,
        description: formData.description,
        severity: formData.severity,
        type: formData.type,
        location: formData.location,
        date: formData.date
    };

    try {
        const response = await axios.post("http://127.0.0.1:8000/threats/", newThreat);
        if (response.status === 200) {
            alert("Threat added successfully!");

            // Correct confirmation popup
            const addAnother = window.confirm("Would you like to add another threat?\n\nClick 'OK' for Yes, 'Cancel' for No.");
            
            if (addAnother) {
                // Reset the form for a new threat
                setFormData({
                    title: "",
                    description: "",
                    severity: "Low",
                    type: "Unauthorized Access",
                    location: "",
                    date: ""
                });
            } else {
                // Redirect to the dashboard if the user selects "No"
                setTimeout(() => navigate("/dashboard"), 500);
            }
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
        <input type="text" name="title" value={formData.title} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={formData.description} onChange={handleChange} required />

        <label>Severity:</label>
        <select name="severity" value={formData.severity} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <label>Type:</label>
        <select name="type" value={formData.type} onChange={handleChange}>
          <option value="Malware">Malware</option>
          <option value="Phishing">Phishing</option>
          <option value="Ransomware">Ransomware</option>
          <option value="Unauthorized Access">Unauthorized Access</option>
        </select>

        <label>Location:</label>
        <select name="location" value={formData.location} onChange={handleChange}>
          {Object.keys(stateCoordinates).map((state) => (
            <option key={state} value={state}>{state}</option>
          ))}
        </select>

        <label>Date:</label>
        <input
           type="date"
          name="date"
          value={formData.date}
           onChange={handleChange}
          required
          />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default AddThreat;