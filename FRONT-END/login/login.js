const loginForm = document.getElementById('loginForm');
const email = document.getElementById('email');
const pass = document.getElementById('pass');
const register = document.getElementById('register');
const forgotPassword = document.getElementById('forgotPassword');

loginForm.addEventListener('submit', loginUser);
forgotPassword.addEventListener('click', getForgotPasswordPage);
register.addEventListener('click', signupUser);

function getForgotPasswordPage(e){
    e.preventDefault();
    window.location.replace('../forgotPassword/forgotPassword.html');
}

function signupUser(e){
    e.preventDefault();
    window.location.replace('../signUp/signup.html');
}

async function loginUser(e){
    e.preventDefault();
    let user = {
        email: email.value,
        pass: pass.value
    }
    try{
        const res = await axios.post('http://localhost:3000/login', user);
        alert(res.data.message);
        localStorage.setItem('token', res.data.token);
        email.value='';
        pass.value='';
        //window.location.replace('../expense/expense.html');
    }
    catch(err){
        alert(err.response.data.message);
        email.value='';
        pass.value='';
    }

}