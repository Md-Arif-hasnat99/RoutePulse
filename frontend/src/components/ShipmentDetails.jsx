function ShipmentDetails({ shipment, risk }) {
  if (!shipment) {
    return (
      <section className="details-panel">
        <h2>Shipment Details</h2>
        <p>Select a shipment to see route, ETA, reroute, and AI explanation.</p>
      </section>
    );
  }

  return (
    <section className="details-panel">
      <h2>{shipment.id}</h2>
      <div className="details-grid">
        <div className="detail-item">
          <span className="label">Risk</span>
          <span className={`risk-text risk-${risk.toLowerCase()}`}>{risk}</span>
        </div>
        <div className="detail-item">
          <span className="label">Speed</span>
          <span>{shipment.speed} mph</span>
        </div>
        <div className="detail-item">
          <span className="label">ETA</span>
          <span>{shipment.eta} min</span>
        </div>
        <div className="detail-item">
          <span className="label">Route</span>
          <span>{shipment.route.join(" -> ")}</span>
        </div>
        <div className="detail-item">
          <span className="label">Location</span>
          <span>
            {shipment.current_location[0].toFixed(4)}, {" "}
            {shipment.current_location[1].toFixed(4)}
          </span>
        </div>
      </div>

      <div className="detail-section">
        <h3>Suggested Route</h3>
        <p>
          {shipment.suggested_route
            ? shipment.suggested_route.join(" -> ")
            : "No reroute suggested."}
        </p>
      </div>

      <div className="detail-section">
        <h3>AI Explanation</h3>
        <p>{shipment.explanation || "No explanation available yet."}</p>
      </div>
    </section>
  );
}

export default ShipmentDetails;
