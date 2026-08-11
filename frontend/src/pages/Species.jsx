import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function Species() {
  const [list, setList] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ forestId: "", species: "", age: "", healthStatus: "Good" });

  const fetchSpecies = async () => {
    try {
      setLoading(true);
      const res = await api.get("/species");
      setList(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load species");
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
    fetchSpecies();
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
      const res = await api.post("/species", form);
      setList((current) => [res.data, ...current]);
      setForm({ forestId: "", species: "", age: "", healthStatus: "Good" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Create failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this species entry?")) return;
    try {
      await api.delete(`/species/${id}`);
      setList((current) => current.filter((item) => item._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Delete failed");
    }
  };

  return (
    <div className="management-page">
      <section className="management-hero">
        <div>
          <p className="eyebrow">Biodiversity registry</p>
          <h1>Species management</h1>
          <p className="hero-copy">
            Register species records, monitor health trends, and keep each forest's biodiversity data organized.
          </p>
        </div>
        <div className="hero-metric">
          <span>Tracked species records</span>
          <strong>{list.length}</strong>
        </div>
      </section>

      <section className="management-panel">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Create record</p>
            <h2>Add a species entry</h2>
          </div>
          <span className="panel-badge">Habitat aligned</span>
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
            <span>Species name</span>
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
              {loading ? "Saving..." : "Add species"}
            </button>
          </div>
        </form>

        {error && <div className="theme-alert">{error}</div>}
      </section>

      <section className="table-shell">
        <div className="panel-heading">
          <div>
            <p className="section-kicker">Live records</p>
            <h2>Species registry</h2>
          </div>
        </div>

        {loading && list.length === 0 ? (
          <div className="table-empty">Loading species records...</div>
        ) : (
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
                {list.map((item) => (
                  <tr key={item._id}>
                    <td>{forests.find((forest) => forest._id === item.forestId)?.name || item.forestId}</td>
                    <td>{item.species}</td>
                    <td>{item.age}</td>
                    <td>
                      <span className={`status-pill ${getHealthTone(item.healthStatus)}`}>{item.healthStatus}</span>
                    </td>
                    <td>
                      <button onClick={() => handleDelete(item._id)} className="danger-button">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {list.length === 0 && (
                  <tr>
                    <td colSpan={5} className="table-empty-cell">
                      No species records found.
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

function getHealthTone(status) {
  if (status === "Good") return "status-good";
  if (status === "Average") return "status-warn";
  return "status-bad";
}
