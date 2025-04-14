/*import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

// Define colors for clusters
const clusterColors = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728',
  '#9467bd', '#8c564b', '#e377c2', '#7f7f7f',
  '#bcbd22', '#17becf'
];

const ThreatMap = () => {
  const [threats, setThreats] = useState([]);
  const [filters, setFilters] = useState({
    severity: '',
    type: '',
    location: '',
    startDate: '',
    endDate: ''
  });

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchThreats();
  }, [filters]);

  const fetchThreats = async () => {
    try {
      const params = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params[key] = value;
      });

      const response = await axios.get('http://localhost:8000/threats/clusters', { params });
      setThreats(response.data);
      setError(null);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch threat data');
    }
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const getClusterColor = (clusterId) =>
    clusterColors[clusterId % clusterColors.length];

  const uniqueClusters = [...new Set(threats.map(t => t.cluster))].sort();

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1rem' }}>Threat Map</h2>

      
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

     
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

      <MapContainer
        key={threats.length} // Force re-render when threat list updates
        center={[39.8283, -98.5795]}
        zoom={4}
        style={{ height: '80vh', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {threats.map((threat) => (
          <CircleMarker
            key={threat._id}
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
    </div>
  );
};

export default ThreatMap;*/