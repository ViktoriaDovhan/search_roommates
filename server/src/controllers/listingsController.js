const { Op } = require('sequelize');
const { Listing, User } = require('../models');

async function getPublicListings(req, res) {
    try {
        const { search = '', city = '', genderPreference = '' } = req.query;

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

        const listings = await Listing.findAll({
            where,
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return res.json(listings);
    } catch (error) {
        return res.status(500).json({ message: 'Fetch listings error', error: error.message });
    }
}

async function getAdminListings(req, res) {
    try {
        const listings = await Listing.findAll({
            include: [
                {
                    model: User,
                    attributes: ['id', 'firstName', 'lastName', 'email'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });

        return res.json(listings);
    } catch (error) {
        return res.status(500).json({ message: 'Fetch admin listings error', error: error.message });
    }
}

async function createListing(req, res) {
    try {
        const { title, city, district, price, genderPreference, description } = req.body;

        if (!title || !city || !price || !description) {
            return res.status(400).json({ message: 'Required fields are missing' });
        }

        const listing = await Listing.create({
            title,
            city,
            district,
            price,
            genderPreference,
            description,
            userId: req.session.user.id,
            isActive: true,
        });

        return res.status(201).json(listing);
    } catch (error) {
        return res.status(500).json({ message: 'Create listing error', error: error.message });
    }
}

async function updateListing(req, res) {
    try {
        const { id } = req.params;
        const listing = await Listing.findByPk(id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const isOwner = listing.userId === req.session.user.id;
        const isAdmin = req.session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const { title, city, district, price, genderPreference, description } = req.body;

        await listing.update({
            title,
            city,
            district,
            price,
            genderPreference,
            description,
        });

        return res.json(listing);
    } catch (error) {
        return res.status(500).json({ message: 'Update listing error', error: error.message });
    }
}

async function deleteListing(req, res) {
    try {
        const { id } = req.params;
        const listing = await Listing.findByPk(id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const isOwner = listing.userId === req.session.user.id;
        const isAdmin = req.session.user.role === 'admin';

        if (!isOwner && !isAdmin) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        await listing.destroy();

        return res.json({ message: 'Listing deleted' });
    } catch (error) {
        return res.status(500).json({ message: 'Delete listing error', error: error.message });
    }
}

async function toggleListingActive(req, res) {
    try {
        const { id } = req.params;
        const listing = await Listing.findByPk(id);

        if (!listing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        listing.isActive = !listing.isActive;
        await listing.save();

        return res.json(listing);
    } catch (error) {
        return res.status(500).json({ message: 'Toggle listing error', error: error.message });
    }
}

module.exports = {
    getPublicListings,
    getAdminListings,
    createListing,
    updateListing,
    deleteListing,
    toggleListingActive,
};