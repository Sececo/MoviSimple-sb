const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = loginForm.username.value;
  const password = loginForm.password.value;

  const response = await fetch('http://localhost:3000/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password })
  });

  const data = await response.text();

  if (response.ok) {
    loginMessage.textContent = data;
    loginMessage.style.color = 'green';
  } else {
    loginMessage.textContent = data;
    loginMessage.style.color = 'red';
  }
});