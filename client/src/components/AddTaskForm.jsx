import { useState } from "react";

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

const PRIORITIES = ["Low", "Medium", "High"];

export default function AddTaskForm({ onSubmit, onCancel }) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "GST Filing",
    due_date: "",
    priority: "Medium",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!form.due_date) {
      setError("Due date is required");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(form);
      setForm({
        title: "",
        description: "",
        category: "GST Filing",
        due_date: "",
        priority: "Medium",
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-task-form">
      <h3>Add New Task</h3>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g., Q4 GST Filing"
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Optional description..."
              rows={2}
            />
          </div>
        </div>

        <div className="form-row form-row-3">
          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="due_date">Due Date *</label>
            <input
              id="due_date"
              name="due_date"
              type="date"
              value={form.due_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="priority">Priority</label>
            <select
              id="priority"
              name="priority"
              value={form.priority}
              onChange={handleChange}
            >
              {PRIORITIES.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? "Adding..." : "Add Task"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
