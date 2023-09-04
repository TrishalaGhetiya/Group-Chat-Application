const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.MYSQL_DEFAULT_DATABASE_SCHEMA, process.env.MYSQL_USERNAME, process.env.MYSQL_PASSWORD, {
    dialect: 'mysql', 
    host: 'localhost'
});

module.exports = sequelize;