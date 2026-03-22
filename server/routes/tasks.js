const express = require("express");
const { body, query, param, validationResult } = require("express-validator");
const db = require("../database");

const router = express.Router();

const VALID_STATUSES = ["Pending", "In Progress", "Completed"];
const VALID_PRIORITIES = ["Low", "Medium", "High"];
const VALID_CATEGORIES = [
  "GST Filing",
  "Tax Return",
  "Audit",
  "Registration",
  "Annual Compliance",
  "Payroll",
  "TDS",
  "Other",
];

router.get(
  "/clients/:clientId/tasks",
  [
    param("clientId").isInt({ min: 1 }),
    query("status").optional().isIn(VALID_STATUSES),
    query("category").optional().isIn(VALID_CATEGORIES),
    query("sort_by").optional().isIn(["due_date", "priority", "status", "created_at"]),
    query("sort_order").optional().isIn(["asc", "desc"]),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const client = db
        .prepare("SELECT id FROM clients WHERE id = ?")
        .get(req.params.clientId);

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const { status, category, sort_by, sort_order } = req.query;

      let sql = `SELECT * FROM tasks WHERE client_id = ?`;
      const params = [req.params.clientId];

      if (status) {
        sql += ` AND status = ?`;
        params.push(status);
      }

      if (category) {
        sql += ` AND category = ?`;
        params.push(category);
      }

      const sortColumn = sort_by || "due_date";
      const sortDir = sort_order || "asc";
      sql += ` ORDER BY ${sortColumn} ${sortDir}`;

      const tasks = db.prepare(sql).all(...params);

      const today = new Date().toISOString().split("T")[0];
      const enrichedTasks = tasks.map((task) => ({
        ...task,
        is_overdue: task.status !== "Completed" && task.due_date < today,
      }));

      res.json(enrichedTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }
);

router.post(
  "/clients/:clientId/tasks",
  [
    param("clientId").isInt({ min: 1 }),
    body("title").notEmpty().trim().isLength({ min: 1, max: 200 }),
    body("description").optional().trim().isLength({ max: 1000 }),
    body("category").isIn(VALID_CATEGORIES),
    body("due_date").isISO8601().toDate(),
    body("status").optional().isIn(VALID_STATUSES),
    body("priority").optional().isIn(VALID_PRIORITIES),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const client = db
        .prepare("SELECT id FROM clients WHERE id = ?")
        .get(req.params.clientId);

      if (!client) {
        return res.status(404).json({ error: "Client not found" });
      }

      const {
        title,
        description = "",
        category,
        due_date,
        status = "Pending",
        priority = "Medium",
      } = req.body;

      const dueDateStr =
        typeof due_date === "string"
          ? due_date
          : due_date.toISOString().split("T")[0];

      const result = db
        .prepare(
          `INSERT INTO tasks (client_id, title, description, category, due_date, status, priority)
           VALUES (?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          req.params.clientId,
          title,
          description,
          category,
          dueDateStr,
          status,
          priority
        );

      const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(result.lastInsertRowid);

      const today = new Date().toISOString().split("T")[0];
      task.is_overdue = task.status !== "Completed" && task.due_date < today;

      res.status(201).json(task);
    } catch (error) {
      console.error("Error creating task:", error);
      res.status(500).json({ error: "Failed to create task" });
    }
  }
);

router.patch(
  "/tasks/:id/status",
  [
    param("id").isInt({ min: 1 }),
    body("status").isIn(VALID_STATUSES),
  ],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const task = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(req.params.id);

      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }

      db.prepare(
        `UPDATE tasks SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`
      ).run(req.body.status, req.params.id);

      const updated = db
        .prepare("SELECT * FROM tasks WHERE id = ?")
        .get(req.params.id);

      const today = new Date().toISOString().split("T")[0];
      updated.is_overdue =
        updated.status !== "Completed" && updated.due_date < today;

      res.json(updated);
    } catch (error) {
      console.error("Error updating task:", error);
      res.status(500).json({ error: "Failed to update task status" });
    }
  }
);

router.get("/tasks/categories", (req, res) => {
  res.json(VALID_CATEGORIES);
});

// GET /api/tasks/statuses - List valid statuses
router.get("/tasks/statuses", (req, res) => {
  res.json(VALID_STATUSES);
});

module.exports = router;
