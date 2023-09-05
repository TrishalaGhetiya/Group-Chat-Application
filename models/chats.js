const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//Create Table named chats in database
const Chat = sequelize.define('chats', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    message: {
        type: Sequelize.TEXT
    }
});

module.exports = Chat;