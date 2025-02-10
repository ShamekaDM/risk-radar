import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Dashboard.css";


function Dashboard() {
    const [threats, setThreats] = useState([]);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/threats/")
            .then(response => {
                console.log("✅ API Response:", response.data);
                setThreats(response.data);
            })
            .catch(error => {
                console.error("❌ API Fetch Error:", error.response ? error.response.data : error);
            });
    }, []);

    const handleDelete = (threatId) => {
        if (window.confirm("Are you sure you want to delete this threat?")) {
            axios.delete(`http://127.0.0.1:8000/threats/${threatId}`)
                .then(() => {
                    alert("Threat deleted successfully!");
                    setThreats(prevThreats => prevThreats.filter(threat => threat._id !== threatId));
                })
                .catch(error => {
                    console.error("Error deleting threat:", error);
                    alert("Failed to delete threat.");
                });
        }
    };
    

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Threat Dashboard</h1>
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
                    {threats.length > 0 ? (
                        threats.map((threat, index) => (
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
                        ))
                    ) : (
                        <tr>
                            <td colSpan="5">No threats found</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Dashboard;
