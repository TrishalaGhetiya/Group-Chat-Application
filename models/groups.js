const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//Create Table named groups in database
const Group = sequelize.define('groups', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
    groupName: {
        type: Sequelize.TEXT
    }
});

module.exports = Group;