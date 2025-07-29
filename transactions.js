const express = require("express");
const router = express.Router();
const db = require("./db"); // This assumes you have db.js in root

// POST endpoint to update balance
router.post("/update-balance", (req, res) => {
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
    db.query(updateBalanceQuery, [newBalance, username], (err) => {
      if (err) {
        console.error("4: Balance update failed", err);
        return res.status(500).send("4: Balance update failed");
      }

      return res.send("0"); // Success
    });
  });
});

module.exports = router;
