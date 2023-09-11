const express = require('express');
const router = express.Router();

const groupController = require('../controllers/groups');
const userAuthentication = require('../middlewares/user-authentication');

//Create Group
router.post('/createGroup',userAuthentication.authenticate, groupController.createGroup);

//Fetch All Groups
router.get('/getGroups', userAuthentication.authenticate, groupController.getGroups);

//remove User from a group
router.delete('/removeUserFromGroup/:userId', groupController.removeUserFromGroup);

//Make a user Admin
router.post('/makeUserAdmin')

module.exports = router;