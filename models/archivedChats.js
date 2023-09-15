const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//Create Table named ArchivedChats in database
const ArchivedChats = sequelize.define('archivedChats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    message: {
        type: Sequelize.TEXT
    },
    imageURL: Sequelize.TEXT
});

module.exports = ArchivedChats;