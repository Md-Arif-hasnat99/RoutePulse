import { Link, NavLink } from "react-router-dom";

const topLinks = [
  { to: "/dashboard", label: "Dashboard" },
  { to: "/shipments", label: "Shipments" },
  { to: "/fleet", label: "Fleet" },
  { to: "/analytics", label: "Analytics" },
];

const sideLinks = [
  { to: "/dashboard", label: "Overview" },
  { to: "/shipments", label: "Active Shipments" },
  { to: "/fleet", label: "Fleet Monitor" },
  { to: "/reporting", label: "Reporting" },
  { to: "/settings", label: "Settings" },
];

function AppLayout({ title, subtitle, actions, children }) {
  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="topbar-left">
          <Link className="brand" to="/dashboard">
            RoutePulse
          </Link>
          <nav className="top-nav" aria-label="Primary">
            {topLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `top-nav-link ${isActive ? "top-nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="topbar-right">
          <span className="live-chip">Live</span>
          <Link className="icon-pill" to="/settings" aria-label="Settings">
            S
          </Link>
          <Link className="avatar-pill" to="/settings" aria-label="Profile">
            OP
          </Link>
        </div>
      </header>

      <div className="app-content-wrap">
        <aside className="side-nav" aria-label="App sections">
          <button type="button" className="btn btn-dark side-cta">
            + New Shipment
          </button>

          <nav className="side-nav-list">
            {sideLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `side-nav-link ${isActive ? "side-nav-link-active" : ""}`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="side-nav-footer">
            <Link to="/settings" className="side-nav-link">
              Support
            </Link>
            <Link to="/login" className="side-nav-link">
              Sign Out
            </Link>
          </div>
        </aside>

        <main className="page-canvas">
          <div className="page-header">
            <div>
              <h1>{title}</h1>
              <p>{subtitle}</p>
            </div>
            {actions ? <div className="page-actions">{actions}</div> : null}
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

export default AppLayout;
