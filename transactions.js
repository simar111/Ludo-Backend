const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

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

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("1: Connection failed", err);
    return;
  }
  console.log("MySQL connected...");
});

// POST endpoint to update balance
app.post("/update-balance", (req, res) => {
  const { username, amount } = req.body;

  if (!username || amount === undefined) {
    return res.status(400).send("Invalid request");
  }

  const userCheckQuery = "SELECT TotalBalance FROM users WHERE username = ?";
  db.query(userCheckQuery, [username], (err, result) => {
    if (err) {
      console.error("2: User query failed", err);
      return res.status(500).send("2: User query failed");
    }

    if (result.length === 0) {
      return res.status(404).send("3: User does not exist");
    }

    const currentBalance = parseFloat(result[0].TotalBalance);
    const newBalance = currentBalance + parseFloat(amount);

    const updateBalanceQuery = "UPDATE users SET TotalBalance = ? WHERE username = ?";
    db.query(updateBalanceQuery, [newBalance, username], (err, updateResult) => {
      if (err) {
        console.error("4: Balance update failed", err);
        return res.status(500).send("4: Balance update failed");
      }

      return res.send("0"); // Success
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
