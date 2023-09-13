const signUpForm = document.getElementById('signUpForm');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const email = document.getElementById('email');
const phNumber = document.getElementById('phNumber');
const pass = document.getElementById('pass');

signUpForm.addEventListener('submit', createUser);

async function createUser(e)
{
    e.preventDefault();
    let user = {
        firstName: firstName.value,
        lastName: lastName.value,
        email: email.value,
        phNumber: phNumber.value,
        password: pass.value
    }
    try{
        const res = await axios.post('http://localhost:3000/signup', user);
        alert(res.data.message);
        console.log(res);
        firstName.value='';
        lastName.value='';
        email.value='';
        phNumber.value='';
        pass.value='';
        window.location.replace('../login/login.html');
    }
    catch(err){
        alert(err.response.data.message);
        firstName.value='';
        lastName.value='';
        email.value='';
        phNumber.value='';
        pass.value='';
    }
}
