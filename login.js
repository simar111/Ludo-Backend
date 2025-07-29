const express = require('express');
const bcrypt = require('bcrypt');
const db = require('./db'); // Importing the shared DB connection
const router = express.Router();

// Login API
router.post('/login', async (req, res) => {
    const { name: username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    const query = `SELECT username, salt, hash, TotalBalance, Pnumber, image FROM users WHERE username = ?`;

    db.query(query, [username], async (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('2: Query failed');
        }

        if (results.length !== 1) {
            return res.status(404).send('5: Either no user or more than one');
        }

        const user = results[0];

        const passwordMatch = await bcrypt.compare(password, user.hash);

        if (!passwordMatch) {
            return res.status(401).send('6: Incorrect password');
        }

        const responseString = `0\t${user.TotalBalance}\t${user.Pnumber}\t${user.image}`;
        res.send(responseString);
    });
});

module.exports = router;
