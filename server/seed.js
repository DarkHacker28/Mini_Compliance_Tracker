const db = require("./database");

console.log("Seeding database...");

db.exec("DELETE FROM tasks");
db.exec("DELETE FROM clients");
db.exec("DELETE FROM sqlite_sequence WHERE name='tasks' OR name='clients'");

const insertClient = db.prepare(
  "INSERT INTO clients (company_name, country, entity_type) VALUES (?, ?, ?)"
);

const clients = [
  ["Mehta & Brothers", "India", "Private Limited"],
  ["Kapoor Industries", "India", "LLP"],
  ["Jain Overseas", "India", "Private Limited"],
  ["Hudson Retail Group", "USA", "Corporation"],
  ["Sharma & Associates", "India", "Partnership"],
];

const insertClients = db.transaction(() => {
  for (const client of clients) {
    insertClient.run(...client);
  }
});
insertClients();

console.log(`Inserted ${clients.length} clients`);

const insertTask = db.prepare(
  `INSERT INTO tasks (client_id, title, description, category, due_date, status, priority)
   VALUES (?, ?, ?, ?, ?, ?, ?)`
);

function relativeDate(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const tasks = [
  [1, "Q4 GST Filing", "File GST returns for Q4 FY2025-26", "GST Filing", relativeDate(-5), "Pending", "High"],
  [1, "Annual Tax Return", "File annual income tax return", "Tax Return", relativeDate(15), "Pending", "High"],
  [1, "TDS Return Q3", "File TDS return for Q3", "TDS", relativeDate(-10), "Completed", "Medium"],
  [1, "Statutory Audit", "Complete statutory audit for FY2025-26", "Audit", relativeDate(30), "In Progress", "High"],
  [1, "Payroll Processing - March", "Process March payroll and file returns", "Payroll", relativeDate(5), "Pending", "Medium"],

  [2, "GST Annual Return", "File GSTR-9 annual return", "GST Filing", relativeDate(-3), "Pending", "High"],
  [2, "Partner Tax Filing", "File partner-wise tax returns", "Tax Return", relativeDate(20), "Pending", "Medium"],
  [2, "LLP Form 11", "File annual LLP Form 11", "Annual Compliance", relativeDate(10), "Pending", "Low"],
  [2, "TDS Return Q4", "File TDS return for Q4", "TDS", relativeDate(-7), "Pending", "High"],

  [3, "Export GST Refund", "Claim GST refund on exports", "GST Filing", relativeDate(7), "In Progress", "High"],
  [3, "Annual Compliance Filing", "File annual returns with ROC", "Annual Compliance", relativeDate(25), "Pending", "Medium"],
  [3, "Tax Audit", "Complete tax audit u/s 44AB", "Audit", relativeDate(-2), "Pending", "High"],
  [3, "Monthly TDS", "File monthly TDS for March", "TDS", relativeDate(3), "Pending", "Medium"],

  [4, "Federal Tax Return", "File annual federal tax return", "Tax Return", relativeDate(45), "Pending", "High"],
  [4, "State Registration Renewal", "Renew state business registration", "Registration", relativeDate(-15), "Completed", "Medium"],
  [4, "Quarterly Payroll Tax", "File Q1 payroll tax returns", "Payroll", relativeDate(12), "Pending", "Medium"],
  [4, "Annual Audit", "Complete annual financial audit", "Audit", relativeDate(60), "Pending", "Low"],

  [5, "GST Registration", "Complete GST registration process", "Registration", relativeDate(-20), "Completed", "High"],
  [5, "Partnership Deed Update", "Update partnership deed with ROF", "Annual Compliance", relativeDate(8), "In Progress", "Medium"],
  [5, "Monthly GST Filing", "File GSTR-3B for March", "GST Filing", relativeDate(-1), "Pending", "High"],
  [5, "TDS Compliance", "Ensure TDS compliance for FY", "TDS", relativeDate(14), "Pending", "Medium"],
];

const insertTasks = db.transaction(() => {
  for (const task of tasks) {
    insertTask.run(...task);
  }
});
insertTasks();

console.log(`Inserted ${tasks.length} tasks`);
console.log("Seeding complete!");
