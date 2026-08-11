import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function WildlifeTracking() {
  const [wildlife, setWildlife] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ forestId: "", species: "", count: "", recordedAt: "" });

  const fetchWildlife = async () => {
    setLoading(true);
    try {
      const res = await api.get("/wildlife");
      setWildlife(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load wildlife");
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
    fetchWildlife();
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
      const res = await api.post("/wildlife", form);
      setWildlife((current) => [res.data, ...current]);
      setForm({ forestId: "", species: "", count: "", recordedAt: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this wildlife record?")) return;
    try {
      await api.delete(`/wildlife/${id}`);
      setWildlife((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="management-page">
      <section className="management-hero">
        <div>
          <p className="eyebrow">Habitat monitoring</p>
          <h1>Wildlife tracking</h1>
          <p className="hero-copy">
            Track wildlife sightings, population counts, and forest-wise biodiversity signals from one dedicated page.
          </p>
        </div>
        <div className="hero-metric">
          <span>Wildlife records</span>
          <strong>{wildlife.length}</strong>
        </div>
      </section>

      <section className="management-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Create record</p>
            <h2>Add a wildlife entry</h2>
          </div>
          <span className="panel-badge">Field sightings</span>
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
            <span>Species</span>
            <input
              name="species"
              value={form.species}
              onChange={handleChange}
              placeholder="Species"
              required
              className="theme-input"
            />
          </label>

          <label className="field">
            <span>Count</span>
            <input
              name="count"
              type="number"
              value={form.count}
              onChange={handleChange}
              placeholder="Count"
              required
              className="theme-input"
            />
          </label>

          <label className="field">
            <span>Recorded date</span>
            <input
              name="recordedAt"
              type="date"
              value={form.recordedAt}
              onChange={handleChange}
              required
              className="theme-input"
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="theme-button">
              {loading ? "Saving..." : "Add wildlife"}
            </button>
          </div>
        </form>

        {error && <div className="theme-alert">{error}</div>}
      </section>

      <section className="table-shell">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Live records</p>
            <h2>Wildlife registry</h2>
          </div>
        </div>

        {loading && wildlife.length === 0 ? (
          <div className="table-empty">Loading wildlife records...</div>
        ) : (
          <div className="table-scroll">
            <table className="theme-table">
              <thead>
                <tr>
                  <th>Forest</th>
                  <th>Species</th>
                  <th>Count</th>
                  <th>Recorded Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {wildlife.map((item) => (
                  <tr key={item._id}>
                    <td>{forests.find((forest) => forest._id === item.forestId)?.name || item.forestId}</td>
                    <td>{item.species}</td>
                    <td>
                      <span className="status-pill status-good">{item.count}</span>
                    </td>
                    <td>{item.recordedAt ? new Date(item.recordedAt).toLocaleDateString() : ""}</td>
                    <td>
                      <button onClick={() => handleDelete(item._id)} className="danger-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {wildlife.length === 0 && (
                  <tr>
                    <td colSpan={5} className="table-empty-cell">
                      No wildlife records found.
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
