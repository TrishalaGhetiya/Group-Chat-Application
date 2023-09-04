const express = require('express');
const router = express.Router();

const userController = require('../controllers/user');

//Loading Page
router.get('/');

//SignUp user
router.post('/signup', userController.postSignUpUser);

module.exports = router;