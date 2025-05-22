// block_blast game logic - script.js

const filas = 10;
const columnas = 10;
const colores = ["red", "blue", "green", "yellow", "purple"];
let tablero = [];
let puntos = 0;
let nivel = 1;
let meta = 100;

const contenedor = document.getElementById("tablero");
const puntosElem = document.getElementById("puntos");
const nivelElem = document.getElementById("nivel");
const metaElem = document.getElementById("meta");
const gameOverElem = document.getElementById("gameover");
const puntajeFinalElem = document.getElementById("puntaje-final");
const scoreBoardElem = document.getElementById("scoreboard");
const topNivelElem = document.getElementById("top-nivel");

function crearTablero() {
  tablero = [];
  contenedor.innerHTML = "";
  for (let i = 0; i < filas; i++) {
    let fila = [];
    for (let j = 0; j < columnas; j++) {
      const color = colores[Math.floor(Math.random() * colores.length)];
      fila.push(color);
      const div = document.createElement("div");
      div.className = "bloque " + color;
      div.dataset.fila = i;
      div.dataset.columna = j;
      div.style.transition = "transform 0.2s ease-in-out, opacity 0.2s ease-in-out";
      div.addEventListener("click", () => manejarClick(i, j));
      contenedor.appendChild(div);
    }
    tablero.push(fila);
  }
  actualizarInfo();
}

function manejarClick(f, c) {
  const color = tablero[f][c];
  const visitado = Array.from({ length: filas }, () => Array(columnas).fill(false));
  const grupo = [];
  buscarGrupo(f, c, color, visitado, grupo);
  if (grupo.length >= 3) {
    eliminarGrupo(grupo);
    setTimeout(() => {
      hacerCaer();
      actualizarTableroHTML();
      puntos += grupo.length * 10;
      actualizarInfo();
      verificarNivel();
    }, 200);
  }
}

function buscarGrupo(f, c, color, visitado, grupo) {
  if (f < 0 || f >= filas || c < 0 || c >= columnas) return;
  if (visitado[f][c] || tablero[f][c] !== color) return;
  visitado[f][c] = true;
  grupo.push([f, c]);
  buscarGrupo(f+1, c, color, visitado, grupo);
  buscarGrupo(f-1, c, color, visitado, grupo);
  buscarGrupo(f, c+1, color, visitado, grupo);
  buscarGrupo(f, c-1, color, visitado, grupo);
}

function eliminarGrupo(grupo) {
  for (let [f, c] of grupo) {
    tablero[f][c] = null;
    const index = f * columnas + c;
    const bloque = contenedor.children[index];
    if (bloque) bloque.style.opacity = 0;
  }
}

function hacerCaer() {
  for (let c = 0; c < columnas; c++) {
    let nuevaColumna = [];
    for (let f = filas - 1; f >= 0; f--) {
      if (tablero[f][c]) {
        nuevaColumna.push(tablero[f][c]);
      }
    }
    while (nuevaColumna.length < filas) {
      nuevaColumna.push(colores[Math.floor(Math.random() * colores.length)]);
    }
    for (let f = filas - 1; f >= 0; f--) {
      tablero[f][c] = nuevaColumna[filas - 1 - f];
    }
  }
}

function actualizarTableroHTML() {
  const bloques = contenedor.children;
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const index = i * columnas + j;
      const bloque = bloques[index];
      if (bloque) {
        bloque.className = "bloque " + tablero[i][j];
        bloque.style.opacity = 1;
      }
    }
  }
}

function actualizarInfo() {
  puntosElem.textContent = puntos;
  nivelElem.textContent = nivel;
  metaElem.textContent = meta;
}

function verificarNivel() {
  if (puntos >= meta) {
    nivel++;
    meta += 50;
    crearTablero();
  } else if (!hayMovimientosDisponibles()) {
    mostrarGameOver();
  }
}

function hayMovimientosDisponibles() {
  for (let i = 0; i < filas; i++) {
    for (let j = 0; j < columnas; j++) {
      const grupo = [];
      const visitado = Array.from({ length: filas }, () => Array(columnas).fill(false));
      buscarGrupo(i, j, tablero[i][j], visitado, grupo);
      if (grupo.length >= 3) return true;
    }
  }
  return false;
}

function mostrarGameOver() {
  gameOverElem.style.display = "flex";
  puntajeFinalElem.textContent = puntos;
  const topNivel = Math.max(nivel, parseInt(localStorage.getItem("topNivel") || 1));
  localStorage.setItem("topNivel", topNivel);
  topNivelElem.textContent = topNivel;
}

function reiniciarJuego() {
  puntos = 0;
  nivel = 1;
  meta = 100;
  gameOverElem.style.display = "none";
  crearTablero();
}

// Inicializar juego
crearTablero();

document.getElementById("reiniciar").addEventListener("click", reiniciarJuego);
