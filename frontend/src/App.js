import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Species from "./pages/Species";
import ForestManagement from "./pages/ForestManagement";
import TreeManagement from "./pages/TreeManagement";
import Incidents from "./pages/Incidents";
import MapView from "./pages/MapView";
// import Login from "./pages/Login";
import PatrolLogs from "./pages/PatrolLogs";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
import WildlifeTracking from "./pages/WildlifeTracking";

export default function App() {
  return (
    <Router>
      <div className="app-shell">
        <Sidebar />
        <main className="app-content">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/species" element={<Species />} />
            <Route path="/forests" element={<ForestManagement />} />
            <Route path="/trees" element={<TreeManagement />} />
            <Route path="/incidents" element={<Incidents />} />
            <Route path="/wildlife" element={<WildlifeTracking />} />
            <Route path="/map" element={<MapView />} />
            <Route path="/patrol-logs" element={<PatrolLogs />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            {/* <Route path="/login" element={<Login />} /> */}
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
