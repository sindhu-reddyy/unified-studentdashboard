const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database
const db = new sqlite3.Database("database.db");

// Create table + insert user (safe way)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )`);

  // Insert demo user (only once)
  db.run(`INSERT OR IGNORE INTO users (id, username, password)
          VALUES (1, 'student', '1234')`);
});

// Login API
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, row) => {
      if (err) {
        return res.json({ success: false });
      }

      if (row) {
        res.json({ success: true, user: row.username });
      } else {
        res.json({ success: false });
      }
    }
  );
});

// Start server
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});