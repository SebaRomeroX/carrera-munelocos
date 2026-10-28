/**
 * ENTRADA DEL JUGADOR: teclado, botones en pantalla y menu de pausa
 *
 * Modulo de efectos laterales: al importarse adjunta TODOS los listeners del juego.
 * Ninguna funcion de arriba del archivo lee a sus socios del ciclo (state <-> game):
 * todo ocurre en tiempo de ejecucion, dentro de los handlers.
 */

import {
    botonSiguiente,
    botonIzquierda,
    botonDerecha,
    botonPausa,
    btnReanudar,
    btnRepetirNivel,
    btnReiniciarPartida,
    botonModo1Jugador,
    botonModo2Jugadores,
    seccionIconos,
} from './dom.js';
import {
    estado,
    entrarEnPausa,
    reanudarCarrera,
    repetirNivel,
    reiniciarPartida,
    elegirModo,
    revisarEleccion,
    determinarPersonaje,
    mostrarMensajeIntro,
} from './state.js';
import { cuentaRegresiva, darPasoIzquierdo, darPasoDerecho, darPasoIzquierdo2, darPasoDerecho2 } from './game.js';

/* -- BOTON SIGUIENTE / COMENZAR / REPETIR -- */

//UN SOLO LISTENER: despacha segun la fase actual (evita listeners acumulados)
botonSiguiente.addEventListener('click', () => {
    switch (estado.fase) {
        case 'seleccion':
            determinarPersonaje();
            break;
        case 'listo':
        case 'resultado':
            cuentaRegresiva();
            break;
        case 'intro':
            mostrarMensajeIntro();
            break;
        // 'modo', 'cuenta' y 'carrera': el boton esta oculto, no hace nada
    }
});

/* -- MODO DE JUEGO (1P / 2P) -- */

botonModo1Jugador.addEventListener('click', () => elegirModo(1));
botonModo2Jugadores.addEventListener('click', () => elegirModo(2));

/* -- ELECCION DE MUÑECOS -- */

seccionIconos.addEventListener('change', revisarEleccion);

/* -- PAUSA -- */

//ESCAPE: pausa o reanudar (fuera de la carrera no hace nada; e.repeat evita el auto-repeat)
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.repeat) return;
    if (estado.fase === 'carrera') entrarEnPausa();
    else if (estado.fase === 'pausa') reanudarCarrera();
});

botonPausa.addEventListener('click', () => {
    if (estado.fase === 'carrera') entrarEnPausa();
    else if (estado.fase === 'pausa') reanudarCarrera();
});
btnReanudar.addEventListener('click', reanudarCarrera);
btnRepetirNivel.addEventListener('click', repetirNivel);
btnReiniciarPartida.addEventListener('click', reiniciarPartida);

/* -- MOVIMIENTO -- */

document.addEventListener('keyup', correr);

//BOTONES EN PANTALLA (MOBILE): pointerdown responde al instante (sin delay de tap)
function pasoEnBoton(e, mover) {
    e.preventDefault(); //evita seleccion de texto y menu contextual en iOS
    if (estado.fase !== 'carrera') {
        return; //igual que el teclado: solo se corre durante la carrera
    }
    mover();
}

botonIzquierda.addEventListener('pointerdown', (e) => pasoEnBoton(e, darPasoIzquierdo));
botonDerecha.addEventListener('pointerdown', (e) => pasoEnBoton(e, darPasoDerecho));

//TECLADO
function correr(tecla) {
    //solo corre durante la carrera
    if (estado.fase !== 'carrera') {
        return;
    }

    //MODO 2 JUGADORES: J1 con A/D, J2 con las flechas
    if (estado.modo2Jugadores) {
        const k = typeof tecla.key === 'string' ? tecla.key.toLowerCase() : '';
        if (k === 'a') {
            darPasoIzquierdo();
        } else if (k === 'd') {
            darPasoDerecho();
        } else if (tecla.key === 'ArrowLeft') {
            darPasoIzquierdo2();
        } else if (tecla.key === 'ArrowRight') {
            darPasoDerecho2();
        }
        return;
    }

    //MODO 1 JUGADOR: las flechas mueven al jugador (como siempre)
    if (tecla.key === 'ArrowLeft') {
        darPasoIzquierdo();
    } else if (tecla.key === 'ArrowRight') {
        darPasoDerecho();
    }
}
