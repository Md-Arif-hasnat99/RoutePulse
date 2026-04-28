import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { apiFetch } from "../utils/api";

const RISK_COLORS = {
  HIGH: "var(--risk-high, #ff4848)",
  MEDIUM: "var(--primary)",
  LOW: "var(--accent)",
};

const RISK_PILL = {
  HIGH: "pill pill-danger",
  MEDIUM: "pill pill-warning",
  LOW: "pill",
};

export default function DashboardPage() {
  const { getToken, signOut } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchShipments = useCallback(async () => {
    try {
      const res = await apiFetch("/api/shipments", getToken);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setShipments(data);
      setError(null);
    } catch (e) {
      setError("Could not reach backend. Is uvicorn running?");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const fetchRisk = useCallback(
    async (id) => {
      try {
        const res = await apiFetch(`/api/risk/${id}`, getToken);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setRisk(data);
      } catch {
        setRisk(null);
      }
    },
    [getToken]
  );

  const selectShipment = useCallback(
    async (shipment) => {
      setSelected(shipment);
      await fetchRisk(shipment.id);
    },
    [fetchRisk]
  );

  // Poll every 3 seconds
  useEffect(() => {
    fetchShipments();
    const interval = setInterval(async () => {
      await fetchShipments();
      if (selected) await fetchRisk(selected.id);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchShipments, fetchRisk, selected]);

  // Stats derived from live data
  const highRisk = shipments.filter((s) => s.risk === "HIGH").length;
  const medRisk = shipments.filter((s) => s.risk === "MEDIUM").length;
  const avgSpeed =
    shipments.length > 0
      ? Math.round(shipments.reduce((acc, s) => acc + s.speed, 0) / shipments.length)
      : 0;

  return (
    <div className="app-shell">
      <aside className="side-nav">
        <div className="side-brand">
          <span className="brand-mark" />
          <div>
            <p className="brand-title">RoutePulse</p>
            <p className="brand-subtitle">Ops workspace</p>
          </div>
        </div>
        <nav className="side-links">
          <Link className="nav-link active" to="/dashboard">
            Dashboard
          </Link>
          <Link className="nav-link" to="/shipments">
            Shipments
          </Link>
        </nav>
        <div className="side-footer">
          <button
            className="nav-link"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", width: "100%", textAlign: "left", padding: "10px 14px" }}
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="app-main">
        <header className="page-header">
          <div>
            <p className="eyebrow">Control center</p>
            <h1>Operational Dashboard</h1>
            <p className="muted">Live overview of lanes, risk, and response queues.</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {loading && <span className="pill" style={{ animation: "pulse 1.5s ease infinite" }}>Connecting…</span>}
            {!loading && !error && <span className="pill" style={{ background: "rgba(65,214,200,0.15)", color: "var(--accent)" }}>● Live</span>}
            {error && <span className="pill pill-danger" title={error}>⚠ Offline</span>}
          </div>
        </header>

        {error && (
          <div className="alert-box" style={{ marginBottom: "8px" }}>
            <strong>Backend unreachable</strong> — {error}
          </div>
        )}

        {/* Stats */}
        <section className="stat-grid">
          <div className="stat-card">
            <p className="label">Active shipments</p>
            <h2>{shipments.length}</h2>
            <p className="muted">Tracked in real time</p>
          </div>
          <div className="stat-card">
            <p className="label">High-risk lanes</p>
            <h2 style={{ color: highRisk > 0 ? "#ff9a9a" : "inherit" }}>{highRisk}</h2>
            <p className="muted">Immediate attention needed</p>
          </div>
          <div className="stat-card">
            <p className="label">Medium risk</p>
            <h2 style={{ color: medRisk > 0 ? "#ffbd9b" : "inherit" }}>{medRisk}</h2>
            <p className="muted">Monitor closely</p>
          </div>
          <div className="stat-card">
            <p className="label">Avg. speed</p>
            <h2>{avgSpeed} mph</h2>
            <p className="muted">Across all carriers</p>
          </div>
        </section>

        <section className="dashboard-grid">
          {/* Shipment list */}
          <div className="panel">
            <div className="panel-header">
              <h3>Live shipments</h3>
              <span className="pill">
                {loading ? "Loading…" : `${shipments.length} total`}
              </span>
            </div>

            {shipments.length === 0 && !loading && !error && (
              <p className="muted">No shipments seeded yet.</p>
            )}

            <div className="table">
              {shipments.length > 0 && (
                <div className="table-row table-head">
                  <span>ID</span>
                  <span>Speed</span>
                  <span>Risk</span>
                  <span>Action</span>
                </div>
              )}
              {shipments.map((s) => (
                <div
                  key={s.id}
                  className={`table-row${selected?.id === s.id ? " active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => selectShipment(s)}
                >
                  <span style={{ fontWeight: 600 }}>{s.id}</span>
                  <span>{s.speed} mph</span>
                  <span className={RISK_PILL[s.risk] || "pill"}>{s.risk}</span>
                  <button className="btn btn-ghost" style={{ padding: "6px 12px", fontSize: "12px" }}
                    onClick={(e) => { e.stopPropagation(); selectShipment(s); }}>
                    Inspect
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Detail / AI panel */}
          <div className="panel">
            <div className="panel-header">
              <h3>Shipment detail</h3>
              {selected && risk && (
                <span className={RISK_PILL[risk.risk] || "pill"}>{risk.risk} risk</span>
              )}
            </div>

            {!selected ? (
              <p className="muted" style={{ marginTop: "8px" }}>
                Click a shipment on the left to see live telemetry and AI insight.
              </p>
            ) : (
              <div className="detail-card">
                <h4 style={{ fontSize: "18px" }}>{selected.id}</h4>
                <p className="muted">Speed: {selected.speed} mph</p>

                {selected.suggested_route && (
                  <div className="alert-box">
                    <p className="label" style={{ marginBottom: "6px" }}>Suggested reroute</p>
                    <p style={{ fontWeight: 600 }}>{selected.suggested_route.join(" → ")}</p>
                  </div>
                )}

                {risk && (
                  <div
                    style={{
                      background: "rgba(65, 214, 200, 0.08)",
                      border: "1px solid rgba(65, 214, 200, 0.2)",
                      borderRadius: "12px",
                      padding: "16px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "16px" }}>✦</span>
                      <p className="label" style={{ color: "var(--accent)" }}>Gemini AI Insight</p>
                    </div>
                    <p style={{ lineHeight: 1.6 }}>{risk.explanation}</p>
                  </div>
                )}

                <div className="button-row">
                  <Link to="/shipments" className="btn btn-primary">
                    Open in shipments
                  </Link>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
