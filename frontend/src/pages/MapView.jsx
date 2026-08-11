import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polygon } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import api from "../services/api";

// Fix default icon issue in Leaflet with Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default function MapView() {
  const [incidents, setIncidents] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [incidentsRes, forestsRes] = await Promise.all([
          api.get("/incidents"),
          api.get("/forests"),
        ]);
        setIncidents(incidentsRes.data || []);
        setForests(forestsRes.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Failed to load map data",
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Default center (India)
  const center = [22.9734, 78.6569];

  return (
    <div style={{
      height: 600,
      width: "100%",
      background: "#f8fbff",
      borderRadius: 16,
      boxShadow: "0 4px 24px #0002",
      padding: 24,
      margin: "32px auto",
      maxWidth: 1100,
    }}>
      <h2 style={{ marginBottom: 18, color: "#1976d2", fontWeight: 700, letterSpacing: 1 }}>Forest & Incident Map</h2>
      {error && <div style={{ color: "#d32f2f", marginBottom: 12 }}>{error}</div>}
      <MapContainer
        center={center}
        zoom={5}
        style={{ height: "500px", width: "100%", borderRadius: 12, boxShadow: "0 2px 8px #0001" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Forest polygons */}
        {forests.map((forest) => {
          // Assume forest.location is GeoJSON Polygon or array of [lat, lng] pairs
          let polygon = null;
          if (Array.isArray(forest.boundary)) {
            // If boundary is array of [lat, lng] pairs
            polygon = forest.boundary;
          } else if (forest.location && Array.isArray(forest.location.coordinates)) {
            // If location is GeoJSON Polygon: { type: 'Polygon', coordinates: [[[lng, lat], ...]] }
            const coords = forest.location.coordinates;
            if (Array.isArray(coords[0])) {
              polygon = coords[0].map(([lng, lat]) => [lat, lng]);
            }
          }
          if (!polygon) return null;
          return (
            <Polygon
              key={forest._id}
              positions={polygon}
              pathOptions={{ color: "#388e3c", fillOpacity: 0.25 }}
            >
              <Popup>
                <div>
                  <strong>{forest.name}</strong>
                  <br />
                  Area: {forest.area} ha
                  <br />
                  Location: {forest.location?.name || forest.location || "-"}
                </div>
              </Popup>
            </Polygon>
          );
        })}
        {/* Incident markers */}
        {incidents.map((inc) => {
          const coords = inc.location?.coordinates;
          if (!coords || coords.length !== 2) return null;
          const [lng, lat] = coords;
          return (
            <Marker key={inc._id} position={[lat, lng]}>
              <Popup>
                <div>
                  <strong>{inc.type}</strong>
                  <br />
                  Severity: {inc.severity || "N/A"}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      {loading && <div style={{ marginTop: 16 }}>Loading map data...</div>}
    </div>
  );
}
