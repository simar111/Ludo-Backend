const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'agkkubavvn',
    password: 'w3n6GzuDMS&12340',
    database: 'agkkubavvn'
});

// Connect DB
db.connect((err) => {
    if (err) {
        console.error('1: Connection failed', err);
        return;
    }
    console.log('✅ Connected to MySQL DB');
});

// Login route
app.post('/login', async (req, res) => {
    const { name: username, password } = req.body;

    if (!username || !password) {
        return res.status(400).send('Missing username or password');
    }

    const query = `SELECT username, salt, hash, TotalBalance, Pnumber, image FROM users WHERE username = ?`;

    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).send('2: Query failed');
        }

        if (results.length !== 1) {
            return res.status(404).send('5: Either no user or more than one');
        }

        const user = results[0];

        // Compare the stored hashed password with the input
        const passwordMatch = await bcrypt.compare(password, user.hash);

        if (!passwordMatch) {
            return res.status(401).send('6: Incorrect password');
        }

        const responseString = `0\t${user.TotalBalance}\t${user.Pnumber}\t${user.image}`;
        res.send(responseString);
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
