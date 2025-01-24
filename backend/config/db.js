require('dotenv').config();

console.log('DB_HOST:', process.env.DB_HOST);  // Should output 'localhost'
console.log('JWT_SECRET:', process.env.JWT_SECRET);  // Should output 'ithb'

// sequelize.js (or db.js)
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: 'mariadb',
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
})();

module.exports = sequelize;