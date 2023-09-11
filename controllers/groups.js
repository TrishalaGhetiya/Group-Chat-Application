const Group = require('../models/groups');
const Chat = require('../models/chats');
const User = require('../models/user');
const UserGroup = require('../models/user-group');
const sequelize = require('../utils/database');

exports.createGroup = async (req, res, next) => {
    const t = await sequelize.transaction();
    try{
        console.log(req.body.groupName);
        console.log(req.body.groupUsers[0]);
        const group = await Group.create({
            groupName: req.body.groupName
        }, { transaction: t }) 
        for(let i=0;i<req.body.groupUsers.length;i++){
            const usergroup = await UserGroup.create({
                userId: req.body.groupUsers[i],
                groupId: group.id
            }, { transaction: t })
        }
        await t.commit();
        res.status(200).json(group);
        
    }
    catch(err){
        await t.rollback();
        console.log(err);
        res.status(500).json({message: 'Cannot Create new group'});
    }
}

exports.getGroups = async (req, res, next) => {
    try{
        const groups = await User.findOne({
            where: {id: req.user.id},
            include: Group
        })
        res.status(200).json(groups);
    }
    catch(err){
        console.log(err);
        res.status(500).json({ message: 'Something went wrong'});
    }
}