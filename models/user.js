const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

//Create Table named user in database
const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      firstName:{
        type: Sequelize.STRING 
      },
      lastName:{
        type: Sequelize.STRING 
      },
      email:{
        type: Sequelize.STRING,
        allowNull:false,
        unique: true
      },
      phNumber:{
        type: Sequelize.STRING,
        allowNull:false
      },
      password: {
        type: Sequelize.TEXT
      },
});

module.exports = User;