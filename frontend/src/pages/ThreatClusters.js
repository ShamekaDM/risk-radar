import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ThreatClusters = () => {
  const [clusters, setClusters] = useState([]);
  const [error, setError] = useState(null);
  const [k, setK] = useState(3);

  useEffect(() => {
    fetchClusters(k);
  }, [k]);

  const fetchClusters = async (numClusters) => {
    try {
      const response = await axios.get(`http://localhost:8000/threats/clusters?k=${numClusters}`);
      setClusters(response.data);
    } catch (err) {
      setError('Failed to fetch cluster data');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Threat Clusters</h2>
      <label>Number of Clusters: </label>
      <input
        type="number"
        min="1"
        value={k}
        onChange={(e) => setK(Number(e.target.value))}
        style={{ marginBottom: '1rem', marginLeft: '0.5rem' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" cellPadding="8" style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Severity</th>
            <th>Type</th>
            <th>Location</th>
            <th>Cluster</th>
          </tr>
        </thead>
        <tbody>
          {clusters.map((item) => (
            <tr key={item._id}>
              <td>{item.title}</td>
              <td>{item.severity}</td>
              <td>{item.type}</td>
              <td>{item.location}</td>
              <td>{item.cluster}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ThreatClusters;