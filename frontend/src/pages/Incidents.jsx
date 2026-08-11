import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Incidents() {
  const [incidents, setIncidents] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({
    forestId: "",
    type: "fire",
    severity: "low",
    description: "",
    date: "",
  });

  const fetchIncidents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/incidents");
      setIncidents(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load incidents");
    } finally {
      setLoading(false);
    }
  };

  const fetchForests = async () => {
    try {
      const res = await api.get("/forests");
      setForests(res.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchIncidents();
    fetchForests();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      setLoading(true);
      const res = await api.post("/incidents", form);
      setIncidents((current) => [res.data, ...current]);
      setForm({ forestId: "", type: "fire", severity: "low", description: "", date: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="management-page">
      <section className="management-hero management-hero-warm">
        <div>
          <p className="eyebrow">Risk monitoring</p>
          <h1>Incident management</h1>
          <p className="hero-copy">
            Capture active threats, keep severity visible, and help the response team scan incidents at a glance.
          </p>
        </div>
        <div className="hero-metric">
          <span>Logged incidents</span>
          <strong>{incidents.length}</strong>
        </div>
      </section>

      <section className="management-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Create report</p>
            <h2>Log a new incident</h2>
          </div>
          <span className="panel-badge panel-badge-warm">Response ready</span>
        </div>

        <form onSubmit={handleSubmit} className="management-form-grid">
          <label className="field field-wide">
            <span>Forest</span>
            <select name="forestId" value={form.forestId} onChange={handleChange} required className="theme-input">
              <option value="">Select Forest</option>
              {forests.map((forest) => (
                <option key={forest._id} value={forest._id}>
                  {forest.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Incident type</span>
            <select name="type" value={form.type} onChange={handleChange} required className="theme-input">
              <option value="fire">Fire</option>
              <option value="illegal logging">Illegal Logging</option>
              <option value="encroachment">Encroachment</option>
            </select>
          </label>

          <label className="field">
            <span>Severity</span>
            <select name="severity" value={form.severity} onChange={handleChange} required className="theme-input">
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <label className="field">
            <span>Date</span>
            <input name="date" type="date" value={form.date} onChange={handleChange} required className="theme-input" />
          </label>

          <label className="field field-full">
            <span>Description</span>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Short incident summary"
              className="theme-input"
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="theme-button warm-button">
              {loading ? "Saving..." : "Add incident"}
            </button>
          </div>
        </form>

        {error && <div className="theme-alert">{error}</div>}
      </section>

      <section className="table-shell">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Live records</p>
            <h2>Incident log</h2>
          </div>
        </div>

        {loading && incidents.length === 0 ? (
          <div className="table-empty">Loading incidents...</div>
        ) : (
          <div className="table-scroll">
            <table className="theme-table">
              <thead>
                <tr>
                  <th>Forest</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Date</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {incidents.map((incident) => (
                  <tr key={incident._id}>
                    <td>{forests.find((forest) => forest._id === incident.forestId)?.name || incident.forestId}</td>
                    <td>{incident.type}</td>
                    <td>
                      <span className={`status-pill ${getSeverityTone(incident.severity)}`}>{incident.severity}</span>
                    </td>
                    <td>{incident.date ? new Date(incident.date).toLocaleDateString() : ""}</td>
                    <td>{incident.description}</td>
                  </tr>
                ))}
                {incidents.length === 0 && (
                  <tr>
                    <td colSpan={5} className="table-empty-cell">
                      No incidents found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

function getSeverityTone(severity) {
  if (severity === "low") return "status-good";
  if (severity === "medium") return "status-warn";
  return "status-bad";
}
