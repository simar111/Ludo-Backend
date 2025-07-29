const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const loginRoute = require('./login');
const registerRoute=require('./register');
const transactionRoute=require('./transactions');
const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.use('/', loginRoute);
app.use('/',transactionRoute);
app.use('',registerRoute);

app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
