import React, { useEffect, useState } from "react";
import api from "../services/api";

export default function PatrolLogs() {
  const [logs, setLogs] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ forestId: "", date: "", notes: "" });

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await api.get("/patrol-logs");
      setLogs(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load logs");
    } finally {
      setLoading(false);
    }
  };

  const fetchForests = async () => {
    try {
      const res = await api.get("/forests");
      setForests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to load forests");
    }
  };

  useEffect(() => {
    fetchLogs();
    fetchForests();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.post("/patrol-logs", form);
      setLogs((current) => [res.data, ...current]);
      setForm({ forestId: "", date: "", notes: "" });
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to save log");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        maxWidth: 950,
        margin: "40px auto",
        background: "#f8fbff",
        borderRadius: 18,
        boxShadow: "0 4px 24px #0002",
        padding: "36px 32px",
      }}
    >
      <h2 style={{ color: "#1976d2", fontWeight: 700, letterSpacing: 1, marginBottom: 28 }}>
        Patrol Logs
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          marginBottom: 28,
          background: "#e3f2fd",
          padding: 24,
          borderRadius: 12,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Forest</label>
            <select
              name="forestId"
              value={form.forestId}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #b6c8d6" }}
            >
              <option value="">Select Forest</option>
              {forests.map((f) => (
                <option key={f._id} value={f._id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Date</label>
            <input
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: 10, borderRadius: 8, border: "1px solid #b6c8d6" }}
            />
          </div>
        </div>

        <div style={{ marginTop: 12 }}>
          <label style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Notes</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={4}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 8,
              border: "1px solid #b6c8d6",
              resize: "vertical",
            }}
          />
        </div>

        {error && <div style={{ color: "#d32f2f", marginTop: 12 }}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: 16,
            padding: "10px 18px",
            background: "#1976d2",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: 600,
          }}
        >
          {loading ? "Saving..." : "Add Log"}
        </button>
      </form>

      <div style={{ background: "#fff", borderRadius: 14, boxShadow: "0 2px 8px #0001", overflow: "hidden" }}>
        <h3 style={{ padding: "20px 20px 0", margin: 0, color: "#1b4d68" }}>Recent Patrol Logs</h3>
        {loading && <div style={{ padding: 20 }}>Loading logs...</div>}
        {logs.length === 0 && !loading && <div style={{ padding: 20, color: "#6b7c87" }}>No logs found.</div>}

        <table style={{ width: "100%", background: "#fff", marginTop: 16, borderCollapse: "collapse" }}>
          <thead style={{ background: "#e3f2fd", color: "#1f4f6a" }}>
            <tr>
              <th style={{ textAlign: "left", padding: "14px 20px" }}>Forest</th>
              <th style={{ textAlign: "left", padding: "14px 20px" }}>Date</th>
              <th style={{ textAlign: "left", padding: "14px 20px" }}>Ranger</th>
              <th style={{ textAlign: "left", padding: "14px 20px" }}>Notes</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log._id}>
                <td style={{ padding: "14px 20px", borderTop: "1px solid #eef3f6" }}>
                  {forests.find((f) => f._id === log.forestId)?.name || log.forestId}
                </td>
                <td style={{ padding: "14px 20px", borderTop: "1px solid #eef3f6" }}>
                  {log.date ? new Date(log.date).toLocaleDateString() : ""}
                </td>
                <td style={{ padding: "14px 20px", borderTop: "1px solid #eef3f6" }}>{log.ranger}</td>
                <td style={{ padding: "14px 20px", borderTop: "1px solid #eef3f6" }}>{log.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
