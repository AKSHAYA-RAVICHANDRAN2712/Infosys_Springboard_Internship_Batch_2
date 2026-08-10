export default function StatCard({ label, value, subtext, subtextVariant }) {
  return (
    <div className="stat-card">
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {subtext && <div className={`stat-subtext${subtextVariant ? ' ' + subtextVariant : ''}`}>{subtext}</div>}
    </div>
  );
}
