import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NavBar() {
  const location = useLocation();

  const linkStyle = (path) => ({
    marginRight: "20px",
    fontWeight: location.pathname === path ? "bold" : "normal",
    textDecoration: "none",
    color: "#333"
  });

  return (
    <nav style={{ padding: "15px", background: "#eee", marginBottom: "20px" }}>
      <Link to="/" style={linkStyle("/")}>🏠 Leads</Link>
      <Link to="/config" style={linkStyle("/config")}>⚙️ Configuración</Link>
      <Link to="/logs" style={linkStyle("/logs")}>📈 Logs</Link>
      <Link to="/stats" style={linkStyle("/stats")}>📊 Estadísticas</Link>
      
    </nav>
  );
}
