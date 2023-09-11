const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const morgan = require('morgan');

const sequelize = require('./utils/database');

const app = express();

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));
app.use(cors({
    origin: '*'
}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/groups');
const UserGroup = require('./models/user-group');

const errorController = require('./controllers/error');
const userRoutes = require('./routes/user');
const chatroutes = require('./routes/chats');
const groupRoutes = require('./routes/groups');

app.use(chatroutes);
app.use(userRoutes);
app.use(groupRoutes);
app.use(errorController.get404);

User.hasMany(Chat);
Chat.belongsTo(User);

User.belongsToMany(Group, {
    through: UserGroup,
  });
  
Group.belongsToMany(User, {
    through: UserGroup,
});

Group.hasMany(Chat);
Chat.belongsTo(Group);

sequelize
    .sync()
    .then(result => {
        app.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err));