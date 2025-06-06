class Graph {
  constructor() {
    this.nodes = {};
  }

  addNode(node) {
    this.nodes[node] = {};
  }

  addEdge(node1, node2, weight) {
    this.nodes[node1][node2] = weight;
    this.nodes[node2][node1] = weight; // Assuming an undirected graph
  }

  dijkstra(startNode, endNode) {
    const distances = {};
    const visited = {};
    const previous = {};
    const priorityQueue = [];

    // Initialize distances
    for (let node in this.nodes) {
      distances[node] = Infinity;
    }
    distances[startNode] = 0;

    // Add start node to priority queue
    priorityQueue.push({ node: startNode, distance: 0 });
    priorityQueue.sort((a, b) => a.distance - b.distance);

    while (priorityQueue.length > 0) {
      const { node } = priorityQueue.shift();

      if (visited[node]) {
        continue;
      }

      visited[node] = true;

      for (let neighbor in this.nodes[node]) {
        const distance = distances[node] + this.nodes[node][neighbor];

        if (distance < distances[neighbor]) {
          distances[neighbor] = distance;
          previous[neighbor] = node;
          priorityQueue.push({ node: neighbor, distance });
          priorityQueue.sort((a, b) => a.distance - b.distance);
        }
      }
    }

    // Reconstruct path
    const path = [];
    let currentNode = endNode;

    while (currentNode) {
      path.unshift(currentNode);
      currentNode = previous[currentNode];
    }

    return {
      distance: distances[endNode],
      path: path,
    };
  }
}

module.exports = Graph;