// routes/auth.js
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");

const router = express.Router();

// POST /register
router.post("/register", async (req, res) => {
  const { name: username, password, number, image } = req.body;

  if (!username || !password || !number || typeof image !== "number") {
    return res.status(400).send("❌ Invalid request data");
  }

  const checkQuery = "SELECT username FROM users WHERE username = ?";
  db.query(checkQuery, [username], async (err, result) => {
    if (err) {
      console.error("❌ Query error:", err);
      return res.status(500).send("Server error");
    }

    if (result.length > 0) {
      return res.status(409).send("⚠️ Username already exists");
    }

    try {
    const hashedPassword = await bcrypt.hash(password, 10);

      const salt = `$5$rounds=5000steamedhams${username}$`;

     const insertQuery = `
  INSERT INTO users (username, password, salt, Pnumber, profile_index)
  VALUES (?, ?, ?, ?, ?)
`;


      db.query(insertQuery, [username, hashedPassword, salt, number, image], (err) => {
        if (err) {
          console.error("❌ Insert failed:", err);
          return res.status(500).send("Database error");
        }

        return res.send("Regitstration SuccessFull"); // ✅ Success
      });
    } catch (err) {
      console.error("❌ Hashing error:", err);
      return res.status(500).send("Password hashing failed");
    }
  });
});

module.exports = router;
