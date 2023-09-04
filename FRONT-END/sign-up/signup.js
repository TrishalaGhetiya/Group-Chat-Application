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
        if(res.status === 200){
            alert('Successfully signed up');
        }
        if(res.status === 403){
            alert('User already exists');
        }
        console.log(res);
        firstName.value='';
        lastName.value='';
        email.value='';
        phNumber.value='';
        pass.value='';
        window.location.replace('../login/login.html');
    }
    catch(err){
        console.log(err);
        firstName.value='';
        lastName.value='';
        email.value='';
        phNumber.value='';
        pass.value='';
    }
}
