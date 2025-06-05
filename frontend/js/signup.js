const signupForm = document.getElementById('signupForm');
const loginForm = document.getElementById('loginForm');

// Signup handler
signupForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    name: document.getElementById('signup-name').value,
    email: document.getElementById('signup-email').value,
    password: document.getElementById('signup-password').value
  };

  fetch('http://localhost:3000/api/signup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.json();
    })
    .then(data => {
      alert(data.message);
      signupForm.reset();
    })
    .catch(error => {
      console.error('Error signing up:', error);
      alert('An error occurred. Please try again later.');
    });
});

// Login handler
loginForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const data = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  };

  fetch('http://localhost:3000/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.message === 'Login successful') {
        alert(data.message);
        window.location.href = 'reservations.html';
      } else {
        alert(data.message);
      }
    })
    .catch(error => {
      console.error('Error logging in:', error);
      alert('An error occurred. Please try again later.');
    });
});