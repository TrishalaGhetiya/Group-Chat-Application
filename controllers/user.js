const User = require('../models/user');
const Group = require('../models/groups');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

//Generate encrypted token to send to frontend
function generateToken(id){
    return jwt.sign({userId: id}, process.env.JWT_SECRET_KEY);
}

//Sign up user
exports.postSignUpUser = async (req, res, next) => {
    const {firstName, lastName, email, phNumber, password} = req.body;
    try{
        const user = await User.findOne({ where: {email}});
        if(user){
            console.log('user exists');
            res.status(409).json({message: 'user already exists', success: false});
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

//Login User
exports.postLoginUser = async (req, res, next) => {
    try{
        const user = await User.findOne({ where: { email: req.body.email } });
        if(user!=null){
            bcrypt.compare(req.body.pass, user.password, async (err, result) => {
                if(err){
                    throw new err;
                }
                if(result === true){
                   res.json({message: 'User logged in successfully', token: generateToken(user.id)});
                }
                else{
                    res.status(401).json({ error: "password doesn't match" });
                }
            })
        }
        else{
            res.status(400).json({ error: "User doesn't exist" });
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json(err);
    }
}

//fetch users
exports.getUsers = async (req, res, next) => {
    try{
        const users = await User.findAll();
        console.log('users send');
        res.status(200).json(users);
    }
    catch(err){
        res.status(500).json({ message: 'Something went wrong' });
    }
}

//fetch users of a particular group
exports.getUsersOfGroup = async (req, res, next) => {
    try{
        console.log(req.query.groupId);
        const users = await Group.findOne({
            where: {id: req.query.groupId},
            include: User
        })
        res.status(200).json(users);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong'});
    }
}