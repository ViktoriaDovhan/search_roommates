const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Listing = sequelize.define('Listing', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },

    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    city: {
        type: DataTypes.STRING,
        allowNull: false,
    },

    district: {
        type: DataTypes.STRING,
        allowNull: true,
    },

    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },

    genderPreference: {
        type: DataTypes.ENUM('any', 'female', 'male'),
        allowNull: false,
        defaultValue: 'any',
    },

    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
});

module.exports = Listing;