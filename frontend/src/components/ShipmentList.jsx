function ShipmentList({ shipments, selectedId, onSelect }) {
  return (
    <aside className="list-panel">
      <div className="panel-header">
        <h2>Shipments</h2>
      </div>
      <div className="shipment-list">
        {shipments.map((shipment) => {
          const riskClass = `risk-${shipment.risk.toLowerCase()}`;
          const isActive = selectedId === shipment.id;

          return (
            <button
              key={shipment.id}
              type="button"
              className={`shipment-card ${riskClass} ${isActive ? "active" : ""}`}
              onClick={() => onSelect(shipment.id)}
            >
              <div className="shipment-row">
                <span className="shipment-id">{shipment.id}</span>
                <span className={`risk-badge ${riskClass}`}>{shipment.risk}</span>
              </div>
              <div className="shipment-meta">Speed: {shipment.speed} mph</div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}

export default ShipmentList;
