import React, { useState, useEffect } from "react";
import axios from "axios";

function EditModal({ editThreat, setEditThreat, onUpdate, setThreats }) {
  // Initialize updatedThreat state when editThreat changes
  const [updatedThreat, setUpdatedThreat] = useState(editThreat || {});

  useEffect(() => {
    if (editThreat) {
      setUpdatedThreat(editThreat);
    }
  }, [editThreat]);

  if (!editThreat) return null; // Ensure modal doesn't render if no threat is selected

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedThreat((prev) => ({ ...prev, [name]: value }));
  };

  // Handle update request
  const handleUpdate = async () => {
    if (!updatedThreat.title || !updatedThreat.description) {
      alert("Title and description cannot be empty.");
      return;
    }

    // Create a copy of the edited threat and remove `_id`
    const { _id, ...threatData } = updatedThreat;

    // Automatically update the date to the current date
    threatData.date = new Date().toISOString();

    console.log("🛠 Sending update request for:", _id, threatData); // Debugging log

    try {
      const response = await axios.put(`http://127.0.0.1:8000/threats/${_id}`, threatData);

      if (response.status === 200) {
        alert(" Threat updated successfully!");

        // Update the UI immediately
        setThreats((prevThreats) =>
          prevThreats.map((t) => (t._id === _id ? { ...t, ...threatData } : t))
        );

        setEditThreat(null); // Close modal after update
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error(" Update failed:", error.response?.data || error);
      alert(`Failed to update threat: ${error.response?.data?.detail || "Unknown error"}`);
    }
  };

  return (
    <div className="edit-modal-overlay">
      <div className="edit-modal">
        <h2>Edit Threat</h2>

        <div className="form-group">
          <label>Title:</label>
          <input type="text" name="title" value={updatedThreat.title} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={updatedThreat.description} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label>Severity:</label>
          <select name="severity" value={updatedThreat.severity} onChange={handleChange}>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Type:</label>
          <select name="type" value={updatedThreat.type} onChange={handleChange}>
            <option value="Data Leak">Data Leak</option>
            <option value="Denial of Service">Denial of Service</option>
            <option value="Exploit">Exploit</option>
            <option value="Injection">Injection</option>
            <option value="Malware">Malware</option>
            <option value="Network Anomaly">Network Anomaly</option>
            <option value="Phishing">Phishing</option>
            <option value="Ransomware">Ransomware</option>
            <option value="Unauthorized Access">Unauthorized Access</option>
          </select>
        </div>

        <div className="form-group">
          <label>Location:</label>
          <select name="location" value={updatedThreat.location} onChange={handleChange}>
            {[
              "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut",
              "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa",
              "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan",
              "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire",
              "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio",
              "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
              "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
              "Wisconsin", "Wyoming"
            ].map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="update-btn" onClick={handleUpdate}>Update</button>
          <button className="cancel-btn" onClick={() => setEditThreat(null)}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

export default EditModal;
