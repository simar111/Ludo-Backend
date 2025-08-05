const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const util = require("util");

const router = express.Router();
const query = util.promisify(db.query).bind(db); // Promisify db.query for async/await

// POST /register
router.post("/register", async (req, res) => {
  const { name: username, password, number, image } = req.body;

  // Input validation
  if (!username || !password || !number || typeof image !== "number") {
    return res.status(400).json({ error: "❌ Invalid request data" });
  }

  try {
    // Check if username already exists
    const existingUser = await query("SELECT username FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "⚠️ Username already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Add user to database
    const insertQuery = `
      INSERT INTO users (username, password, salt, Pnumber, profile_index)
      VALUES (?, ?, ?, ?, ?)
    `;

    // Keeping salt logic as per original (though not needed with bcrypt)
    const salt = `$5$rounds=5000steamedhams${username}$`;

    await query(insertQuery, [username, hashedPassword, salt, number, image]);

    return res.status(200).json({ message: "✅ Registration successful" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
