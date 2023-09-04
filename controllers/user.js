const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Sign up user
exports.postSignUpUser = async (req, res, next) => {
    const {firstName, lastName, email, phNumber, password} = req.body;
    try{
        const user = await User.findOne({ where: {email}});
        if(user){
            res.status(409).json({error: 'user already exists', success: false});
        }
        else{
            bcrypt.hash(password, 5, async (err, hash) => {
                if(err){
                    throw new Error(err);
                }
                else{
                    await User.create({
                        firstName: firstName,
                        lastName: lastName,
                        email: email,
                        phNumber: phNumber,
                        password: hash
                    })
                    console.log('User added');
                    return res.status(200).json({message: 'successfully created new user'});
                    
                }
            }) 
        }
       
    }
    catch(err){
        console.log(err);
        return res.status(403).json({message: 'Something went wrong'});
    }
}