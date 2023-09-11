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
let lastMsgId;
let active;
const groupData = [];
const groupUsers = [];
const userData = [];
const allMessages = [];

sendMessageForm.addEventListener('submit', sendMessage);
logout.addEventListener('click', logOut);
createNewGroup.addEventListener('submit', createGroup);
showUsers.addEventListener('click', addUsers);
updateGroups.addEventListener('click', getMessages);

async function getMessages(e){
    e.preventDefault();
    const group = e.target.parentElement.firstChild.textContent;
    console.log(group);
    active = group;
    activeGroup.innerHTML = `${group}`;
    for(let i=0;i<groupData.length;i++){
        if(groupData[i].groupName === active){
            groupId = groupData[i].id;
        }
    }
    updateMessage.innerHTML='';
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
            showMessagesOnScreen(res.data[i]);
        }
        
        // let allMessagesString = JSON.stringify(allMessages);
        // localStorage.setItem('allMessages', allMessagesString);
        // for(let i=0;i<allMessages.length;i++){
        //     showMessagesOnScreen(allMessages[i]);
        // }
    //location.reload();
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

function logOut(e){
    e.preventDefault();
    location.replace('../login/login.html');
}

async function createGroup(e){
    e.preventDefault();
    try{
        const data ={
            groupName: groupName.value,
            groupUsers: groupUsers
        }
        //console.log(data);
        const res = await axios.post('http://localhost:3000/createGroup', data);
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
        const users = await axios.get('http://localhost:3000/getUsers');
        for(let i=0;i<users.data.length;i++){
            userData.push(users.data[i]);
            showUsersOnScreen(users.data[i]);
        }
        const token = localStorage.getItem("token");
        const groups = await axios.get('http://localhost:3000/getGroups', {headers: {'Authorization': token}});
        for(let i=0;i<groups.data.groups.length;i++){
            groupData.push(groups.data.groups[i]);
            showGroupsOnScreen(groups.data.groups[i]);
        } 
    }
    catch(err){
        alert(err.response.data.message);
    }
})

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
    if(decodedToken.userId === data.user.id){
        const mainDiv = document.createElement('div');
        mainDiv.className = 'msg right-msg';
        const divBubble = document.createElement('div');
        divBubble.className = 'msg-bubble';
        const divName = document.createElement('div');
        divName.className = 'msg-info-name';
        const divText = document.createElement('div');
        divText.className = 'msg-text';
        divName.innerHTML = data.user.firstName;
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
        divName.innerHTML = data.user.firstName;
        divText.innerHTML = data.message;

        divBubble.appendChild(divName);
        divBubble.appendChild(divText);

        mainDiv.appendChild(divBubble);

        updateMessage.appendChild(mainDiv);
    }
}

async function sendMessage(e){
    try{
        e.preventDefault();
        const token = localStorage.getItem('token');
        for(let i=0;i<groupData.length;i++){
            if(groupData[i].groupName === active){
                groupId = groupData[i].id;
            }
        }
        const messageObject = {
            message: message.value,
            groupId: groupId
        }
        const res = await axios.post('http://localhost:3000/sendMessage', messageObject, {headers: {'Authorization': token}});
        message.value='';
        //window.location.reload();
    }
    catch(err){
        console.log(err);
        message.value='';
    }
}

