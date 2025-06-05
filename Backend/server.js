// --- Servidor básico para registro y login con users.txt ---

const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const USERS_FILE = path.join(__dirname, 'users.txt');

app.use(cors());
app.use(bodyParser.json());

// --- Registrar usuario ---
app.post('/register', (req, res) => {
  const { nombre, email, password } = req.body;
  if (!nombre || !email || !password) {
    return res.status(400).json({ ok: false, msg: 'Todos los campos son obligatorios.' });
  }
  // Leer usuarios existentes
  let users = [];
  if (fs.existsSync(USERS_FILE)) {
    const data = fs.readFileSync(USERS_FILE, 'utf8');
    users = data.split('\n').filter(Boolean).map(line => JSON.parse(line));
  }
  // Verificar si el correo ya existe
  if (users.some(u => u.email === email)) {
    return res.status(409).json({ ok: false, msg: 'El correo ya está registrado.' });
  }
  // Guardar usuario
  const user = { nombre, email, password };
  fs.appendFileSync(USERS_FILE, JSON.stringify(user) + '\n');
  res.json({ ok: true, msg: 'Usuario registrado correctamente.' });
});

// --- Login usuario ---
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ ok: false, msg: 'Completa todos los campos.' });
  }
  if (!fs.existsSync(USERS_FILE)) {
    return res.status(401).json({ ok: false, msg: 'Usuario o contraseña incorrectos.' });
  }
  const data = fs.readFileSync(USERS_FILE, 'utf8');
  const users = data.split('\n').filter(Boolean).map(line => JSON.parse(line));
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) {
    return res.status(401).json({ ok: false, msg: 'Usuario o contraseña incorrectos.' });
  }
  res.json({ ok: true, msg: 'Login exitoso.' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});