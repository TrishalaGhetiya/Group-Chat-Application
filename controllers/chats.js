const Chat = require('../models/chats');
const User = require('../models/user');
const { Op } = require("sequelize");

exports.getMessages = async(req, res, next) => {
    try{
        const lastMsgId = req.query.lastMsgId;
        console.log(lastMsgId);
        const messages = await Chat.findAll({
            where: {id: {[Op.gt]: lastMsgId}},
            attributes: ['id', 'message'],
            include: [{
                model: User,
                attributes: ['id', 'firstName']
            }]
        });
        //console.log(messages);
        res.json(messages);
    }
    catch(err){
        console.log(err);
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