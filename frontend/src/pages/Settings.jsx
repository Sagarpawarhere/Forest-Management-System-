import React from 'react';

export default function Settings() {
  return (
    <div style={{
      maxWidth: 950,
      margin: '40px auto',
      background: '#f8fbff',
      borderRadius: 18,
      boxShadow: '0 4px 24px #0002',
      padding: '36px 32px',
    }}>
      <h2 style={{ color: '#1976d2', fontWeight: 700, letterSpacing: 1, marginBottom: 28 }}>Settings</h2>
      <div style={{ background: '#e3f2fd', padding: 24, borderRadius: 12, boxShadow: '0 2px 8px #0001' }}>
        <p style={{ fontSize: 16 }}>Settings page coming soon. Here you can manage your account, preferences, and notifications.</p>
      </div>
    </div>
  );
}
