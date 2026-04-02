const { User } = require('../models');

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

module.exports = {
    getUsers,
};