document.getElementById('submit-register').addEventListener('click', register(event));
document.getElementById('submit-login').addEventListener('click', login(event));

async function register(event){
    event.preventDefault();
    form = document.getElementById('register-form');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;

    const reg_request = await fetch('/user/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })

    if(!reg_request.ok) {
        const error = await request.json();
        console.error('Register Error:', error);
        alert(error.error);
        return;
    }
    
    setTimeout(() => {
        alert('User logged in successfully. Redirecting to books page...');
        window.location.href = '/books';
    }, 1000);
   
}

async function login(event){
    event.preventDefault();
    form = document.getElementById('login-form');
    console.log('Login form submitted');
    const username = form.elements['username'].value;
    const password = form.elements['password'].value;
    console.log('Username:', username, 'Password:', password);
}