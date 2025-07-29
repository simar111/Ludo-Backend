// db.js
const mysql = require('mysql2');

// Create the connection pool
const db = mysql.createPool({
  host: 'localhost',
  user: 'agkkubavvn',
  password: 'w3n6GzuDMS&12340',
  database: 'ludo_game_db', // use your actual database name
  connectionLimit: 10, // optional, controls max concurrent connections
});

// Test the DB connection once
db.getConnection((err, connection) => {
  if (err) {
    console.error('❌ MySQL connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL database.');
    connection.release(); // release the test connection
  }
});

module.exports = db;
