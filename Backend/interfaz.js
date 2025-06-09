const requestTripForm = document.getElementById('requestTripForm');
const tripMessage = document.getElementById('tripMessage');
const costMessage = document.getElementById('costMessage');
const movil = document.getElementById('movil');
const startNodeInput = document.getElementById('startNode');
const endNodeInput = document.getElementById('endNode');
const mapContainer = document.getElementById('mapContainer');
const nodes = document.querySelectorAll('.node');

let startNode = null;
let endNode = null;

const edges = [
  ['A', 'C'],
  ['A', 'D'],
  ['B', 'D'],
  ['B', 'E'],
  ['C', 'D'],
  ['D', 'F'],
  ['E', 'F']
];

function drawStaticEdges() {
  const drawnEdges = new Set();

  for (const from in graph) {
    graph[from].forEach(({ node: to, cost }) => {
      const key = [from, to].sort().join('-');
      if (drawnEdges.has(key)) return;
      drawnEdges.add(key);

      const fromNode = document.getElementById(`node${from}`);
      const toNode = document.getElementById(`node${to}`);

      const x1 = fromNode.offsetLeft + fromNode.offsetWidth / 2;
      const y1 = fromNode.offsetTop + fromNode.offsetHeight / 2;
      const x2 = toNode.offsetLeft + toNode.offsetWidth / 2;
      const y2 = toNode.offsetTop + toNode.offsetHeight / 2;

      const length = Math.hypot(x2 - x1, y2 - y1);
      const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);

      // Línea
      const edge = document.createElement('div');
      edge.classList.add('edge');
      edge.style.width = `${length}px`;
      edge.style.left = `${x1}px`;
      edge.style.top = `${y1}px`;
      edge.style.transform = `rotate(${angle}deg)`;
      edge.style.transformOrigin = '0 0';
      document.getElementById('mapContainer').appendChild(edge);

      // Etiqueta de peso
      const label = document.createElement('div');
      label.classList.add('edge-label');
      label.textContent = cost;
      label.style.left = `${(x1 + x2) / 2}px`;
      label.style.top = `${(y1 + y2) / 2}px`;
      document.getElementById('mapContainer').appendChild(label);
    });
  }
}

// Ruta simulada
const graph = {
  A: [{ node: 'C', cost: 2 }, { node: 'D', cost: 1 }],
  B: [{ node: 'D', cost: 2 }, { node: 'E', cost: 1 }],
  C: [{ node: 'A', cost: 2 }, { node: 'D', cost: 3 }],
  D: [{ node: 'A', cost: 1 }, { node: 'B', cost: 2 }, { node: 'C', cost: 3 }, { node: 'F', cost: 1 }],
  E: [{ node: 'B', cost: 1 }, { node: 'F', cost: 2 }],
  F: [{ node: 'D', cost: 1 }, { node: 'E', cost: 2 }]
};

drawStaticEdges();

// Selección de nodos
nodes.forEach(node => {
  node.addEventListener('click', () => {
    if (!startNode) {
      startNode = node;
      startNodeInput.value = node.textContent;
      startNode.classList.add('selected');

      // Posicionar el movil sobre el nodo inicial
      const rect = node.getBoundingClientRect();
      const containerRect = mapContainer.getBoundingClientRect();
      movil.style.left = `${rect.left - containerRect.left + rect.width / 2 - 10}px`;
      movil.style.top = `${rect.top - containerRect.top + rect.height / 2 - 10}px`;
    } else if (!endNode) {
      endNode = node;
      endNodeInput.value = node.textContent;
      endNode.classList.add('selected');
    }
  });
});

function dijkstra(start, end) {
  const distances = {};
  const previous = {};
  const queue = [];

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[start] = 0;
  queue.push({ node: start, cost: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost); // ordenamos por menor costo
    const { node: current } = queue.shift();

    if (current === end) break;

    for (const neighbor of graph[current]) {
      const alt = distances[current] + neighbor.cost;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
        queue.push({ node: neighbor.node, cost: alt });
      }
    }
  }

  // reconstruir ruta
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, cost: distances[end] };
}

// Enviar formulario
requestTripForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const start = startNodeInput.value;
  const end = endNodeInput.value;

  if (!graph[start] || !graph[end]) {
    tripMessage.textContent = `Nodo inválido.`;
    tripMessage.style.color = 'red';
    return;
  }

  const { path, cost } = dijkstra(start, end);

  if (!path || path.length < 2 || cost === Infinity) {
    tripMessage.textContent = `No hay ruta disponible de ${start} a ${end}`;
    tripMessage.style.color = 'red';
    return;
  }

  // Elimina cualquier color anterior
  document.querySelectorAll('.node').forEach(n => {
    n.classList.remove('node-start', 'node-end');
  });

  // Aplica color al nodo de inicio y fin
  const startNode = document.getElementById(`node${start}`);
  const endNode = document.getElementById(`node${end}`);

  if (startNode) startNode.classList.add('node-start');
  if (endNode) endNode.classList.add('node-end');

  tripMessage.textContent = `Ruta: ${path.join(' -> ')}`;
  tripMessage.style.color = 'green';
  costMessage.textContent = `Costo total: $${cost}`;

  drawRoute(path);
  animateMovil(path, cost);
});


// Animar movil
function animateMovil(path, distance) {
  const positions = path.map(id => {
    const node = document.getElementById(`node${id}`);
    const rect = node.getBoundingClientRect();
    const containerRect = mapContainer.getBoundingClientRect();
    return {
      x: rect.left - containerRect.left + rect.width / 2 - 10,
      y: rect.top - containerRect.top + rect.height / 2 - 10
    };
  });

  let i = 0;
  function moveToNext() {
    if (i >= positions.length - 1) {
      costMessage.textContent += `. Tiempo total: ${distance}s`;
      setTimeout(resetUI, 1000); // espera 1 segundo antes de resetear
      return;
    }


    const start = positions[i];
    const end = positions[i + 1];
    const duration = 1000;
    const startTime = performance.now();

    function animateStep(currentTime) {
      const elapsed = currentTime - startTime;
      const t = Math.min(elapsed / duration, 1);
      movil.style.left = `${start.x + (end.x - start.x) * t}px`;
      movil.style.top = `${start.y + (end.y - start.y) * t}px`;

      if (t < 1) {
        requestAnimationFrame(animateStep);
      } else {
        i++;
        moveToNext();
      }
    }

    requestAnimationFrame(animateStep);
  }

  moveToNext();
}

function dijkstra(start, end) {
  const distances = {};
  const previous = {};
  const queue = [];

  for (const node in graph) {
    distances[node] = Infinity;
    previous[node] = null;
  }

  distances[start] = 0;
  queue.push({ node: start, cost: 0 });

  while (queue.length > 0) {
    queue.sort((a, b) => a.cost - b.cost); // ordenamos por menor costo
    const { node: current } = queue.shift();

    if (current === end) break;

    for (const neighbor of graph[current]) {
      const alt = distances[current] + neighbor.cost;
      if (alt < distances[neighbor.node]) {
        distances[neighbor.node] = alt;
        previous[neighbor.node] = current;
        queue.push({ node: neighbor.node, cost: alt });
      }
    }
  }

  // reconstruir ruta
  const path = [];
  let current = end;
  while (current) {
    path.unshift(current);
    current = previous[current];
  }

  return { path, cost: distances[end] };
}


// Dibujar ruta
function drawRoute(path) {
  document.querySelectorAll('.route-line').forEach(line => line.remove());

  for (let i = 0; i < path.length - 1; i++) {
    const start = document.getElementById(`node${path[i]}`);
    const end = document.getElementById(`node${path[i + 1]}`);
    const rect1 = start.getBoundingClientRect();
    const rect2 = end.getBoundingClientRect();
    const container = mapContainer.getBoundingClientRect();

    const x1 = rect1.left + rect1.width / 2 - container.left;
    const y1 = rect1.top + rect1.height / 2 - container.top;
    const x2 = rect2.left + rect2.width / 2 - container.left;
    const y2 = rect2.top + rect2.height / 2 - container.top;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const line = document.createElement('div');
    line.className = 'route-line';
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.top = `${y1}px`;
    line.style.left = `${x1}px`;

    mapContainer.appendChild(line);
  }
}

function resetUI() {
  // Quitar selección
  if (startNode) startNode.classList.remove('selected');
  if (endNode) endNode.classList.remove('selected');
  startNode = null;
  endNode = null;

  // Limpiar inputs
  startNodeInput.value = '';
  endNodeInput.value = '';

  // Eliminar líneas de ruta
  document.querySelectorAll('.route-line').forEach(line => line.remove());

  // Reiniciar posición del móvil
  movil.style.left = '-9999px';
  movil.style.top = '-9999px';

  document.querySelectorAll('.node').forEach(n => {
  n.classList.remove('node-start', 'node-end');
  });
}

window.addEventListener('DOMContentLoaded', () => {
  drawStaticEdges();
});