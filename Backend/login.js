const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = loginForm.email.value;
  const password = loginForm.password.value;

  const response = await fetch('http://localhost:3000/index', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await response.text();

  if (response.ok) {
    loginMessage.textContent = data;
    loginMessage.style.color = 'green';
    setTimeout(() => {
        window.location.href = 'interfaz.html';
    }, 1500);
  } else {
    loginMessage.textContent = data;
    loginMessage.style.color = 'red';
  }
});