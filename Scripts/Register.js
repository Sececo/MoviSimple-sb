// ===============================
// USER VALIDATION AND REGISTRATION
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  // --- Field references ---
  const form = document.getElementById('registerForm');
  const nombreInput = document.getElementById('nombre');
  const emailInput = document.getElementById('new-email');
  const passwordInput = document.getElementById('new-password');
  const confirmInput = document.getElementById('confirm-password');
  const errorNombre = document.getElementById('error-nombre');
  const errorEmail = document.getElementById('error-email');
  const errorPassword = document.getElementById('error-password');
  const errorConfirm = document.getElementById('error-confirm');
  const strengthBar = document.getElementById('strengthBar');
  const strengthText = document.getElementById('password-strength-text');

  // --- Real-time validations ---
  nombreInput.addEventListener('input', validateName);
  emailInput.addEventListener('input', validateEmail);
  passwordInput.addEventListener('input', () => {
    validatePassword();
    const score = passwordStrength(passwordInput.value);
    updateStrengthBar(score);
    showStrengthText(score, passwordInput.value);
  });
  confirmInput.addEventListener('input', validateConfirm);

  // --- Name validation ---
  function validateName() {
    const name = nombreInput.value.trim();
    if (!name) {
      errorNombre.textContent = 'Full name is required.';
      return false;
    }
    if (/\d/.test(name)) {
      errorNombre.textContent = 'Numbers are not allowed in the name.';
      return false;
    }
    if (/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/.test(name)) {
      errorNombre.textContent = 'Symbols are not allowed in the name.';
      return false;
    }
    // At least two words, each starting with uppercase
    const nameRegex = /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?:\s[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+$/;
    if (!nameRegex.test(name)) {
      errorNombre.textContent = 'Start with uppercase and only letters (Ej: Edwin Molina)';
      return false;
    }
    errorNombre.textContent = '';
    return true;
  }

  // --- Email validation ---
  function validateEmail() {
    const email = emailInput.value.trim().toLowerCase();
    const validDomains = ['@gmail.com', '@hotmail.com', '@unicatolica.edu.co'];
    if (!email) {
      errorEmail.textContent = 'Email is required.';
      return false;
    }
    if (!email.includes('@')) {
      errorEmail.textContent = 'Email must contain @';
      return false;
    }
    if (!validDomains.some(d => email.endsWith(d))) {
      errorEmail.textContent = 'Only @gmail.com, @hotmail.com or institutional emails allowed.';
      return false;
    }
    errorEmail.textContent = '';
    return true;
  }

  // --- Password validation ---
  function validatePassword() {
    const password = passwordInput.value;
    if (!password) {
      errorPassword.textContent = 'Password is required.';
      return false;
    }
    if (password.length < 8) {
      errorPassword.textContent = 'Minimum 8 characters.';
      return false;
    }
    if (!/[A-Z]/.test(password)) {
      errorPassword.textContent = 'At least one uppercase letter required.';
      return false;
    }
    if (!/[a-z]/.test(password)) {
      errorPassword.textContent = 'At least one lowercase letter required.';
      return false;
    }
    if (!/[0-9]/.test(password)) {
      errorPassword.textContent = 'At least one number required.';
      return false;
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
      errorPassword.textContent = 'At least one symbol required.';
      return false;
    }
    errorPassword.textContent = '';
    return true;
  }

  // --- Confirm password validation ---
  function validateConfirm() {
    if (!confirmInput.value) {
      errorConfirm.textContent = 'Please confirm your password.';
      return false;
    }
    if (confirmInput.value !== passwordInput.value) {
      errorConfirm.textContent = 'Passwords do not match.';
      return false;
    }
    errorConfirm.textContent = '';
    return true;
  }

  // --- Password strength meter ---
  function passwordStrength(password) {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;
    return score;
  }
  function updateStrengthBar(score) {
    const colors = ['#ccc', '#e63946', 'orange', 'gold', 'yellowgreen', 'green'];
    strengthBar.style.width = (score * 20) + '%';
    strengthBar.style.backgroundColor = colors[score] || '#ccc';
  }
  function showStrengthText(score, password) {
    if (!password) {
      strengthText.textContent = '';
      return;
    }
    if (score <= 2) {
      strengthText.textContent = 'Weak password';
      strengthText.style.color = '#e63946';
    } else if (score === 3 || score === 4) {
      strengthText.textContent = 'Acceptable password';
      strengthText.style.color = 'orange';
    } else if (score >= 5) {
      strengthText.textContent = 'Strong password';
      strengthText.style.color = 'green';
    }
  }

  // --- Final validation on submit ---
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    const nameOk = validateName();
    const emailOk = validateEmail();
    const passOk = validatePassword();
    const confirmOk = validateConfirm();

    if (!nameOk || !emailOk || !passOk || !confirmOk) return;

    // --- Registro solo con backend ---
    fetch('http://localhost:3000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: nombreInput.value.trim(),
        email: emailInput.value.trim().toLowerCase(),
        password: passwordInput.value
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.ok) {
        // Mostrar modal de éxito
        document.getElementById('success-modal').style.display = 'flex';
        // Esperar 3 segundos y redirigir
        setTimeout(() => {
          window.location.href = "login.html";
        }, 3000);
      } else {
        errorEmail.textContent = data.msg;
      }
    });
  });
});