import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReports = async () => {
      setLoading(true);
      try {
        const res = await api.get('/reports');
        setReports(res.data || []);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to load reports');
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  return (
    <div style={{
      maxWidth: 950,
      margin: '40px auto',
      background: '#f8fbff',
      borderRadius: 18,
      boxShadow: '0 4px 24px #0002',
      padding: '36px 32px',
    }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, marginBottom: 28 }}>Reports</h2>
      {error && <div style={{ color: '#d32f2f', marginBottom: 16 }}>{error}</div>}
      {loading && <div>Loading reports...</div>}
      <div style={{ marginTop: 24 }}>
        {reports.length === 0 && !loading && (
          <div style={{ color: '#888', fontSize: 18, textAlign: 'center', marginTop: 40 }}>
            No reports found.<br />
            <span style={{ fontSize: 15 }}>
              Try creating some <b>incidents</b> or <b>patrol logs</b> to see reports here.
            </span>
          </div>
        )}
        {reports.map((rep, idx) => (
          <div key={idx} style={{ background: '#e3f2fd', padding: 24, borderRadius: 12, marginBottom: 16, boxShadow: '0 2px 8px #0001' }}>
            <h3 style={{ color: '#1976d2', fontWeight: 600 }}>{rep.title || 'Report'}</h3>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: 16 }}>{rep.summary}</pre>
          </div>
        ))}
      </div>
    </div>
  );
}
