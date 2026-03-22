export default function SummaryStats({ tasks }) {
  const total = tasks.length;
  const pending = tasks.filter((t) => t.status === "Pending").length;
  const inProgress = tasks.filter((t) => t.status === "In Progress").length;
  const completed = tasks.filter((t) => t.status === "Completed").length;
  const overdue = tasks.filter((t) => t.is_overdue).length;

  return (
    <div className="summary-stats">
      <div className="stat-card">
        <span className="stat-value">{total}</span>
        <span className="stat-label">Total</span>
      </div>
      <div className="stat-card stat-pending">
        <span className="stat-value">{pending}</span>
        <span className="stat-label">Pending</span>
      </div>
      <div className="stat-card stat-in-progress">
        <span className="stat-value">{inProgress}</span>
        <span className="stat-label">In Progress</span>
      </div>
      <div className="stat-card stat-completed">
        <span className="stat-value">{completed}</span>
        <span className="stat-label">Completed</span>
      </div>
      {overdue > 0 && (
        <div className="stat-card stat-overdue">
          <span className="stat-value">{overdue}</span>
          <span className="stat-label">Overdue</span>
        </div>
      )}
    </div>
  );
}
