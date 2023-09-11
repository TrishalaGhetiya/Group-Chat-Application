const jwt = require('jsonwebtoken');
const User = require('../models/user');
require('dotenv').config();

exports.authenticate = async (req, res, next) => {
    try{
        const token = req.header('authorization');
        const authUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findByPk(authUser.userId);
        console.log(user);
        req.user = user;
        next();
    }
    catch(err){
        console.log(err);
    }
}