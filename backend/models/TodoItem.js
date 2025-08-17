// models/TodoItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.js'); // Reuse the sequelize instance

const TodoItem = sequelize.define('todo_items', {
    item_id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM,
        values: ['pending','in_progress','completed'],
        allowNull: true,
    },
    priority: {
        type: DataTypes.ENUM,
        values: ['low','medium','high'],
        allowNull: true,
    },
    due_date: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    created_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    completed_at: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    }
}, {
    // Explicitly disable timestamps
    timestamps: true,   // enables createdAt and updatedAt
    paranoid: true,     // enables deletedAt for soft deletes
});

module.exports = TodoItem;