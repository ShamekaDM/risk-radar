import React, { useEffect, useState } from "react";
import { fetchThreats, addThreat } from "../services/api";

function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [newThreat, setNewThreat] = useState({
    title: "",
    description: "",
    severity: "Low",
    location: "",
  });

  // Function to fetch and update threats list
  const refreshThreats = async () => {
    const data = await fetchThreats();
    setThreats(data);
  };

  useEffect(() => {
    refreshThreats();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setNewThreat({ ...newThreat, [e.target.name]: e.target.value });
  };

  // Handle form submission to add a new threat
  const handleSubmit = async (e) => {
    e.preventDefault();
    await addThreat(newThreat);
    setNewThreat({ title: "", description: "", severity: "Low", location: "" });
    refreshThreats(); // Refresh the list after adding a new threat
  };

  return (
    <div>
      <h1>Threat Dashboard</h1>

      {/* Add Threat Form */}
      <form onSubmit={handleSubmit}>
        <input type="text" name="title" placeholder="Title" value={newThreat.title} onChange={handleChange} required />
        <input type="text" name="description" placeholder="Description" value={newThreat.description} onChange={handleChange} required />
        <select name="severity" value={newThreat.severity} onChange={handleChange}>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input type="text" name="location" placeholder="Location" value={newThreat.location} onChange={handleChange} required />
        <button type="submit">Add Threat</button>
      </form>

      {/* Threats Table */}
      <table border="1">
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Severity</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {threats.length > 0 ? (
            threats.map((threat) => (
              <tr key={threat._id}>
                <td>{threat.title}</td>
                <td>{threat.description}</td>
                <td>{threat.severity}</td>
                <td>{threat.location}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">No threats found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
