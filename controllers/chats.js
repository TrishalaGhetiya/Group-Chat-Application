const Chat = require('../models/chats');
const User = require('../models/user');

exports.getMessages = async(req, res, next) => {
    try{
        const messages = await Chat.findAll({
            attributes: ['message'],
            include: [{
                model: User,
                attributes: ['id', 'firstName']
            }]
        });
        console.log(messages);
        res.json(messages);
    }
    catch(err){
        res.status(500).json({ message: 'Something went wrong'});
    }
}

exports.sendMessage = async (req, res, next) => {
    try{
        const message = req.body.message;
        const userId = req.user.id;
        const addedMessage = await Chat.create({
            message: message,
            userId: userId
        })
        res.status(200).json({ message: 'message sent successfully', success: true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong'});
    }
}