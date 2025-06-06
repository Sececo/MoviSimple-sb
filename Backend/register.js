const registerForm = document.getElementById('registerForm');
const registerMessage = document.getElementById('registerMessage');

registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = registerForm.username.value;
  const password = registerForm.password.value;
  const email = registerForm.email.value;

  const response = await fetch('http://localhost:3000/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ username, password, email })
  });

  const data = await response.text();

  if (response.ok) {
    registerMessage.textContent = data;
    registerMessage.style.color = 'green';
  } else {
    registerMessage.textContent = data;
    registerMessage.style.color = 'red';
  }
});