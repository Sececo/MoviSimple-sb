const requestTripForm = document.getElementById('requestTripForm');
const tripMessage = document.getElementById('tripMessage');
const animationContainer = document.getElementById('animationContainer');
const movil = document.getElementById('movil');
const costMessage = document.getElementById('costMessage');
const nodes = document.querySelectorAll('.node');
const startNodeInput = document.getElementById('startNode');
const endNodeInput = document.getElementById('endNode');
const mapContainer = document.getElementById('mapContainer');

let startNode = null;
let endNode = null;

nodes.forEach(node => {
  node.addEventListener('click', () => {
    if (!startNode) {
      startNode = node;
      startNodeInput.value = node.textContent;
      startNode.classList.add('selected');
    } else if (!endNode) {
      endNode = node;
      endNodeInput.value = node.textContent;
      endNode.classList.add('selected');
    }
  });
});

requestTripForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const startNodeValue = requestTripForm.startNode.value;
  const endNodeValue = requestTripForm.endNode.value;

  const response = await fetch('http://localhost:3000/request-trip', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ startNode: startNodeValue, endNode: endNodeValue })
  });

  const data = await response.json();

  if (response.ok) {
    tripMessage.textContent = `Distancia: ${data.distance}, Ruta: ${data.path.join(' -> ')}`;
    tripMessage.style.color = 'green';

    // Calculate cost
    const cost = data.distance; // Cost is equal to the distance
    costMessage.textContent = `Costo del viaje: $${cost}`;

    // Animate the movil
    animateMovil(data.path, data.distance);

    // Draw the route
    drawRoute(data.path);
  } else {
    tripMessage.textContent = data;
    tripMessage.style.color = 'red';
  }
});

function animateMovil(path, distance) {
  let currentPosition = 0;
  const animationDuration = distance * 1000; // milliseconds (1 second per unit of distance)
  const containerWidth = animationContainer.offsetWidth;
  const nodes = path.length;
  const step = containerWidth / nodes;
  const startTime = performance.now();

  function animate(currentTime) {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / animationDuration, 1); // Ensure progress doesn't exceed 1

    const x = progress * containerWidth;
    movil.style.left = `${x}px`;

    if (progress < 1) {
      requestAnimationFrame(animate);
    } else {
      // Animation complete
      costMessage.textContent = `Costo del viaje: $${distance}. Tiempo total: ${distance} segundos.`;
      // Reset origin and destination
      requestTripForm.startNode.value = '';
      requestTripForm.endNode.value = '';

      // Remove selected class from nodes
      if (startNode) {
        startNode.classList.remove('selected');
      }
      if (endNode) {
        endNode.classList.remove('selected');
      }

      startNode = null;
      endNode = null;

      // Hide animation
      movil.style.left = '0';

      // Clear the route
      clearRoute();
    }
  }

  requestAnimationFrame(animate);
}

function drawRoute(path) {
  for (let i = 0; i < path.length - 1; i++) {
    const startNodeId = `node${path[i]}`;
    const endNodeId = `node${path[i + 1]}`;
    const startNodeElement = document.getElementById(startNodeId);
    const endNodeElement = document.getElementById(endNodeId);

    const startNodeRect = startNodeElement.getBoundingClientRect();
    const endNodeRect = endNodeElement.getBoundingClientRect();

    const x1 = startNodeRect.left + startNodeRect.width / 2;
    const y1 = startNodeRect.top + startNodeRect.height / 2;
    const x2 = endNodeRect.left + endNodeRect.width / 2;
    const y2 = endNodeRect.top + endNodeRect.height / 2;

    const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

    const line = document.createElement('div');
    line.className = 'route-line';
    line.style.width = `${length}px`;
    line.style.transform = `rotate(${angle}deg)`;
    line.style.position = 'absolute';
    line.style.top = `${y1 - mapContainer.getBoundingClientRect().top}px`;
    line.style.left = `${x1 - mapContainer.getBoundingClientRect().left}px`;
    line.style.backgroundColor = 'red';
    line.style.height = '2px';
    line.style.transformOrigin = '0 0';

    mapContainer.appendChild(line);
  }
}

function clearRoute() {
  const routeLines = document.querySelectorAll('.route-line');
  routeLines.forEach(line => line.remove());
}