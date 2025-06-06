document.addEventListener('DOMContentLoaded', function () {
  // 1. Definir el grafo (6 nodos, 9 aristas, pesos en segundos)
  // Formato: [u, v, w]
  const edges = [
  [0, 1, 6],
  [0, 2, 2],
  [0, 3, 8],
  [1, 4, 4],
  [1, 5, 2],
  [2, 3, 3],
  [2, 5, 4],
  [3, 4, 1],
  [4, 5, 2],
  [3, 6, 3],
  [4, 6, 1],
  [5, 6, 2]
];
  const N = 7;
  const tarifa = 0.5; // $0.50 por segundo

  // Construir matriz de adyacencia
  const graph = Array.from({length: N}, () => Array(N).fill(Infinity));
  edges.forEach(([u, v, w]) => {
    graph[u][v] = w;
    graph[v][u] = w;
  });

  // Dijkstra simple
  function dijkstraSimple(source) {
    const dist = Array(N).fill(Infinity);
    const prev = Array(N).fill(null);
    const visited = Array(N).fill(false);
    dist[source] = 0;
    for (let i = 0; i < N; i++) {
      let u = -1;
      for (let j = 0; j < N; j++) {
        if (!visited[j] && (u === -1 || dist[j] < dist[u])) u = j;
      }
      if (dist[u] === Infinity) break;
      visited[u] = true;
      for (let v = 0; v < N; v++) {
        if (graph[u][v] !== Infinity && dist[u] + graph[u][v] < dist[v]) {
          dist[v] = dist[u] + graph[u][v];
          prev[v] = u;
        }
      }
    }
    return {dist, prev};
  }

  // --- DOM ---
  const origin = document.getElementById('origin');
  const destination = document.getElementById('destination');
  const calculateBtn = document.getElementById('calculate-btn');
  const progressBar = document.querySelector('.progress-bar .progress');
  const errorMsg = document.getElementById('error-msg');
  const svg = document.querySelector('.graph-container svg');
  const nodeCircles = svg.querySelectorAll('circle');
  const lines = svg.querySelectorAll('line');

  // Nodos SVG en el mismo orden que los IDs (0-5)
  const nodePositions = [
  [40, 40],   // Nodo 0
  [40, 120],  // Nodo 1
  [60, 80],   // Nodo 2
  [100, 40],  // Nodo 3
  [160, 40],  // Nodo 4
  [140, 100], // Nodo 5
  [160, 100]  // Nodo 6 
];

  // Resetear colores de nodos y líneas
  function resetGraphColors() {
    nodeCircles.forEach(c => c.setAttribute('fill', 'white'));
    lines.forEach(l => l.setAttribute('stroke', 'black'));
  }

  // Colorear nodos origen/destino
  function colorOriginDest() {
    resetGraphColors();
    if (origin.value) nodeCircles[origin.value].setAttribute('fill', '#43e97b');
    if (destination.value) nodeCircles[destination.value].setAttribute('fill', '#e63946');
  }

  // Colorear ruta mínima
  function colorRoute(path) {
    // path: [n0, n1, n2, ...]
    for (let i = 0; i < path.length - 1; i++) {
      const u = path[i], v = path[i+1];
      // Buscar la línea correspondiente y colorearla
      lines.forEach(l => {
        const x1 = parseInt(l.getAttribute('x1')), y1 = parseInt(l.getAttribute('y1'));
        const x2 = parseInt(l.getAttribute('x2')), y2 = parseInt(l.getAttribute('y2'));
        const [ux, uy] = nodePositions[u], [vx, vy] = nodePositions[v];
        if ((x1 === ux && y1 === uy && x2 === vx && y2 === vy) ||
            (x1 === vx && y1 === vy && x2 === ux && y2 === uy)) {
          l.setAttribute('stroke', '#43e97b');
          l.setAttribute('stroke-width', '4');
        }
      });
    }
    // Colorear nodos de la ruta
    path.forEach(idx => nodeCircles[idx].setAttribute('fill', '#43e97b'));
    // Origen y destino con colores distintos
    if (origin.value) nodeCircles[origin.value].setAttribute('fill', '#43e97b');
    if (destination.value) nodeCircles[destination.value].setAttribute('fill', '#e63946');
  }

  // Reconstruir ruta desde prev[]
  function buildPath(prev, dest) {
    const path = [];
    let u = dest;
    while (u !== null) {
      path.push(u);
      u = prev[u];
    }
    return path.reverse();
  }

  // --- Eventos ---
  origin.addEventListener('change', colorOriginDest);
  destination.addEventListener('change', colorOriginDest);

  calculateBtn.addEventListener('click', function (e) {
    e.preventDefault();
    errorMsg.textContent = '';
    resetGraphColors();

    if (!origin.value || !destination.value) {
      errorMsg.textContent = 'Por favor, selecciona origen y destino.';
      return;
    }
    if (origin.value === destination.value) {
      errorMsg.textContent = 'El origen y el destino no pueden ser iguales.';
      return;
    }

    const source = parseInt(origin.value);
    const dest = parseInt(destination.value);
    const {dist, prev} = dijkstraSimple(source);
    const totalTime = dist[dest];
    if (totalTime === Infinity) {
      errorMsg.textContent = 'No hay ruta disponible.';
      return;
    }
    const path = buildPath(prev, dest);

    // Colorear ruta mínima
    colorRoute(path);

    // Animar barra de progreso según pesos reales
    let progress = 0;
    let step = 0;
    progressBar.style.width = '0%';
    calculateBtn.disabled = true;

    function animateStep() {
      if (step >= path.length - 1) {
        // Mostrar tiempo y costo
        setTimeout(() => {
          progressBar.style.width = '0%';
          errorMsg.innerHTML = `Tiempo total: <b>${totalTime} segundos</b><br>Costo: <b>$${(totalTime*tarifa).toFixed(2)}</b>`;
          setTimeout(() => {
            // Reiniciar interfaz
            origin.value = '';
            destination.value = '';
            calculateBtn.disabled = false;
            resetGraphColors();
            progressBar.style.width = '0%';
            errorMsg.textContent = '';
          }, 3500);
        }, 600);
        return;
      }
      // Calcular porcentaje de avance
      const u = path[step], v = path[step+1];
      const peso = graph[u][v];
      const percent = Math.round(((step+1)/(path.length-1))*100);
      progressBar.style.width = percent + '%';
      setTimeout(() => {
        step++;
        animateStep();
      }, peso*200); // velocidad de animación: 200ms por segundo real
    }
    animateStep();
  });
});