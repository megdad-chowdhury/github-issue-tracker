
const loginForm = document.getElementById("login-form");
const errorMessage = document.getElementById("error-message");
const userNameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("toggle-password");
const eyeIcon = document.getElementById("eye-icon");
const loginButton = document.getElementById("login-btn");


togglePassword.addEventListener('click', function(){
    if(passwordInput.type === "password"){
        passwordInput.type = "text";
        eyeIcon.classList.remove('fa-eye-slash');
        eyeIcon.classList.add('fa-eye');
    }
    else{
        passwordInput.type = 'password';
        eyeIcon.classList.remove('fa-eye');
        eyeIcon.classList.add('fa-eye-slash');
    }
});


loginForm.addEventListener('submit', function(event){
    event.preventDefault();
    const username = userNameInput.value;
    const password = passwordInput.value;

    if(username === "admin" && password === "admin123"){
        errorMessage.innerText = "";
        errorMessage.classList.add("hidden");
        window.location.href = "dashboard.html";
    }
    else{
        errorMessage.innerText = "Invalid Username or Password";
        errorMessage.classList.remove("hidden");
    }
});