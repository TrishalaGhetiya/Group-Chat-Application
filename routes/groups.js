const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groups');
const userAuthentication = require('../middlewares/user-authentication');

//Create Group
router.post('/createGroup', groupController.createGroup);

//Fetch All Groups
router.get('/getGroups', userAuthentication.authenticate, groupController.getGroups);

module.exports = router;