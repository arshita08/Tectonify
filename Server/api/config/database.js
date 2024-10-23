const Sequelize = require('sequelize');

// configure this with your own parameters
const database = new Sequelize({
    database: process.env.DATABASE_NAME,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    dialect: 'mysql',
});

module.exports = database;