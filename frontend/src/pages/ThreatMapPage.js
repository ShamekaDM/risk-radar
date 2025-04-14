/*import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function ThreatMapPage() {
  const [threats, setThreats] = useState([]);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/threats/map_threats")
      .then((res) => setThreats(res.data))
      .catch((err) => console.error("Error loading map threats:", err));
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1 style={{ textAlign: "center" }}>Interactive Threat Map</h1>
      <MapContainer center={[39.8283, -98.5795]} zoom={4} style={{ height: "80vh", width: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {threats.map((threat) => (
          <Marker key={threat._id} position={[threat.latitude, threat.longitude]}>
            <Popup>
              <strong>{threat.title}</strong><br />
              Type: {threat.type}<br />
              Severity: {threat.severity}<br />
              Location: {threat.location}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}

export default ThreatMapPage;*/