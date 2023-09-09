const message = document.getElementById('message');
const sendMessageForm = document.getElementById('sendMessage');
const printMessages = document.getElementById('printMessages');
const message_text = document.getElementById('message-text');
const message_info_name = document.getElementById('message_info_name');
const updateMessage = document.getElementById('updateMessage');

sendMessageForm.addEventListener('submit', sendMessage);

function refresh(){
    window.location.reload();
}

//window.setInterval(refresh, 1000);

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
        const res = await axios.get('http://localhost:3000/');
        //console.log(res.data[0].user.id);
        for(let i=0;i<res.data.length;i++)
        {
            showMessagesOnScreen(res.data[i]);
        }
    }
    catch(err){
        alert(err.response.data.message);
    }
})

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
        const messageObject = {
            message: message.value
        }
        const res = await axios.post('http://localhost:3000/sendMessage', messageObject, {headers: {'Authorization': token}});
        console.log(res);
        //alert(res.data.message);
        message.value='';
        
    }
    catch(err){
        console.log(err);
        //alert(err.response.data.message);
        message.value='';
    }
}

