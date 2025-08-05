const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db');
const util = require('util');

const router = express.Router();
const query = util.promisify(db.query).bind(db);

// POST /login
router.post('/login', async (req, res) => {
    const { name: username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: '❌ Missing username or password' });
    }

    const sql = `
        SELECT username, password, TotalBalance, Pnumber, profile_index
        FROM users WHERE username = ?
    `;

    try {
        const results = await query(sql, [username]);

        if (results.length !== 1) {
            return res.status(404).json({ error: '⚠️ User not found or duplicate users exist' });
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: '🔐 Incorrect password' });
        }

        // Construct success response
        const responseString = `0\t${user.TotalBalance}\t${user.Pnumber}\t${user.profile_index}`;

        return res.status(200).json({
            message: '✅ Login successful',
            data: responseString,
            user: {
                username: user.username,
                balance: user.TotalBalance,
                phone: user.Pnumber,
                profileIndex: user.profile_index
            }
        });

    } catch (err) {
        console.error("❌ Login error:", err);
        return res.status(500).json({ error: 'Internal server error during login' });
    }
});

module.exports = router;
