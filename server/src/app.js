const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const listingsRoutes = require('./routes/listingsRoutes');

const app = express();

app.use(
    cors({
        origin: process.env.CLIENT_URL || 'http://localhost:5173',
        credentials: true,
    })
);

app.use(express.json());

app.use(
    session({
        secret: process.env.SESSION_SECRET || 'search_roommates_secret',
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            secure: false,
            sameSite: 'lax',
            maxAge: 1000 * 60 * 60 * 24,
        },
    })
);

app.get('/', (req, res) => {
    res.json({ message: 'Search Roommates API is working' });
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingsRoutes);

module.exports = app;