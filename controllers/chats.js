const Chat = require('../models/chats');
const User = require('../models/user');

exports.sendMessage = async (req, res, next) => {
    try{
        const message = req.body.message;
        const userId = req.user.id;
        const addedMessage = await Chat.create({
            message: message,
            userId: userId
        })
        console.log(addedMessage);
    }
    catch(err){
        console.log(err);
    }
}