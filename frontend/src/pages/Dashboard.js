import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchBar from "../components/SearchBar";
import Filter from "../components/Filter";
import EditModal from "../components/EditModal";
import "../styles/Dashboard.css";

function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [editThreat, setEditThreat] = useState(null);
  const [filters, setFilters] = useState({
    searchQuery: "",
    severity: "All",
    type: "All",
    location: "All",
    startDate: "",
    endDate: "",
  });

  // Threat Types & US States
  const threatTypes = ["Data Leak", "Denial of Service", "Exploit", "Injection", "Malware", "Network Anomaly", "Phishing", "Ransomware", "Unauthorized Access"];
  const usStates = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware",
    "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky",
    "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico",
    "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania",
    "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont",
    "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
  ];

  // Fetch threats from backend
  useEffect(() => {
    fetchThreats();
  }, [filters]);

  const fetchThreats = () => {
    let queryParams = [];

    if (filters.startDate) queryParams.push(`start_date=${filters.startDate}`);
    if (filters.endDate) queryParams.push(`end_date=${filters.endDate}`);

    const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";

    axios
      .get(`http://127.0.0.1:8000/threats/${queryString}`)
      .then((response) => setThreats(response.data))
      .catch((error) => console.error("Error fetching threats:", error));
  };

  // Format Date for Display
  const formatDate = (dateString) => {
    if (!dateString || isNaN(Date.parse(dateString))) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  // **Fix: Correct Search Functionality**
  const filteredThreats = threats.filter((threat) => {
    const { searchQuery, severity, type, location } = filters;

    const matchesSeverity = severity === "All" || threat.severity === severity;
    const matchesType = type === "All" || threat.type === type;
    const matchesLocation = location === "All" || threat.location === location;

    const searchStr = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === "" ||
      Object.values(threat)
        .map((value) => (value !== null && value !== undefined ? value.toString().toLowerCase() : ""))
        .some((value) => value.includes(searchStr));

    return matchesSeverity && matchesType && matchesLocation && matchesSearch;
  });

  // Open Edit Modal & Populate Fields
  const handleEdit = (threat) => {
    setEditThreat({ ...threat });
  };

  // Handle Input Changes in Edit Modal
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditThreat((prev) => ({ ...prev, [name]: value }));
  };

  // Update Threat in Database
  const handleUpdate = async () => {
    try {
      const response = await axios.put(`http://127.0.0.1:8000/threats/${editThreat._id}`, editThreat);
      if (response.status === 200) {
        setThreats(threats.map((t) => (t._id === editThreat._id ? editThreat : t)));
        setEditThreat(null);
      }
    } catch (error) {
      alert("Failed to update threat.");
    }
  };

  // Delete Threat
  const handleDelete = async (threatId) => {
    console.log("Attempting to delete threat with ID:", threatId); // Debugging Log
    if (!window.confirm("Are you sure you want to delete this threat?")) return;
  
    try {
      const response = await axios.delete(`http://127.0.0.1:8000/threats/${threatId}`);
  
      if (response.status === 200 || response.status === 204) {
        console.log("Threat deleted successfully:", threatId);
        setThreats((prevThreats) => prevThreats.filter((threat) => String(threat._id) !== String(threatId)));
      } else {
        throw new Error(`Unexpected response status: ${response.status}`);
      }
    } catch (error) {
      console.error("Delete error:", error.response?.data || error);
      alert(`Failed to delete threat: ${error.response?.data?.detail || "Unknown error"}`);
    }
  };

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Threat Dashboard</h1>

      {/* Search & Filter Controls */}
      <div className="controls">
        <SearchBar onSearch={(query) => setFilters({ ...filters, searchQuery: query })} />
        <Filter
          onSeverityFilter={(severity) => setFilters({ ...filters, severity })}
          onTypeFilter={(type) => setFilters({ ...filters, type })}
          onLocationFilter={(location) => setFilters({ ...filters, location })}
        />
        <div className="date-filters">
          <label>Start Date:</label>
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
          />
          <label>End Date:</label>
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>

      {/* Threats Table */}
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
  {filteredThreats.map((threat) => (
    <tr key={threat._id}>
      <td>{threat.title.trim()}</td>
      <td>{threat.description.trim()}</td>
      <td>{threat.severity.trim()}</td>
      <td>{threat.type.trim()}</td>
      <td>{threat.location.trim()}</td>
      <td>{formatDate(threat.date)}</td>
      <td className="action-column">
        <button className="edit-btn" onClick={() => handleEdit(threat)}>Edit</button>
        <button className="delete-btn" onClick={() => handleDelete(threat._id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>

      </table>

      {/* Edit Modal */}
{editThreat && (
  <EditModal
    editThreat={editThreat}
    setEditThreat={setEditThreat}
    onUpdate={handleUpdate}
    setThreats={setThreats} //  Pass setThreats here
  />
)}


    </div>
  );
}

export default Dashboard;
