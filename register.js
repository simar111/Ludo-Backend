const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "agkkubavvn",
  password: "w3n6GzuDMS&12340",
  database: "agkkubavvn"
});

// Connect to DB
db.connect((err) => {
  if (err) {
    console.error("1: Connection failed", err);
    return;
  }
  console.log("MySQL connected...");
});

// POST endpoint for registration
app.post("/register", async (req, res) => {
  const { name: username, password, number, image } = req.body;

  if (!username || !password || !number || !image) {
    return res.status(400).send("Invalid request data");
  }

  const checkQuery = "SELECT username FROM users WHERE username = ?";
  db.query(checkQuery, [username], async (err, result) => {
    if (err) {
      console.error("2: Query failed", err);
      return res.status(500).send("2: query failed");
    }

    if (result.length > 0) {
      return res.status(409).send("3: Name exists in database");
    } else {
      try {
        const hash = await bcrypt.hash(password, 10);
        const salt = `$5$rounds=5000steamedhams${username}$`;

        const insertQuery = `
          INSERT INTO users (username, hash, salt, Pnumber, image)
          VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertQuery, [username, hash, salt, number, image], (err, result) => {
          if (err) {
            console.error("4: Insert Failed", err);
            return res.status(500).send("4: Insert Failed");
          }

          return res.send("0"); // Success
        });
      } catch (err) {
        console.error("Hashing error", err);
        return res.status(500).send("Password hashing failed");
      }
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
