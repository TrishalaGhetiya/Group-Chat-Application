const Chat = require('../models/chats');
const User = require('../models/user');
const { Op } = require("sequelize");

exports.getMessages = async(req, res, next) => {
    try{
        //const lastMsgId = req.query.lastMsgId;
        //console.log(lastMsgId);
        console.log(req.query.group);
        const messages = await Chat.findAll({
            where: {groupId: req.query.group},
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
        const groupId = req.body.groupId;
        console.log(groupId);
        const addedMessage = await Chat.create({
            message: message,
            userId: userId,
            groupId: groupId
        })
        res.status(200).json({ message: 'message sent successfully', success: true});
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong'});
    }
}