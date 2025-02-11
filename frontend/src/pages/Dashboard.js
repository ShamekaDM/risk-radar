import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";  // Import Search Bar
import Filter from "../components/Filter";  // Import Filter
import "../styles/Dashboard.css";

function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/threats/")
      .then((response) => setThreats(response.data))
      .catch((error) => console.error("Error fetching threats:", error));
  }, []);

  // Handle search input
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Handle severity filter selection
  const handleFilter = (severity) => {
    setSeverityFilter(severity);
  };

  // Filter threats based on search and filter criteria
  const filteredThreats = threats.filter((threat) => {
    return (
      (severityFilter === "All" || threat.severity === severityFilter) &&
      (threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        threat.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleDelete = async (threatId) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this threat?");
    if (!isConfirmed) return;
  
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/threats/${threatId}`);
      if (response.status === 200) {
        setThreats(threats.filter((threat) => threat._id !== threatId));
      }
    } catch (error) {
      console.error("Error deleting threat:", error);
      alert("Failed to delete threat. Please try again.");
    }
  };

  return (
    <div className="dashboard">
    <div className="table-container">
    <div className="dashboard-container">
    <h1>Threat Dashboard</h1>
    <div className="table-container">
   
    
    {/* Search & Filter Controls */}
    <div className="controls">
      <SearchBar onSearch={handleSearch} />
      <Filter onFilter={handleFilter} />
    </div>
    
    {/* Threat Table */}
    

    <table className="threat-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Severity</th>
          <th>Location</th>
          <th>Cluster</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredThreats.map((threat, index) => (
          <tr key={index}>
            <td>{threat.title}</td>
            <td>{threat.description}</td>
            <td>{threat.severity}</td>
            <td>{threat.location}</td>
            <td>{threat.cluster || "N/A"}</td>
            <td>
            <button className="delete-btn" onClick={() => handleDelete(threat._id)}>
    Delete
</button>
    </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  </div>
  </div>
</div>
  );
}

export default Dashboard;
