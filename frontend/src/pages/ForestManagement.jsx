import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function ForestManagement() {
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ name: "", location: "", area: "" });

  const fetchForests = async () => {
    setLoading(true);
    try {
      const res = await api.get("/forests");
      setForests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load forests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
      const res = await api.post("/forests", form);
      setForests((current) => [res.data, ...current]);
      setForm({ name: "", location: "", area: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this forest?")) return;
    try {
      await api.delete(`/forests/${id}`);
      setForests((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="management-page">
      <section className="management-hero">
        <div>
          <p className="eyebrow">Territory overview</p>
          <h1>Forest management</h1>
          <p className="hero-copy">
            Maintain the core forest inventory with clear location details, area coverage, and a calmer operational view.
          </p>
        </div>
        <div className="hero-metric">
          <span>Managed forests</span>
          <strong>{forests.length}</strong>
        </div>
      </section>

      <section className="management-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Create record</p>
            <h2>Add a forest zone</h2>
          </div>
          <span className="panel-badge">Coverage first</span>
        </div>

        <form onSubmit={handleSubmit} className="management-form-grid">
          <label className="field">
            <span>Forest name</span>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Name" required className="theme-input" />
          </label>

          <label className="field">
            <span>Location</span>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Location"
              required
              className="theme-input"
            />
          </label>

          <label className="field">
            <span>Area in hectares</span>
            <input
              name="area"
              type="number"
              value={form.area}
              onChange={handleChange}
              placeholder="Area (ha)"
              required
              className="theme-input"
            />
          </label>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="theme-button">
              {loading ? "Saving..." : "Add forest"}
            </button>
          </div>
        </form>

        {error && <div className="theme-alert">{error}</div>}
      </section>

      <section className="table-shell">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Live records</p>
            <h2>Forest inventory</h2>
          </div>
        </div>

        <div className="table-scroll">
          <table className="theme-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Area (ha)</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {forests.map((forest) => (
                <tr key={forest._id}>
                  <td>{forest.name}</td>
                  <td>{forest.location}</td>
                  <td>{forest.area}</td>
                  <td>
                    <button onClick={() => handleDelete(forest._id)} className="danger-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {forests.length === 0 && (
                <tr>
                  <td colSpan={4} className="table-empty-cell">
                    {loading ? "Loading forests..." : "No forests found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
