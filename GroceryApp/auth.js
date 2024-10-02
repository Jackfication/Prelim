// Show Register Form
document.getElementById('showRegisterForm').addEventListener('click', function() {
    document.getElementById('loginFormContainer').classList.add('hidden');
    document.getElementById('registerFormContainer').classList.remove('hidden');
});

// Show Login Form
document.getElementById('showLoginForm').addEventListener('click', function() {
    document.getElementById('registerFormContainer').classList.add('hidden');
    document.getElementById('loginFormContainer').classList.remove('hidden');
});

// Handle registration
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;

    if (localStorage.getItem(email)) {
        alert('Email already registered. Please choose another.');
    } else {
        const user = { email, password };
        localStorage.setItem(email, JSON.stringify(user));
        alert('Registration successful! You can now log in.');
        document.getElementById('showLoginForm').click(); // Switch to login form
    }
});

// Handle login
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const user = JSON.parse(localStorage.getItem(email));

    if (user && user.password === password) {
        alert('Login successful!');
        localStorage.setItem('currentUser', email); // Store the current user
        window.location.href = 'dashboard.html'; // Redirect to dashboard.html
    } else {
        alert('Invalid email or password.');
    }
});
