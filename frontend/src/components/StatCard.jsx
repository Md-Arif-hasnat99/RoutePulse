function StatCard({ label, value, note, tone = "default" }) {
  return (
    <article className={`stat-card stat-${tone}`}>
      <p className="stat-label">{label}</p>
      <p className="stat-value">{value}</p>
      {note ? <p className="stat-note">{note}</p> : null}
    </article>
  );
}

export default StatCard;
