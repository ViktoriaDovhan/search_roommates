const { User, Listing } = require('../models');

async function getUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: ['id', 'firstName', 'lastName', 'email', 'role', 'isActive', 'isVerified'],
            order: [['createdAt', 'DESC']],
        });

        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: 'Fetch users error', error: error.message });
    }
}

async function getAdminStats(req, res) {
    try {
        const totalUsers = await User.count();
        const totalListings = await Listing.count();
        const activeListings = await Listing.count({ where: { isActive: true } });
        const inactiveListings = await Listing.count({ where: { isActive: false } });

        return res.json({
            totalUsers,
            totalListings,
            activeListings,
            inactiveListings,
        });
    } catch (error) {
        return res.status(500).json({ message: 'Fetch admin stats error', error: error.message });
    }
}

module.exports = {
    getUsers,
    getAdminStats,
};