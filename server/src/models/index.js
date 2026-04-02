const User = require('./User');
const Listing = require('./Listing');

User.hasMany(Listing, { foreignKey: 'userId', onDelete: 'CASCADE' });
Listing.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
    User,
    Listing,
};