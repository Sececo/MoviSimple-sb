## Integrantes
- Edwin Yair Molina Cerón - 408873
- Sebastian Ceballos - 408964
- Jonnier Cadena - 409238

## Descripcion del problema
- En MoviSimple no hay Uber ni Cabify: aquí los conductores son héroes que recorren un mapa con 
sólo seis vértices y un objetivo claro: llevar al pasajero del punto A al punto B en el menor tiempo 
posible… o al menos intentarlo antes de que llegue el siguiente cliente con otra petición de pizza. 
Cada equipo creará una aplicación web/CLI que simule este escenario, usando la clase GraphSimple 
para modelar el grafo de seis nodos y aplicar Dijkstra “simple”. El pasajero podrá registrarse, 
autenticarse y elegir origen y destino. La app calculará la ruta mínima en segundos, mostrará un 
progreso animado y revelará el costo del viaje, para luego reiniciar la interfaz y esperar al 
siguiente aventurero.

## Requerimientos
1. Registro / Autenticación
  - Pantalla de registro (nombre, correo, contraseña).
  - Pantalla de login (correo, contraseña).
  - Usuarios guardados en users.txt, una línea por cada usuario.

2. Carga del grafo
  - Definir las 9 aristas en el código o desde un archivo externo edges.txt para un total de 6 nodos.
  - Cada arista será una tripleta [u, v, w] que representa una conexión bidireccional entre los nodos u y v, con un peso w expresado en segundos.

3. Selección de ruta
  - Tras el login exitoso, se mostrará un mapa visual con los 6 nodos numerados.
  - El usuario podrá seleccionar un nodo de origen y uno de destino; ambos cambiarán de color al ser seleccionados.

4. Cálculo y animación
  - Se ejecuta la función dijkstraSimple(source) para obtener la distancia mínima y los predecesores.
  - Se reconstruye el camino mínimo y se dibuja visualmente sobre el mapa.
  - Se muestra una animación o barra de progreso que simula el recorrido, respetando el tiempo indicado por los pesos de cada arista (en segundos).

5. Costo y limpieza
  - Cada equipo define una tarifa por segundo (por ejemplo, $0.50/segundo).
  - Al finalizar la animación, se muestra:
  - “Tiempo total: T segundos”
  - “Costo: T × tarifa”
  - Finalmente, se reinicia la interfaz: se restablecen los nodos seleccionados, se oculta la animación y queda lista para una nueva solicitud.

6. Despliegue
  - La aplicación debe estar desplegada en Vercel, con una URL pública y completamente funcional.

## Criterios de Aceptación
CA1 -	El sistema permite registrar un usuario y almacena sus datos en users.txt.
CA2	- El sistema autentica al usuario con correo y contraseña correctamente.
CA3	- Tras el login, se muestra correctamente el mapa con 6 vértices.
CA4	- El usuario puede seleccionar origen y destino; los nodos cambian de color.
CA5	- El grafo se construye con las aristas definidas y pesos en segundos.
CA6	- El algoritmo Dijkstra “simple” calcula correctamente las distancias desde el nodo origen.
CA7	- La ruta óptima se dibuja y se muestra una animación o barra de progreso de acuerdo con los pesos.
CA8	- Se calcula y muestra el costo del viaje en base al tiempo total y la tarifa definida.
CA9	- Al finalizar la animación, la interfaz vuelve a su estado inicial para una nueva consulta.
CA10 - La aplicación está desplegada en Vercel con una URL pública y sin errores.

## Rúbrica de Evaluación
- Registro/Login y persistencia
- Implementación de GraphSimple
- Cálculo de ruta (Dijkstra
- Animación / Progress bar
- Cambio de color en nodos seleccionados
- Cálculo y presentación de costo
- Limpieza de interfaz final
- Despliegue en Vercel

