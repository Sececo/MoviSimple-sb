// ----------- Login (login.html) -----------
if (document.getElementById('loginForm')) {
  document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim().toLowerCase();
    const password = document.getElementById('password').value;
    const errorMsg = document.getElementById('error-msg');
    function mostrarError(msg) {
      errorMsg.textContent = msg;
      errorMsg.classList.add('visible');
    }
    function limpiarError() {
      errorMsg.textContent = '';
      errorMsg.classList.remove('visible');
    }

    limpiarError();

    // Validaciones
    if (!email || !password) {
      mostrarError("Por favor, completa todos los campos.");
      return;
    }

    const dominiosValidos = ['@gmail.com', '@hotmail.com', '@unicatolica.edu.co'];
    if (!email.includes('@') || !dominiosValidos.some(d => email.endsWith(d))) {
      mostrarError("El correo debe ser @gmail.com, @hotmail.com o institucional.");
      return;
    }

    // Login con el servidor
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput.value.trim().toLowerCase(),
        password: passwordInput.value
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = "interfaz.html";
      } else {
        errorMsg.textContent = data.msg;
      }
    });
  });
}

// ----------- Login con validación en tiempo real -----------

// Espera a que el DOM esté listo
document.addEventListener("DOMContentLoaded", () => {
  // --- Referencias a los campos y mensajes ---
  const form = document.getElementById('loginForm');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  const errorMsg = document.getElementById('error-msg');

  // --- Validación en tiempo real del correo ---
  emailInput.addEventListener('input', validarEmail);

  // --- Validación en tiempo real de la contraseña (solo requerido) ---
  passwordInput.addEventListener('input', () => {
    if (!passwordInput.value) {
      errorPassword.textContent = 'La contraseña es obligatoria.';
    } else {
      errorPassword.textContent = '';
    }
  });

  // --- Función para validar el correo electrónico ---
  function validarEmail() {
    const email = emailInput.value.trim().toLowerCase();
    const dominiosValidos = ['@gmail.com', '@hotmail.com', '@unicatolica.edu.co'];
    if (!email) {
      errorEmail.textContent = 'El correo es obligatorio.';
      return false;
    }
    if (!email.includes('@')) {
      errorEmail.textContent = 'El correo debe contener @';
      return false;
    }
    if (!dominiosValidos.some(d => email.endsWith(d))) {
      errorEmail.textContent = 'Solo se permiten correos @gmail.com, @hotmail.com o institucional.';
      return false;
    }
    errorEmail.textContent = '';
    return true;
  }

  // --- Validación y login al enviar el formulario ---
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    errorMsg.textContent = '';

    const emailOk = validarEmail();
    const passwordOk = !!passwordInput.value;

    if (!emailOk || !passwordOk) {
      if (!passwordOk) errorPassword.textContent = 'La contraseña es obligatoria.';
      return;
    }

    // --- Login solo con backend ---
    fetch('http://localhost:3000/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: emailInput.value.trim().toLowerCase(),
        password: passwordInput.value
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        window.location.href = "interfaz.html";
      } else {
        errorMsg.textContent = data.msg;
      }
    });
  });
});