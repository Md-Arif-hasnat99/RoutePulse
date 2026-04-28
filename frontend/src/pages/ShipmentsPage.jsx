import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@clerk/react";
import { apiFetch } from "../utils/api";

const RISK_PILL = {
  HIGH: "pill pill-danger",
  MEDIUM: "pill pill-warning",
  LOW: "pill",
};

export default function ShipmentsPage() {
  const { getToken, signOut } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [detail, setDetail] = useState(null);
  const [risk, setRisk] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [error, setError] = useState(null);

  const fetchShipments = useCallback(async () => {
    try {
      const res = await apiFetch("/api/shipments", getToken);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setShipments(data);
      setError(null);
    } catch {
      setError("Backend unreachable");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  const fetchDetail = useCallback(
    async (id) => {
      setDetailLoading(true);
      try {
        const [detRes, riskRes] = await Promise.all([
          apiFetch(`/api/shipments/${id}`, getToken),
          apiFetch(`/api/risk/${id}`, getToken),
        ]);
        if (detRes.ok) setDetail(await detRes.json());
        if (riskRes.ok) setRisk(await riskRes.json());
      } catch {
        // silently fail for detail
      } finally {
        setDetailLoading(false);
      }
    },
    [getToken]
  );

  const handleSelect = useCallback(
    (id) => {
      setSelectedId(id);
      fetchDetail(id);
    },
    [fetchDetail]
  );

  // Poll list every 3 seconds
  useEffect(() => {
    fetchShipments();
    const interval = setInterval(async () => {
      await fetchShipments();
      if (selectedId) await fetchDetail(selectedId);
    }, 3000);
    return () => clearInterval(interval);
  }, [fetchShipments, fetchDetail, selectedId]);

  const filtered = shipments.filter(
    (s) =>
      s.id.toLowerCase().includes(search.toLowerCase()) ||
      s.risk.toLowerCase().includes(search.toLowerCase())
  );

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
          <Link className="nav-link" to="/dashboard">Dashboard</Link>
          <Link className="nav-link active" to="/shipments">Shipments</Link>
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
            <p className="eyebrow">Shipment control</p>
            <h1>Live Shipments</h1>
            <p className="muted">Track high-risk loads and act on the ones that need attention.</p>
          </div>
          <div className="header-actions">
            <input
              className="input"
              placeholder="Search by ID or risk level"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {!loading && !error && (
              <span className="pill" style={{ background: "rgba(65,214,200,0.15)", color: "var(--accent)", whiteSpace: "nowrap" }}>
                ● Live
              </span>
            )}
            {error && <span className="pill pill-danger">⚠ Offline</span>}
          </div>
        </header>

        {error && (
          <div className="alert-box" style={{ marginBottom: "8px" }}>
            <strong>Backend unreachable</strong> — make sure uvicorn is running on port 8000.
          </div>
        )}

        <section className="shipments-grid">
          {/* Shipment List */}
          <div className="panel">
            <div className="panel-header">
              <h3>Active list</h3>
              <span className="pill">
                {loading ? "Loading…" : `${filtered.length} total`}
              </span>
            </div>
            <div className="table">
              {filtered.length > 0 && (
                <div className="table-row table-head">
                  <span>Shipment</span>
                  <span>Speed</span>
                  <span>Status</span>
                  <span>Risk</span>
                </div>
              )}
              {filtered.map((s) => (
                <div
                  key={s.id}
                  className={`table-row${selectedId === s.id ? " active" : ""}`}
                  style={{ cursor: "pointer" }}
                  onClick={() => handleSelect(s.id)}
                >
                  <span style={{ fontWeight: 600 }}>{s.id}</span>
                  <span>{s.speed} mph</span>
                  <span className="muted" style={{ fontSize: "13px" }}>
                    {s.risk === "HIGH" ? "High alert" : s.risk === "MEDIUM" ? "Monitoring" : "In transit"}
                  </span>
                  <span className={RISK_PILL[s.risk] || "pill"}>{s.risk}</span>
                </div>
              ))}
              {!loading && filtered.length === 0 && (
                <p className="muted" style={{ padding: "16px" }}>No shipments found.</p>
              )}
            </div>
          </div>

          {/* Detail Panel */}
          <div className="panel">
            <div className="panel-header">
              <h3>Shipment detail</h3>
              {risk && <span className={RISK_PILL[risk.risk] || "pill"}>{risk.risk} risk</span>}
            </div>

            {!selectedId ? (
              <p className="muted" style={{ marginTop: "8px" }}>
                Select a shipment from the list to see details.
              </p>
            ) : detailLoading ? (
              <p className="muted" style={{ marginTop: "8px" }}>Loading…</p>
            ) : detail ? (
              <div className="detail-card">
                <h4 style={{ fontSize: "20px" }}>{detail.id}</h4>
                <p className="muted">Speed: {detail.speed} mph · ETA: {detail.eta} min</p>

                <div className="detail-grid">
                  <div>
                    <p className="label">Route</p>
                    <p className="value">{detail.route.join(" → ")}</p>
                  </div>
                  <div>
                    <p className="label">Location</p>
                    <p className="value">
                      {detail.current_location[0].toFixed(3)}, {detail.current_location[1].toFixed(3)}
                    </p>
                  </div>
                </div>

                {detail.suggested_route && (
                  <div className="alert-box">
                    <p className="label" style={{ marginBottom: "6px" }}>🚨 Reroute Suggested</p>
                    <p style={{ fontWeight: 600 }}>{detail.suggested_route.join(" → ")}</p>
                  </div>
                )}

                {risk?.explanation && (
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
                  <button className="btn btn-primary">Apply reroute</button>
                  <button className="btn btn-ghost">Notify carrier</button>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
