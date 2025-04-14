import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup
} from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Cluster color palette
const clusterColors = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
  '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
  '#bcbd22', '#17becf'
];

const ThreatClusters = () => {
  const [clusters, setClusters] = useState([]);
  const [error, setError] = useState(null);
  const [k, setK] = useState(3);
  const [filters, setFilters] = useState({
    severity: '',
    type: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    fetchClusters(k);
  }, [k, filters]);

  const fetchClusters = async (numClusters) => {
    try {
      const params = { k: numClusters };
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await axios.get(`http://localhost:8000/threats/clusters`, { params });
      setClusters(response.data);
    } catch (err) {
      setError('Failed to fetch cluster data');
      console.error(err);
    }
  };

  const getClusterColor = (clusterId) =>
    clusterColors[clusterId % clusterColors.length];

  const uniqueClusters = [...new Set(clusters.map(t => t.cluster))].sort();

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <h2 style={{ textAlign: 'center' }}>Interactive Threat Map</h2>

      {/* === Filters === */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        justifyContent: 'center',
        marginBottom: '1rem'
      }}>
        <input
          type="text"
          name="severity"
          placeholder="Severity"
          value={filters.severity}
          onChange={handleChange}
        />
        <input
          type="text"
          name="type"
          placeholder="Type"
          value={filters.type}
          onChange={handleChange}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={filters.location}
          onChange={handleChange}
        />
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleChange}
        />
      </div>

      {/* === Legend === */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '1rem',
        marginBottom: '1rem'
      }}>
        {uniqueClusters.map(clusterId => (
          <div key={clusterId} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{
              width: 14,
              height: 14,
              backgroundColor: getClusterColor(clusterId),
              borderRadius: '50%',
              marginRight: 6
            }}></div>
            <span>Cluster {clusterId}</span>
          </div>
        ))}
      </div>

      {/* === Map === */}
      <MapContainer
        center={[39.8283, -98.5795]} // USA center
        zoom={4}
        minZoom={3}
        maxZoom={7}
        maxBounds={[[24.396308, -125.0], [49.384358, -66.93457]]}
        maxBoundsViscosity={1.0}
        style={{ height: '600px', width: '100%', marginBottom: '2rem' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {clusters
          .filter((t) => t.latitude && t.longitude)
          .map((threat, index) => (
            <CircleMarker
              key={index}
              center={[threat.latitude, threat.longitude]}
              radius={8}
              fillOpacity={0.9}
              color={getClusterColor(threat.cluster)}
            >
              <Popup>
                <strong>{threat.title}</strong><br />
                Severity: {threat.severity}<br />
                Type: {threat.type}<br />
                Location: {threat.location}<br />
                Cluster: {threat.cluster}
              </Popup>
            </CircleMarker>
          ))}
      </MapContainer>

      <h3 style={{ textAlign: 'center' }}>Threat Cluster Table</h3>

      <div style={{ marginBottom: '1rem', textAlign: 'center' }}>
        <label>Number of Clusters: </label>
        <input
          type="number"
          min="1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
          style={{ marginLeft: '0.5rem' }}
        />
      </div>

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table border="1" cellPadding="8" style={{ width: '100%', marginBottom: '2rem' }}>
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
    </div>
  );
};

export default ThreatClusters;