const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');
const userAuthentication = require('../middlewares/user-authentication');

//Loading Page
router.get('/');

//SignUp user
router.post('/signup', userController.postSignUpUser);

//Login user
router.post('/login', userController.postLoginUser);

//Get All Users
router.get('/getUsers', userController.getUsers)

module.exports = router;