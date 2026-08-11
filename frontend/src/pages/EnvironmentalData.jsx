import React, { useEffect, useState } from 'react';
import api from '../services/api';

export default function EnvironmentalData() {
  const [data, setData] = useState([]);
  const [forests, setForests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [form, setForm] = useState({ forestId: '', temperature: '', rainfall: '', soilMoisture: '', recordedAt: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/environmental-data');
      setData(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const fetchForests = async () => {
    try {
      const res = await api.get('/forests');
      setForests(res.data || []);
    } catch {}
  };

  useEffect(() => {
    fetchData();
    fetchForests();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await api.post('/environmental-data', form);
      setData((d) => [res.data, ...d]);
      setForm({ forestId: '', temperature: '', rainfall: '', soilMoisture: '', recordedAt: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Create failed');
    }
  };

  return (
    <div style={{
      maxWidth: 950,
      margin: '40px auto',
      background: '#f8fbff',
      borderRadius: 18,
      boxShadow: '0 4px 24px #0002',
      padding: '36px 32px',
    }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, marginBottom: 28 }}>Environmental Data</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 28, display: 'flex', gap: 16, alignItems: 'center', background: '#e3f2fd', borderRadius: 12, padding: '18px 20px', boxShadow: '0 2px 8px #0001' }}>
        <select name="forestId" value={form.forestId} onChange={handleChange} required style={{ flex: 2, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }}>
          <option value="">Select Forest</option>
          {forests.map((f) => (
            <option key={f._id} value={f._id}>{f.name}</option>
          ))}
        </select>
        <input name="temperature" type="number" placeholder="Temperature (°C)" value={form.temperature} onChange={handleChange} required style={{ width: 120, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <input name="rainfall" type="number" placeholder="Rainfall (mm)" value={form.rainfall} onChange={handleChange} required style={{ width: 120, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <input name="soilMoisture" type="number" placeholder="Soil Moisture (%)" value={form.soilMoisture} onChange={handleChange} required style={{ width: 140, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <input name="recordedAt" type="date" placeholder="Date" value={form.recordedAt} onChange={handleChange} required style={{ width: 140, padding: 10, borderRadius: 6, border: '1px solid #bdbdbd', fontSize: 16 }} />
        <button type="submit" style={{ padding: '10px 22px', background: '#1976d2', color: '#fff', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: 16, cursor: 'pointer', boxShadow: '0 1px 4px #0001' }}>Add</button>
      </form>
      {error && <div style={{ color: '#d32f2f', marginBottom: 16 }}>{error}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Forest</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Temperature (°C)</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Rainfall (mm)</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Soil Moisture (%)</th>
            <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: 8 }}>Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d._id}>
              <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{forests.find(f => f._id === d.forestId)?.name || d.forestId}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{d.temperature}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{d.rainfall}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{d.soilMoisture}</td>
              <td style={{ padding: 8, borderBottom: '1px solid #f1f1f1' }}>{d.recordedAt ? new Date(d.recordedAt).toLocaleDateString() : ''}</td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={5} style={{ padding: 12 }}>No data found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
