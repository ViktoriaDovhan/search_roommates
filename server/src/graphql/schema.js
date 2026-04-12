const { buildSchema } = require('graphql');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');

const transporter = require('../config/mailer');
const { Listing, User } = require('../models');

const schema = buildSchema(`
    type User {
        id: ID!
        firstName: String
        lastName: String
        email: String
        role: String
        isVerified: Boolean
        isActive: Boolean
    }

    type Listing {
        id: ID!
        title: String!
        city: String!
        district: String
        price: Int!
        genderPreference: String!
        description: String!
        isActive: Boolean!
        userId: Int
        User: User
    }

    type MessagePayload {
        message: String!
    }

    type AuthPayload {
        message: String!
        user: User!
    }

    input RegisterInput {
        firstName: String!
        lastName: String!
        email: String!
        password: String!
    }

    input ListingInput {
        title: String!
        city: String!
        district: String
        price: Int!
        genderPreference: String
        description: String!
    }

    type Query {
        publicListings(search: String, city: String, genderPreference: String): [Listing!]!
        adminListings: [Listing!]!
        adminUsers: [User!]!
        me: User
    }

    type Mutation {
        register(input: RegisterInput!): MessagePayload!
        verifyEmail(token: String!): MessagePayload!
        login(email: String!, password: String!): AuthPayload!
        logout: MessagePayload!
        createListing(input: ListingInput!): Listing!
        updateListing(id: ID!, input: ListingInput!): Listing!
        deleteListing(id: ID!): MessagePayload!
        toggleListingActive(id: ID!): Listing!
    }
`);

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requireAuth(req) {
    if (!req.session.user) {
        throw new Error('Unauthorized');
    }

    return req.session.user;
}

function requireAdmin(req) {
    const user = requireAuth(req);

    if (user.role !== 'admin') {
        throw new Error('Forbidden');
    }

    return user;
}

function validateListingInput(input) {
    if (!input.title || !input.title.trim()) {
        throw new Error("Заголовок обов'язковий");
    }

    if (!input.city || !input.city.trim()) {
        throw new Error("Місто обов'язкове");
    }

    if (!String(input.price).trim()) {
        throw new Error("Ціна обов'язкова");
    }

    if (Number(input.price) <= 0) {
        throw new Error('Ціна має бути більшою за 0');
    }

    if (!input.description || !input.description.trim()) {
        throw new Error("Опис обов'язковий");
    }
}

function createRoot(req, res) {
    return {
        publicListings: async ({ search = '', city = '', genderPreference = '' }) => {
            const where = {
                isActive: true,
            };

            if (city) {
                where.city = { [Op.iLike]: `%${city}%` };
            }

            if (genderPreference) {
                where.genderPreference = genderPreference;
            }

            if (search) {
                where[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { city: { [Op.iLike]: `%${search}%` } },
                    { district: { [Op.iLike]: `%${search}%` } },
                    { description: { [Op.iLike]: `%${search}%` } },
                ];
            }

            return Listing.findAll({
                where,
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        },

        adminListings: async () => {
            requireAdmin(req);

            return Listing.findAll({
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'isVerified'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        },

        adminUsers: async () => {
            requireAdmin(req);

            return User.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'isVerified'],
                order: [['createdAt', 'DESC']],
            });
        },

        me: async () => {
            return req.session.user || null;
        },

        register: async ({ input }) => {
            const { firstName, lastName, email, password } = input;

            if (!firstName || !lastName || !email || !password) {
                throw new Error('All fields are required');
            }

            if (!EMAIL_REGEX.test(email)) {
                throw new Error('Invalid email format');
            }

            if (password.length < 6) {
                throw new Error('Password must contain at least 6 characters');
            }

            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                throw new Error('User already exists');
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const verificationToken = crypto.randomBytes(32).toString('hex');

            const user = await User.create({
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                email: email.trim(),
                passwordHash,
                role: 'user',
                verificationToken,
                isVerified: false,
            });

            const verifyLink = `${process.env.SERVER_URL}/api/auth/verify/${verificationToken}`;

            await transporter.sendMail({
                from: process.env.SMTP_FROM,
                to: user.email,
                subject: 'Verify your email',
                html: `
                    <h2>Search Roommates</h2>
                    <p>Hello, ${user.firstName}!</p>
                    <p>Click the link below to verify your email:</p>
                    <a href="${verifyLink}">${verifyLink}</a>
                `,
            });

            return {
                message: 'Registration successful. Check your email to verify your account.',
            };
        },

        verifyEmail: async ({ token }) => {
            const user = await User.findOne({ where: { verificationToken: token } });

            if (!user) {
                throw new Error('Invalid or expired verification link');
            }

            user.isVerified = true;
            user.verificationToken = null;
            await user.save();

            return {
                message: 'Email verified successfully',
            };
        },

        login: async ({ email, password }) => {
            const user = await User.findOne({ where: { email } });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            if (!user.isVerified) {
                throw new Error('Please verify your email first');
            }

            if (!user.isActive) {
                throw new Error('Your account is inactive');
            }

            req.session.user = {
                id: user.id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
            };

            return {
                message: 'Login successful',
                user: req.session.user,
            };
        },

        logout: async () => {
            return new Promise((resolve, reject) => {
                req.session.destroy((error) => {
                    if (error) {
                        reject(new Error('Logout error'));
                        return;
                    }

                    if (res) {
                        res.clearCookie('connect.sid');
                    }

                    resolve({
                        message: 'Logged out',
                    });
                });
            });
        },

        createListing: async ({ input }) => {
            const currentUser = requireAuth(req);

            validateListingInput(input);

            const listing = await Listing.create({
                title: input.title.trim(),
                city: input.city.trim(),
                district: input.district ? input.district.trim() : '',
                price: Number(input.price),
                genderPreference: input.genderPreference || 'any',
                description: input.description.trim(),
                userId: currentUser.id,
                isActive: true,
            });

            return listing;
        },

        updateListing: async ({ id, input }) => {
            const currentUser = requireAuth(req);
            const listing = await Listing.findByPk(Number(id));

            if (!listing) {
                throw new Error('Listing not found');
            }

            const isOwner = listing.userId === currentUser.id;
            const isAdmin = currentUser.role === 'admin';

            if (!isOwner && !isAdmin) {
                throw new Error('Forbidden');
            }

            validateListingInput(input);

            await listing.update({
                title: input.title.trim(),
                city: input.city.trim(),
                district: input.district ? input.district.trim() : '',
                price: Number(input.price),
                genderPreference: input.genderPreference || 'any',
                description: input.description.trim(),
            });

            return listing;
        },

        deleteListing: async ({ id }) => {
            const currentUser = requireAuth(req);
            const listing = await Listing.findByPk(Number(id));

            if (!listing) {
                throw new Error('Listing not found');
            }

            const isOwner = listing.userId === currentUser.id;
            const isAdmin = currentUser.role === 'admin';

            if (!isOwner && !isAdmin) {
                throw new Error('Forbidden');
            }

            await listing.destroy();

            return {
                message: 'Listing deleted',
            };
        },

        toggleListingActive: async ({ id }) => {
            requireAdmin(req);

            const listing = await Listing.findByPk(Number(id));

            if (!listing) {
                throw new Error('Listing not found');
            }

            listing.isActive = !listing.isActive;
            await listing.save();

            return listing;
        },
    };
}

module.exports = {
    schema,
    createRoot,
};