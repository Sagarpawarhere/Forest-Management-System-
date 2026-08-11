import React, { useEffect, useState } from "react";
import api from "../services/api";

const endpoints = [
  { key: "species", label: "Species", path: "/species" },
  { key: "incidents", label: "Incidents", path: "/incidents" },
  { key: "forests", label: "Forests", path: "/forests" },
  { key: "trees", label: "Trees", path: "/trees" },
  { key: "patrolLogs", label: "Patrol Logs", path: "/patrol-logs" },
  { key: "envData", label: "Environmental Data", path: "/environmental-data" },
  { key: "reports", label: "Reports", path: "/reports" },
  { key: "wildlife", label: "Wildlife", path: "/wildlife" },
];

const initialData = {
  species: [],
  incidents: [],
  forests: [],
  trees: [],
  patrolLogs: [],
  envData: [],
  reports: [],
  wildlife: [],
};

export default function Dashboard() {
  const [dashboardData, setDashboardData] = useState(initialData);
  const [endpointStatus, setEndpointStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);

      try {
        const results = await Promise.allSettled(endpoints.map((endpoint) => api.get(endpoint.path)));
        const nextData = { ...initialData };

        const nextStatus = endpoints.map((endpoint, index) => {
          const result = results[index];

          if (result.status === "fulfilled") {
            const payload = Array.isArray(result.value.data) ? result.value.data : [];
            nextData[endpoint.key] = payload;
            return {
              ...endpoint,
              ok: true,
              count: payload.length,
              message: "Live data connected",
            };
          }

          return {
            ...endpoint,
            ok: false,
            count: 0,
            message:
              result.reason?.response?.data?.message ||
              result.reason?.message ||
              "Endpoint unavailable",
          };
        });

        setDashboardData(nextData);
        setEndpointStatus(nextStatus);
        setError(
          nextStatus.every((endpoint) => !endpoint.ok)
            ? "The dashboard could not reach the backend API. Start the backend server and make sure MongoDB is available."
            : null
        );
      } catch (err) {
        setError(err.message || "Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    

    fetchAll();
  }, []);

  const { species, incidents, forests, trees, patrolLogs, envData, reports, wildlife } = dashboardData;

  if (loading) {
    return (
      <div className="page-shell">
        <h2 style={{ margin: 0 }}>Loading dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-shell" style={{ maxWidth: 760 }}>
        <div
          style={{
            background: "#fff4f2",
            border: "1px solid #f2c7bf",
            color: "#8f2d1f",
            borderRadius: 18,
            padding: 24,
          }}
        >
          <h2 style={{ marginTop: 0 }}>{error}</h2>
          <ul style={{ color: "#6d5c58", fontSize: 15, marginTop: 16, paddingLeft: 24 }}>
            <li>Is the backend server running and accessible?</li>
            <li>Are all API endpoints available and returning valid JSON?</li>
            <li>Check your network connection and CORS settings.</li>
          </ul>
        </div>
      </div>
    );
  }

  const summaryCards = [
    { title: "Forests", color: "#205b3a", value: forests.length, subtitle: "Managed forest zones" },
    { title: "Trees", color: "#2e7d32", value: trees.length, subtitle: "Tracked tree records" },
    { title: "Species", color: "#126d7a", value: species.length, subtitle: "Catalogued species" },
    { title: "Incidents", color: "#c4672f", value: incidents.length, subtitle: "Recent field incidents" },
  ];

  return (
    <div className="page-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Operations overview</p>
          <h1>Forest management dashboard</h1>
          <p className="hero-copy">
            Monitor biodiversity, patrol activity, environmental readings, and incident response from one place.
          </p>
        </div>

        <div className="hero-status">
          <span>
            {endpointStatus.filter((item) => item.ok).length} of {endpointStatus.length} endpoints online
          </span>
          <strong>{new Date().toLocaleDateString()}</strong>
        </div>
      </section>

      <section className="stats-grid">
        {summaryCards.map((card) => (
          <article key={card.title} className="stat-card">
            <p style={{ color: card.color }}>{card.title}</p>
            <strong>{card.value}</strong>
            <span>{card.subtitle}</span>
          </article>
        ))}
      </section>

      <section className="status-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
          <div>
            <p className="section-kicker">API health</p>
            <h2 style={{ margin: "6px 0 0" }}>Endpoint status</h2>
          </div>
          <span className="status-chip">JSON responses normalized</span>
        </div>

        <div className="endpoint-grid">
          {endpointStatus.map((endpoint) => (
            <div key={endpoint.key} className={`endpoint-card ${endpoint.ok ? "is-ok" : "is-error"}`}>
              <div>
                <strong>{endpoint.label}</strong>
                <p>{endpoint.message}</p>
              </div>
              <span>{endpoint.count} items</span>
            </div>
          ))}
        </div>
      </section>

      <section className="dashboard-grid">
        <Card title="Forests" accent="#2e7d32">
          {forests.map((forest) => (
            <li key={forest._id}>{forest.name}</li>
          ))}
        </Card>

        <Card title="Species" accent="#126d7a">
          {species.map((item) => (
            <li key={item._id}>
              {item.species} ({item.healthStatus})
            </li>
          ))}
        </Card>

        <Card title="Incidents" accent="#c4672f">
          {incidents.map((incident) => (
            <li key={incident._id}>
              {incident.type} ({incident.severity})
            </li>
          ))}
        </Card>

        <Card title="Trees" accent="#1e88a8">
          {trees.map((tree) => (
            <li key={tree._id}>
              {tree.species} ({tree.healthStatus})
            </li>
          ))}
        </Card>
      </section>

      <section className="dashboard-grid">
        <Card title="Patrol Logs" accent="#2056a8">
          {patrolLogs.map((log) => (
            <li key={log._id}>{log.date ? new Date(log.date).toLocaleDateString() : "No date"}</li>
          ))}
        </Card>

        <Card title="Environmental Data" accent="#7b6142">
          {envData.map((entry) => (
            <li key={entry._id}>
              {entry.temperature} C / {entry.rainfall} mm
            </li>
          ))}
        </Card>

        <Card title="Reports" accent="#7f3e62">
          {reports.map((report, index) => (
            <li key={report._id || index}>{report.title}</li>
          ))}
        </Card>

        <Card title="Wildlife" accent="#1d8f6d">
          {wildlife.map((item) => (
            <li key={item._id}>
              {item.species} ({item.status || item.count || "Tracked"})
            </li>
          ))}
        </Card>
      </section>
    </div>
  );
}

function Card({ title, accent, children }) {
  const items = React.Children.toArray(children).filter(Boolean);

  return (
    <article className="dashboard-card" style={{ borderTop: `4px solid ${accent}` }}>
      <h3 style={{ color: accent }}>{title}</h3>
      {items.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>{items}</ul>
      ) : (
        <p className="empty-state">No records available.</p>
      )}
    </article>
  );
}
