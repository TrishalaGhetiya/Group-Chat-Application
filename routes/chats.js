const express = require('express');
const router = express.Router();

const chatController = require('../controllers/chats');
const userAuthentication = require('../middlewares/user-authentication');

//Loading Page
router.get('/', chatController.getMessages);

//Sent Message
router.post('/sendMessage', userAuthentication.authenticate, chatController.sendMessage);


module.exports = router;