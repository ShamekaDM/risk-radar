import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashboard.css"; // Import styles

function Dashboard() {
  const [threats, setThreats] = useState([]);
  const [severityFilter, setSeverityFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [clusters, setClusters] = useState([]);

  useEffect(() => {
    fetchThreats();
    fetchClusters();
  }, [severityFilter, searchQuery]);

  const fetchThreats = async () => {
    try {
      let url = "http://127.0.0.1:8000/threats/";
      const params = [];
      if (severityFilter) params.push(`severity=${severityFilter}`);
      if (searchQuery) params.push(`search=${searchQuery}`);
      if (params.length > 0) url += `?${params.join("&")}`;

      const response = await axios.get(url);
      setThreats(response.data);
    } catch (error) {
      console.error("Error fetching threats:", error);
    }
  };

  const fetchClusters = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/threats/clusters/");
      setClusters(response.data);
    } catch (error) {
      console.error("Error fetching threat clusters:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>Threat Dashboard</h1>

      <input
        type="text"
        placeholder="Search threats..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <label>Filter by Severity:</label>
      <select onChange={(e) => setSeverityFilter(e.target.value)} value={severityFilter}>
        <option value="">All</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <table>
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
          {threats.length > 0 ? (
            threats.map((threat) => {
              const cluster = clusters.find(c => c._id === threat._id);
              return (
                <tr key={threat._id}>
                  <td>{threat.title}</td>
                  <td>{threat.description}</td>
                  <td>{threat.severity}</td>
                  <td>{threat.location}</td>
                  <td>{cluster ? `Cluster ${cluster.cluster}` : "N/A"}</td>
                  <td>
                    <button onClick={() => axios.delete(`http://127.0.0.1:8000/threats/${threat._id}`)
                       .then(() => setThreats(threats.filter(t => t._id !== threat._id)))
                       .catch((err) => console.error("Error deleting threat:", err))}>
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="6">No threats found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Dashboard;
