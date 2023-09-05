const message = document.getElementById('message');
const sendMessageForm = document.getElementById('sendMessage');

sendMessageForm.addEventListener('submit', sendMessage);

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// window.addEventListener('DOMContentLoaded', async() => {
//     try{

//         //const res = await axios.get('http://localhost:3000/');
//     }
//     catch(err){
//         alert(err.response.data.message);
//     }
// })

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

