const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./auth'); // Importa el módulo auth.js
const Graph = require('./graph'); // Importa el módulo graph.js

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// Ruta para el registro de usuarios
app.post('/register', (req, res) => {
  const { username, password, email } = req.body;
  const result = auth.registerUser(username, password, email);
  if (result === 'Usuario registrado exitosamente.') {
    res.status(201).send(result);
  } else {
    res.status(400).send(result);
  }
});

// Ruta para el inicio de sesión
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const result = auth.loginUser(email, password);
  if (result) {
    res.status(200).send('Inicio de sesión exitoso.');
  } else {
    res.status(401).send('Credenciales inválidas.');
  }
});

// Ruta para solicitar un viaje
app.post('/request-trip', (req, res) => {
  const { startNode, endNode } = req.body;

  // Create a graph
  const graph = new Graph();
  graph.addNode('A');
  graph.addNode('B');
  graph.addNode('C');
  graph.addNode('D');
  graph.addNode('E');
  graph.addNode('F');

  graph.addEdge('A', 'B', 4);
  graph.addEdge('A', 'C', 2);
  graph.addEdge('B', 'F', 5);
  graph.addEdge('C', 'D', 1);
  graph.addEdge('D', 'E', 3);
  graph.addEdge('C', 'F', 2);
  graph.addEdge('B', 'E', 1);
  graph.addEdge('A', 'E', 6);
  graph.addEdge('D', 'F', 4);

  // Find the shortest path
  const { distance, path } = graph.dijkstra(startNode, endNode);

  if (distance === Infinity) {
    res.status(404).send('No se encontró una ruta entre los nodos especificados.');
  } else {
    res.status(200).json({ distance, path });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});