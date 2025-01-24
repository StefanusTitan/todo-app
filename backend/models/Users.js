const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Reuse the sequelize instance

const User = sequelize.define('users', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    profile_picture_path: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    updated_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    last_login: {
        type: DataTypes.DATE,
        allowNull: true
    },
    last_logout: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    // Explicitly disable timestamps
    timestamps: false
});

module.exports = User;