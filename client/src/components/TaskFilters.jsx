const CATEGORIES = [
  "GST Filing",
  "Tax Return",
  "Audit",
  "Registration",
  "Annual Compliance",
  "Payroll",
  "TDS",
  "Other",
];

const STATUSES = ["Pending", "In Progress", "Completed"];

export default function TaskFilters({ filters, onFilterChange }) {
  return (
    <div className="task-filters">
      <div className="filter-group">
        <label>Status</label>
        <select
          value={filters.status || ""}
          onChange={(e) => onFilterChange({ ...filters, status: e.target.value || undefined })}
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Category</label>
        <select
          value={filters.category || ""}
          onChange={(e) => onFilterChange({ ...filters, category: e.target.value || undefined })}
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <label>Sort By</label>
        <select
          value={filters.sort_by || "due_date"}
          onChange={(e) => onFilterChange({ ...filters, sort_by: e.target.value })}
        >
          <option value="due_date">Due Date</option>
          <option value="priority">Priority</option>
          <option value="status">Status</option>
          <option value="created_at">Created</option>
        </select>
      </div>

      <div className="filter-group">
        <label>Order</label>
        <select
          value={filters.sort_order || "asc"}
          onChange={(e) => onFilterChange({ ...filters, sort_order: e.target.value })}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
