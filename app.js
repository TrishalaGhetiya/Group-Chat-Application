const fs = require('fs');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const morgan = require('morgan');
const CronJob = require('cron').CronJob;
const sequelize = require('./utils/database');
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketIo = require('socket.io');
const io = socketIo(server, {
    cors: {
        origin: ['http://127.0.0.1:5500'],
    },
});

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: '*'
}));

sequelize
    .sync()
    .then(result => {
        server.listen(process.env.PORT || 3000);
    })
    .catch(err => console.log(err));

io.on('connection', (socket) => {
    console.log('A user is connected');

    socket.on('send-message', messageObj => {
        io.emit('recieve-message', messageObj);
        console.log(messageObj);
    })
  
    // socket.on('send-message', (message) => {
    //   console.log(`message from ${socket.id} : ${message}`);
    // })
  
    socket.on('disconnect', () => {
      console.log(`socket ${socket.id} disconnected`);
    })
  })

const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {flags: 'a'});

app.use(morgan('combined', {stream: accessLogStream}));

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const User = require('./models/user');
const Chat = require('./models/chats');
const Group = require('./models/groups');
const UserGroup = require('./models/user-group');
const ArchivedChats = require('./models/archivedChats');

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

var job = new CronJob(
    '0 0 * * * ',
    async function() {
        try{
            const chats = await Chat.findAll();
            for(let i=0;i<chats.length;i++){
                let message = chats[i].message;
                let imageURL = chats[i].imageURL;

                const newTable = await ArchivedChats.create({
                    message: message,
                    imageURL: imageURL
                })
            }
        }
        catch(err){
            console.log(err);
        }

    },
    null,
    true
);

