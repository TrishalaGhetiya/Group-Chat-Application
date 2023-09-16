const message = document.getElementById('message');
const sendMessageForm = document.getElementById('sendMessage');
const printMessages = document.getElementById('printMessages');
const message_text = document.getElementById('message-text');
const message_info_name = document.getElementById('message_info_name');
const updateMessage = document.getElementById('updateMessage');
const logout = document.getElementById('logout');
const userList = document.getElementById('userList');
const updateGroups = document.getElementById('updateGroups');
const showUsers = document.getElementById('showUsers');
const createNewGroup = document.getElementById('createNewGroup');
const groupName = document.getElementById('groupName');
const activeGroup = document.getElementById('activeGroup');
const activeGroupData = document.getElementById('activeGroupData');
const image = document.getElementById('image');
let lastMsgId;
let active;
const groupData = [];
const groupUsers = [];
const userData = [];
const allMessages = [];
const activeGroupUsers = [];

const socket = io('http://localhost:3000');
socket.on('connection', () => {
    console.log('connected to server');
})

socket.on('recieve-message', messageObj => {
    console.log(messageObj.name);
    showMessagesOnScreen(messageObj);
})

sendMessageForm.addEventListener('submit', sendMessage);
logout.addEventListener('click', logOut);
createNewGroup.addEventListener('submit', createGroup);
showUsers.addEventListener('click', addUsers);
updateGroups.addEventListener('click', getMessages);
activeGroupData.addEventListener('click', updateUsersInGroup);

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

window.addEventListener('DOMContentLoaded', async() => {
    try{
        const token = localStorage.getItem("token");
        // socket.on('getUsers', () => {
        //     console.log('got users');
        // })
        const users = await axios.get('http://localhost:3000/getUsers');
        //console.log(users);
        for(let i=0;i<users.data.length;i++){
            const id = parseJwt(token);
            //console.log(id.userId); 
            //console.log(users.data[i].id);
            if(users.data[i].id != id.userId){
                userData.push(users.data[i]);
                showUsersOnScreen(users.data[i]);
            }
        }
        
        const groups = await axios.get('http://localhost:3000/getGroups', {headers: {'Authorization': token}});
        //console.log(groups);
        for(let i=0;i<groups.data.groups.length;i++){
            groupData.push(groups.data.groups[i]);
            showGroupsOnScreen(groups.data.groups[i]);
        } 
    }
    catch(err){
        console.log(err);
        //alert(err.response.data.message);
    }
})

async function sendMessage(e){
    try{
        e.preventDefault();
        console.log(image.value);
        const token = localStorage.getItem('token');
        for(let i=0;i<groupData.length;i++){
            if(groupData[i].groupName === active){
                groupId = groupData[i].id;
            }
        } 
        const decodedToken = parseJwt(token);
        const messageObject = {
            name: decodedToken.name,
            userId: decodedToken.userId,
            imageURL: image.value,
            message: message.value,
            groupId: groupId
        }
        socket.emit('send-message', messageObject);
        const res = await axios.post('http://localhost:3000/sendMessage', messageObject, {headers: {'Authorization': token}});
        message.value='';
    }
    catch(err){
        console.log(err);
        message.value='';
    }
}

async function getMessages(e){
    e.preventDefault();
    try{
        const group = e.target.parentElement.firstChild.textContent;
    console.log(groupData);
    active = group;
    activeGroup.innerHTML = `${group}`;
    for(let i=0;i<groupData.length;i++){
        if(groupData[i].groupName === active){
            groupId = groupData[i].id;
        }
    }
    console.log(groupId);
    updateMessage.innerHTML='';
    const usersOfGroups = await axios.get(`http://localhost:3000/getUsersOfGroup/?groupId=${groupId}`);
    console.log(usersOfGroups.data.users);

    activeGroupData.innerHTML='';
    const h6 = document.createElement('h2');
    h6.innerHTML = `${active}`;
    activeGroupData.appendChild(h6);

    for(let i=0;i<usersOfGroups.data.users.length;i++){
        activeGroupUsers.push(usersOfGroups.data.users[i])
        showActiveGroupOnScreen(usersOfGroups.data.users[i]);
    }
        // const messagesFromLS = JSON.parse(localStorage.getItem("allMessages"));
        // console.log(messagesFromLS);
        // if(messagesFromLS === null || messagesFromLS.length === 0){
        //     lastMsgId = -1;
        // }
        // else{
        //     lastMsgId = messagesFromLS[messagesFromLS.length-1].id;
        // }
        const res = await axios.get(`http://localhost:3000/getMessages/?group=${groupId}`);
        // if(messagesFromLS!=null){
        //     for(let i=0;i<messagesFromLS.length;i++){
        //         allMessages.push(messagesFromLS[i]);
        //     }
        // }
        for(let i=0;i<res.data.length;i++)
        {
            allMessages.push(res.data[i]);
            //showMessagesOnScreen(res.data[i]);
        }
        
        // let allMessagesString = JSON.stringify(allMessages);
        // localStorage.setItem('allMessages', allMessagesString);
        // for(let i=0;i<allMessages.length;i++){
        //     showMessagesOnScreen(allMessages[i]);
        // }
    //location.reload();
    }
    catch(err){
        console.log(err.response.data.message);
    }
    
}

async function createGroup(e){
    e.preventDefault();
    try{
        const token = localStorage.getItem("token");
        //console.log(groupUsers);
        const data ={
            groupName: groupName.value,
            groupUsers: groupUsers
        }
        //console.log(data);
        const res = await axios.post('http://localhost:3000/createGroup', data, {headers: {'Authorization': token}});
        groupName.value = '';
        const checkboxes = document.querySelectorAll('checkbox');
        for(let i=0;i<checkboxes.length;i++){
            checkboxes[i].checked = false;
        }
        //console.log(res.data);
        //showGroupsOnScreen(res.data);
    }
    catch(err){
        alert(err.response.data.message);
    }
}

async function updateUsersInGroup(e){
    e.preventDefault();
    try{
        if(e.target.classList.contains('delete')){
            const user = e.target.parentElement.firstChild.textContent;
            console.log(user);
            for(let i=0;i<activeGroupUsers.length;i++){
                if(activeGroupUsers[i].firstName === user){
                    let userId = activeGroupUsers[i].id;
                    const res = await axios.delete(`http://localhost:3000/removeUserFromGroup/${userId}`);
                    console.log(res);
                }
            }
        }
        if(e.target.classList.contains('edit')){
            const user = e.target.parentElement.firstChild.textContent;
            console.log(user);
            for(let i=0;i<groupData.length;i++){
                if(groupData[i].groupName === active){
                    groupId = groupData[i].id;
                }
            }
            console.log(groupId);
            console.log(active);
            for(let i=0;i<activeGroupUsers.length;i++){
                if(activeGroupUsers[i].firstName === user){
                    let userId = activeGroupUsers[i].id;
                    const res = await axios.post(`http://localhost:3000/makeUserAdmin/?userId=${userId}&groupId=${groupId}`);
                    console.log(res);
                }
            }
        }
    }
    catch(err){
        console.log(err.response.data.message);
    }
}

function showActiveGroupOnScreen(data){
    // console.log(data);
    // console.log(groupData);
    for(let i=0;i<groupData.length;i++){
        if(groupData[i].usergroup.isAdmin === true){
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(`${data.firstName}`));

            const btn = document.createElement('button');
            btn.className = 'btn btn-primary float-end edit';
            btn.appendChild(document.createTextNode('Make Admin'));

            const btn1 = document.createElement('button');
            btn1.className = 'btn btn-primary float-end delete';
            btn1.appendChild(document.createTextNode('X'));

            li.appendChild(btn);
            li.appendChild(btn1);
            activeGroupData.appendChild(li);
        }
        else{
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(`${data.firstName}`));

            activeGroupData.appendChild(li);
        }
    }
    
}

function addUsers(e){
    const li = e.target.parentElement;
    const userToBeAdded = li.firstChild.textContent;
    //console.log(userToBeAdded);
    for(let i=0;i<userData.length;i++){
        if(userData[i].firstName === userToBeAdded){
            groupUsers.push(userData[i].id);
        }
    }
}

function showGroupsOnScreen(data){
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.appendChild(document.createTextNode(`${data.groupName}`));

    li.appendChild(btn);

    updateGroups.appendChild(li);
}

function showUsersOnScreen(data){
    const li = document.createElement('li');
    li.appendChild(document.createTextNode(`${data.firstName}`));
    const checkbox = document.createElement('input');
    checkbox.setAttribute("type", "checkbox");
    li.appendChild(checkbox);
    showUsers.appendChild(li);
}

function showMessagesOnScreen(data){
    const token = localStorage.getItem('token');
    const decodedToken = parseJwt(token);
    if(decodedToken.userId === data.userId){
        const mainDiv = document.createElement('div');
        mainDiv.className = 'msg right-msg';
        const divBubble = document.createElement('div');
        divBubble.className = 'msg-bubble';
        const divName = document.createElement('div');
        divName.className = 'msg-info-name';
        const divText = document.createElement('div');
        divText.className = 'msg-text';
        // var img = document.createElement("img");
        // img.src = data;
        // img.width = 320;
        // img.height = 250;
        
        divName.innerHTML = data.name;
        divText.innerHTML = data.message;

        divBubble.appendChild(divName);
        divBubble.appendChild(divText);

        mainDiv.appendChild(divBubble);

        updateMessage.appendChild(mainDiv);
    }
    else{
        const mainDiv = document.createElement('div');
        mainDiv.className = 'msg left-msg';
        const divBubble = document.createElement('div');
        divBubble.className = 'msg-bubble';
        const divName = document.createElement('div');
        divName.className = 'msg-info-name';
        const divText = document.createElement('div');
        divText.className = 'msg-text';
        divName.innerHTML = data.firstName;
        divText.innerHTML = data.message;

        divBubble.appendChild(divName);
        divBubble.appendChild(divText);

        mainDiv.appendChild(divBubble);

        updateMessage.appendChild(mainDiv);
    }
}

function logOut(e){
    e.preventDefault();
    location.replace('../login/login.html');
}


