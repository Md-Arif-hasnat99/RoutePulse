import React from "react";
import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div className="page landing">
      <header className="top-nav">
        <div className="brand">
          <span className="brand-mark" />
          <div>
            <p className="brand-title">RoutePulse</p>
            <p className="brand-subtitle">Logistics intelligence platform</p>
          </div>
        </div>
        <nav className="nav-actions">
          <Link className="btn btn-ghost" to="/login">Log in</Link>
          <Link className="btn btn-primary" to="/register">Start free</Link>
        </nav>
      </header>

      <main className="hero">
        <section className="hero-copy">
          <p className="eyebrow">Predictable deliveries, calmer ops</p>
          <h1 className="hero-title">
            Reduce late arrivals with a live route cockpit built for dispatch teams.
          </h1>
          <p className="hero-body">
            RoutePulse unifies shipment telemetry, risk signals, and ETA confidence into a
            single, focused workspace. Keep the core flow simple: sign in, open the dashboard,
            and act on shipments that matter.
          </p>
          <div className="hero-cta">
            <Link className="btn btn-primary" to="/register">Create account</Link>
            <Link className="btn btn-ghost" to="/dashboard">View dashboard</Link>
          </div>
          <div className="hero-metrics">
            <div>
              <h3>92%</h3>
              <p>On-time recovery rate</p>
            </div>
            <div>
              <h3>18 min</h3>
              <p>Median response time saved</p>
            </div>
            <div>
              <h3>7x</h3>
              <p>Faster escalation routing</p>
            </div>
          </div>
        </section>

        <section className="hero-panel">
          <div className="glass-card fade-up">
            <div className="card-header">
              <p>Active shipment</p>
              <span className="pill pill-warning">Medium risk</span>
            </div>
            <h2>RP-2043 / Hamburg to Milan</h2>
            <p className="muted">ETA confidence 86% | Last update 2 min ago</p>
            <div className="route-progress">
              <span className="route-dot" />
              <div className="route-bar">
                <span className="route-fill" />
              </div>
              <span className="route-dot route-dot-end" />
            </div>
            <div className="card-grid">
              <div>
                <p className="label">Next checkpoint</p>
                <p className="value">Basel, CH</p>
              </div>
              <div>
                <p className="label">Delay risk</p>
                <p className="value">+35 min</p>
              </div>
              <div>
                <p className="label">Carrier</p>
                <p className="value">EuroFreight</p>
              </div>
              <div>
                <p className="label">Condition</p>
                <p className="value">Light rain</p>
              </div>
            </div>
          </div>
          <div className="stack-card fade-up" style={{ animationDelay: "120ms" }}>
            <h3>Today"s focus</h3>
            <ul>
              <li>12 shipments entering border zone</li>
              <li>4 high-risk reroutes recommended</li>
              <li>2 carrier SLA alerts</li>
            </ul>
          </div>
        </section>
      </main>

      <section className="feature-strip">
        <div>
          <h3>Signal first</h3>
          <p>Only surface exceptions that need action right now.</p>
        </div>
        <div>
          <h3>One-click response</h3>
          <p>Apply alternate routes and notify stakeholders instantly.</p>
        </div>
        <div>
          <h3>Clear handoffs</h3>
          <p>Shift-ready summaries keep teams aligned across regions.</p>
        </div>
      </section>
    </div>
  );
}
