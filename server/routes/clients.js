const express = require("express");
const { query, validationResult } = require("express-validator");
const db = require("../database");

const router = express.Router();

router.get(
  "/",
  [query("search").optional().isString().trim()],
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { search } = req.query;

      let sql = `
        SELECT
          c.*,
          COUNT(t.id) AS total_tasks,
          SUM(CASE WHEN t.status = 'Pending' THEN 1 ELSE 0 END) AS pending_tasks,
          SUM(CASE WHEN t.status = 'Completed' THEN 1 ELSE 0 END) AS completed_tasks,
          SUM(CASE WHEN t.status = 'Pending' AND t.due_date < date('now') THEN 1 ELSE 0 END) AS overdue_tasks
        FROM clients c
        LEFT JOIN tasks t ON c.id = t.client_id
      `;

      const params = [];

      if (search) {
        sql += ` WHERE c.company_name LIKE ?`;
        params.push(`%${search}%`);
      }

      sql += ` GROUP BY c.id ORDER BY c.company_name ASC`;

      const clients = db.prepare(sql).all(...params);
      res.json(clients);
    } catch (error) {
      console.error("Error fetching clients:", error);
      res.status(500).json({ error: "Failed to fetch clients" });
    }
  }
);

router.get("/:id", (req, res) => {
  try {
    const client = db
      .prepare("SELECT * FROM clients WHERE id = ?")
      .get(req.params.id);

    if (!client) {
      return res.status(404).json({ error: "Client not found" });
    }

    res.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    res.status(500).json({ error: "Failed to fetch client" });
  }
});

module.exports = router;
