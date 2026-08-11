import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function TreeManagement() {
  const [trees, setTrees] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ forestId: "", species: "", age: "", healthStatus: "Good" });

  const fetchTrees = async () => {
    setLoading(true);
    try {
      const res = await api.get("/trees");
      setTrees(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load trees");
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
    fetchTrees();
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
      const res = await api.post("/trees", form);
      setTrees((current) => [res.data, ...current]);
      setForm({ forestId: "", species: "", age: "", healthStatus: "Good" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this tree record?")) return;
    try {
      await api.delete(`/trees/${id}`);
      setTrees((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="management-page">
      <section className="management-hero">
        <div>
          <p className="eyebrow">Canopy monitoring</p>
          <h1>Tree management</h1>
          <p className="hero-copy">
            Track tree records by forest, keep health signals visible, and keep field entries fast and consistent.
          </p>
        </div>
        <div className="hero-metric">
          <span>Tracked trees</span>
          <strong>{trees.length}</strong>
        </div>
      </section>

      <section className="management-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Create record</p>
            <h2>Add a tree entry</h2>
          </div>
          <span className="panel-badge">Canopy watch</span>
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
            <span>Age</span>
            <input
              name="age"
              type="number"
              value={form.age}
              onChange={handleChange}
              placeholder="Age"
              required
              className="theme-input"
            />
          </label>

          <label className="field">
            <span>Health status</span>
            <select
              name="healthStatus"
              value={form.healthStatus}
              onChange={handleChange}
              required
              className="theme-input"
            >
              <option value="Good">Good</option>
              <option value="Average">Average</option>
              <option value="Poor">Poor</option>
            </select>
          </label>

          <div className="form-actions">
            <button type="submit" disabled={loading} className="theme-button">
              {loading ? "Saving..." : "Add tree"}
            </button>
          </div>
        </form>

        {error && <div className="theme-alert">{error}</div>}
      </section>

      <section className="table-shell">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Live records</p>
            <h2>Tree registry</h2>
          </div>
        </div>

        <div className="table-scroll">
          <table className="theme-table">
            <thead>
              <tr>
                <th>Forest</th>
                <th>Species</th>
                <th>Age</th>
                <th>Health</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {trees.map((tree) => (
                <tr key={tree._id}>
                  <td>{forests.find((forest) => forest._id === tree.forestId)?.name || tree.forestId}</td>
                  <td>{tree.species}</td>
                  <td>{tree.age}</td>
                  <td>
                    <span className={`status-pill ${getHealthTone(tree.healthStatus)}`}>{tree.healthStatus}</span>
                  </td>
                  <td>
                    <button onClick={() => handleDelete(tree._id)} className="danger-button">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {trees.length === 0 && (
                <tr>
                  <td colSpan={5} className="table-empty-cell">
                    {loading ? "Loading trees..." : "No trees found."}
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

function getHealthTone(status) {
  if (status === "Good") return "status-good";
  if (status === "Average") return "status-warn";
  return "status-bad";
}
