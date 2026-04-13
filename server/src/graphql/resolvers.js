const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { Op } = require('sequelize');
const transporter = require('../config/mailer');
const { User, Listing } = require('../models');

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
    const { title, city, district, price, genderPreference, description } = input;

    if (!title || !city || price === undefined || price === null || !description) {
        throw new Error('Required fields are missing');
    }

    return {
        title,
        city,
        district: district || null,
        price: Number(price),
        genderPreference: genderPreference || 'any',
        description,
    };
}

function createResolvers(req, res) {
    return {
        me: async () => {
            if (!req.session.user) {
                return null;
            }

            return req.session.user;
        },

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
                        attributes: ['id', 'firstName', 'lastName', 'email'],
                    },
                ],
                order: [['createdAt', 'DESC']],
            });
        },

        adminUsers: async () => {
            requireAdmin(req);

            return User.findAll({
                attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isVerified', 'isActive'],
                order: [['createdAt', 'DESC']],
            });
        },

        register: async ({ input }) => {
            const { firstName, lastName, email, password } = input;

            if (!firstName || !lastName || !email || !password) {
                throw new Error('All fields are required');
            }

            const existingUser = await User.findOne({ where: { email } });

            if (existingUser) {
                throw new Error('User already exists');
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

        login: async ({ input }) => {
            const { email, password } = input;

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

            return req.session.user;
        },

        logout: async () => {
            await new Promise((resolve) => {
                req.session.destroy(() => {
                    res.clearCookie('connect.sid');
                    resolve();
                });
            });

            return { message: 'Logged out' };
        },

        createListing: async ({ input }) => {
            const currentUser = requireAuth(req);
            const data = validateListingInput(input);

            const listing = await Listing.create({
                ...data,
                userId: currentUser.id,
                isActive: true,
            });

            return Listing.findByPk(listing.id, {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
            });
        },

        updateListing: async ({ id, input }) => {
            const currentUser = requireAuth(req);
            const listing = await Listing.findByPk(id);

            if (!listing) {
                throw new Error('Listing not found');
            }

            const isOwner = listing.userId === currentUser.id;
            const isAdmin = currentUser.role === 'admin';

            if (!isOwner && !isAdmin) {
                throw new Error('Forbidden');
            }

            const data = validateListingInput(input);
            await listing.update(data);

            return Listing.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
            });
        },

        deleteListing: async ({ id }) => {
            const currentUser = requireAuth(req);
            const listing = await Listing.findByPk(id);

            if (!listing) {
                throw new Error('Listing not found');
            }

            const isOwner = listing.userId === currentUser.id;
            const isAdmin = currentUser.role === 'admin';

            if (!isOwner && !isAdmin) {
                throw new Error('Forbidden');
            }

            await listing.destroy();

            return { message: 'Listing deleted' };
        },

        toggleListingActive: async ({ id }) => {
            requireAdmin(req);

            const listing = await Listing.findByPk(id);

            if (!listing) {
                throw new Error('Listing not found');
            }

            listing.isActive = !listing.isActive;
            await listing.save();

            return Listing.findByPk(id, {
                include: [
                    {
                        model: User,
                        attributes: ['id', 'firstName', 'lastName'],
                    },
                ],
            });
        },
    };
}

module.exports = createResolvers;