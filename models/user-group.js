const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//Create Table named UserGroup in database
const UserGroup = sequelize.define('usergroup',{
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      }
});

module.exports = UserGroup;