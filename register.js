const express = require("express");
const bcrypt = require("bcrypt");
const db = require("./db");
const util = require("util");

const router = express.Router();
const query = util.promisify(db.query).bind(db);

// POST /register
router.post("/register", async (req, res) => {
  const { name: username, password, number, image } = req.body;

  if (!username || !password || !number || typeof image !== "number") {
    return res.status(400).json({ error: "❌ Invalid request data" });
  }

  try {
    // Check if username already exists
    const existingUser = await query("SELECT username FROM users WHERE username = ?", [username]);
    if (existingUser.length > 0) {
      return res.status(409).json({ error: "⚠️ Username already exists" });
    }

    // Hash password using bcrypt (salt managed internally)
    const hashedPassword = await bcrypt.hash(password, 10); // 10 rounds is standard

    // If you need to reference a custom salt string from .env (for other logic)
    const customSaltPrefix = process.env.CUSTOM_SALT_PREFIX || "";

    // Insert user into DB (salt no longer stored)
    const insertQuery = `
      INSERT INTO users (username, password, Pnumber, profile_index)
      VALUES (?, ?, ?, ?)
    `;

    await query(insertQuery, [username, hashedPassword, number, image]);

    return res.status(200).json({ message: "✅ Registration successful" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
