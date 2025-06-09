const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname, 'users.txt');



// Función para registrar un nuevo usuario
function registerUser(username, password, email) {
  // 1. Verificar si el usuario ya existe
  if (userExists(username)) {
    return 'El usuario ya existe.';
  }

  // 2. Crear la línea con la información del usuario
  const userData = `${username},${password},${email}\n`;

  // 3. Escribir la información en el archivo users.txt
  fs.appendFile(usersFilePath, userData, (err) => {
    if (err) {
      console.error('Error al escribir en el archivo users.txt:', err);
      return 'Error al registrar el usuario.';
    }
    console.log('Usuario registrado exitosamente.');
    return 'Usuario registrado exitosamente.';
  });
}

// Función para verificar si un usuario ya existe
function userExists(username) {
  try {
    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = usersData.split('\n');
    for (const user of users) {
      const userData = user.split(',');
      if (userData[0] === username) {
        return true;
      }
    }
    return false;
  } catch (err) {
    console.error('Error al leer el archivo users.txt:', err);
    return false;
  }
}

// Función para iniciar sesión
function loginUser(email, password) {
    try {
      const usersData = fs.readFileSync(usersFilePath, 'utf8');
      const users = usersData.split('\n');
      for (const user of users) {
        const userData = user.split(',');
        if (userData[2] === email && userData[1] === password) {
          return true; // Inicio de sesión exitoso
        }
      }
      return false; // Usuario no encontrado o contraseña incorrecta
    } catch (err) {
      console.error('Error al leer el archivo users.txt:', err);
      return false;
    }
  }

module.exports = {
  registerUser,
  loginUser
};