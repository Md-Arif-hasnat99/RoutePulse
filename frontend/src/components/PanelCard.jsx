function PanelCard({ title, subtitle, className = "", children }) {
  return (
    <section className={`panel-card ${className}`.trim()}>
      {title ? <h3 className="panel-title">{title}</h3> : null}
      {subtitle ? <p className="panel-subtitle">{subtitle}</p> : null}
      {children}
    </section>
  );
}

export default PanelCard;
