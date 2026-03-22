const STATUS_OPTIONS = ["Pending", "In Progress", "Completed"];

const PRIORITY_COLORS = {
  High: "priority-high",
  Medium: "priority-medium",
  Low: "priority-low",
};

function formatDate(dateStr) {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function daysUntilDue(dateStr) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + "T00:00:00");
  const diff = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
  return diff;
}

export default function TaskList({ tasks, onStatusChange }) {
  if (tasks.length === 0) {
    return <p className="empty-state">No tasks found. Try adjusting filters or add a new task.</p>;
  }

  return (
    <div className="task-list">
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Category</th>
            <th>Due Date</th>
            <th>Priority</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => {
            const days = daysUntilDue(task.due_date);
            let dueLabel = "";
            if (task.status === "Completed") {
              dueLabel = "";
            } else if (days < 0) {
              dueLabel = `${Math.abs(days)}d overdue`;
            } else if (days === 0) {
              dueLabel = "Due today";
            } else if (days <= 3) {
              dueLabel = `${days}d left`;
            }

            return (
              <tr key={task.id} className={task.is_overdue ? "overdue-row" : ""}>
                <td className="task-title-cell">
                  <div className="task-title">{task.title}</div>
                  {task.description && (
                    <div className="task-desc">{task.description}</div>
                  )}
                </td>
                <td>
                  <span className="category-badge">{task.category}</span>
                </td>
                <td className="due-date-cell">
                  <span>{formatDate(task.due_date)}</span>
                  {dueLabel && (
                    <span className={`due-label ${task.is_overdue ? "overdue" : days <= 3 ? "soon" : ""}`}>
                      {dueLabel}
                    </span>
                  )}
                </td>
                <td>
                  <span className={`priority-badge ${PRIORITY_COLORS[task.priority]}`}>
                    {task.priority}
                  </span>
                </td>
                <td>
                  <select
                    className={`status-select status-${task.status.toLowerCase().replace(" ", "-")}`}
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
