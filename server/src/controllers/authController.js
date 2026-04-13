const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const transporter = require('../config/mailer');
const { User } = require('../models');

async function register(req, res) {
    try {
        const { firstName, lastName, email, password } = req.body;

        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const verificationToken = crypto.randomBytes(32).toString('hex');

        const user = await User.create({
            firstName,
            lastName,
            email,
            passwordHash,
            role: 'user',
            verificationToken,
            isVerified: false,
            isActive: true,
        });

        const verificationLink = `${process.env.SERVER_URL}/api/auth/verify/${verificationToken}`;

        return res.status(201).json({
            message: 'Registration successful',
            verificationToken,
            verificationLink,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        return res.status(500).json({ message: 'Registration error', error: error.message });
    }
}

async function verifyEmail(req, res) {
    try {
        const { token } = req.params;

        const user = await User.findOne({ where: { verificationToken: token } });

        if (!user) {
            return res.status(400).send('<h2>Invalid or expired verification link</h2>');
        }

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        return res.send(`
      <h2>Email verified successfully</h2>
      <p>You can now return to the app and log in.</p>
      <a href="${process.env.CLIENT_URL}/login">Go to login</a>
    `);
    } catch (error) {
        return res.status(500).send('<h2>Verification error</h2>');
    }
}

async function login(req, res) {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        if (!user.isVerified) {
            return res.status(403).json({ message: 'Please verify your email first' });
        }

        if (!user.isActive) {
            return res.status(403).json({ message: 'Your account is inactive' });
        }

        req.session.user = {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
        };

        return res.json({
            message: 'Login successful',
            user: req.session.user,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Login error', error: error.message });
    }
}

function me(req, res) {
    if (!req.session.user) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    return res.json(req.session.user);
}

function logout(req, res) {
    req.session.destroy(() => {
        res.clearCookie('connect.sid');
        return res.json({ message: 'Logged out' });
    });
}

module.exports = {
    register,
    verifyEmail,
    login,
    me,
    logout,
};