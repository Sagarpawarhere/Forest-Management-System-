import React from "react";
import { NavLink } from "react-router-dom";

const linkStyle = {
  display: "block",
  padding: "12px 16px",
  color: "#d7efe1",
  textDecoration: "none",
  fontWeight: 600,
  borderRadius: 14,
  marginBottom: 8,
  transition: "background 160ms ease, transform 160ms ease, color 160ms ease",
};

const activeStyle = {
  background:
    "linear-gradient(135deg, rgba(157, 231, 177, 0.2), rgba(43, 122, 74, 0.38))",
  color: "#f5fff7",
  transform: "translateX(4px)",
};

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-mark">FM</span>
        <div>
          <strong>Forest Ops</strong>
          <p>Management Console</p>
        </div>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", alignItems: "stretch" }}>
        <NavLink to="/dashboard" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Dashboard
        </NavLink>
        <NavLink to="/species" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Species
        </NavLink>
        <NavLink to="/forests" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Forest Management
        </NavLink>
        <NavLink to="/trees" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Tree Management
        </NavLink>
        <NavLink to="/incidents" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Incidents
        </NavLink>
        <NavLink to="/wildlife" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Wildlife
        </NavLink>
        <NavLink to="/map" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Map
        </NavLink>
        <NavLink to="/patrol-logs" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Patrol Logs
        </NavLink>
        <NavLink to="/reports" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Reports
        </NavLink>
        <NavLink to="/settings" style={({ isActive }) => (isActive ? { ...linkStyle, ...activeStyle } : linkStyle)}>
          Settings
        </NavLink>
      </nav>
    </aside>
  );
}
