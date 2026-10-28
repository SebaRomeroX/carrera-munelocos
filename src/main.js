/**
 * PUNTO DE ENTRADA DEL JUEGO
 *
 * index.html carga este modulo (`<script type="module">`); el resto de modulos
 * se importan a traves de la grafe: dom -> state <-> render <-> game, etc.
 */

import './sound.js'; //efectos laterales: boton de mute + gestos de autoplay
import './input.js'; //efectos laterales: todos los listeners del juego
import { seccionIconos, seccionModos, mensajeNivel, botonIzquierda, botonDerecha, canvas } from './dom.js';
import { mostrarMensajeIntro, reiniciarEstadoCarrera } from './state.js';

//SEMILLA DE POSICIONES (como las declaraciones originales `let posicion = unidad * 0.8`)
reiniciarEstadoCarrera();

//DISPLAY ELEMENTOS + primer mensaje de la intro (espera al load: los ids ya existen igual)
function cargarElementos() {
    seccionModos.style.display = 'none';
    seccionIconos.style.display = 'none';
    canvas.style.display = 'none';
    mensajeNivel.style.display = 'none';
    botonIzquierda.style.display = 'none';
    botonDerecha.style.display = 'none';

    //SIGUIENTE
    mostrarMensajeIntro();
}

window.addEventListener('load', cargarElementos);
