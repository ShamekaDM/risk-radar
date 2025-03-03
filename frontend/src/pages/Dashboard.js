import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import "../styles/Dashboard.css";

function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [severityFilter, setSeverityFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [locationFilter, setLocationFilter] = useState("All");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // Fetch threats from backend
  useEffect(() => {
    axios.get("http://127.0.0.1:8000/threats/")
      .then((response) => {
        console.log("Fetched threats:", response.data);  // Debugging log
        setThreats(response.data);
      })
      .catch((error) => console.error("Error fetching threats:", error));
  }, []);

  // Handle search input
  const handleSearch = (query) => setSearchQuery(query);
  const handleFilter = (severity) => setSeverityFilter(severity);
  const handleTypeFilter = (type) => setTypeFilter(type);
  const handleLocationFilter = (location) => setLocationFilter(location);
  const handleDateRange = (start, end) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Ensure timestamp is formatted correctly
  const formatDate = (timestamp) => {
    if (!timestamp || isNaN(Date.parse(timestamp))) return "N/A";
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric", month: "2-digit", day: "2-digit"
    });
  };

  // Filter threats based on search and filter criteria
  const filteredThreats = threats.filter((threat) => {
    const matchesSeverity = severityFilter === "All" || threat.severity === severityFilter;
    const matchesType = typeFilter === "All" || threat.type === typeFilter;
    const matchesLocation = locationFilter === "All" || threat.location === locationFilter;
    const matchesSearch =
      threat.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.severity.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      threat.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      formatDate(threat.timestamp).includes(searchQuery);

    const threatDate = threat.timestamp ? new Date(threat.timestamp) : null;
    const matchesDateRange =
      (!startDate || (threatDate && threatDate >= startDate)) &&
      (!endDate || (threatDate && threatDate <= endDate));

    return matchesSeverity && matchesType && matchesLocation && matchesSearch && matchesDateRange;
  });

  // Delete threat function
  const handleDelete = async (threatId) => {
    if (!threatId) {
      console.error("Error: Threat ID is missing.");
      alert("Failed to delete threat. Threat ID is missing.");
      return;
    }

    const isConfirmed = window.confirm("Are you sure you want to delete this threat?");
    if (!isConfirmed) return;

    try {
      console.log("Deleting threat with ID:", threatId);

      const response = await axios.delete(`http://127.0.0.1:8000/threats/${threatId}`);

      if (response.status === 200) {
        console.log("Threat deleted successfully:", threatId);
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
        <h1>Threat Dashboard</h1>
        <div className="controls">
          <SearchBar onSearch={handleSearch} />
          <Filter
            onSeverityFilter={handleFilter}
            onTypeFilter={handleTypeFilter}
            onLocationFilter={handleLocationFilter}
            onDateRange={handleDateRange}
          />
        </div>

        <table className="threat-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Severity</th>
              <th>Type</th>
              <th>Location</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredThreats.map((threat, index) => (
              <tr key={index}>
                <td>{threat.title}</td>
                <td>{threat.description}</td>
                <td>{threat.severity}</td>
                <td>{threat.type || "Unknown"}</td>
                <td>{threat.location}</td>
                <td>{formatDate(threat.timestamp)}</td>
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
  );
}

export default Dashboard;