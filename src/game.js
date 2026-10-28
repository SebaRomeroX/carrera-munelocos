/**
 * JUEGO: cuenta regresiva, arranque de carrera, fisica de los corredores
 * y deteccion de llegada a la meta.
 *
 * Ciclos de importacion con render.js y state.js: solo en tiempo de ejecucion.
 */

import { spanMensaje, botonSiguiente, botonIzquierda, botonDerecha, mensajeNivel, canvas, botonPausa } from './dom.js';
import { estado, actualizarBotonPausa } from './state.js';
import { recursosListos } from './assets.js';
import { dibujar, arrancarLoop, unidad } from './render.js';
import { sonarCuenta, sonarPaso, fanfarria, sonarDerrota } from './sound.js';
import { guardarNivelAlcanzado, guardarTiempo } from './record.js';
import {
    aleatorio,
    calcularVelocidadBot,
    moverCorredor,
    determinarGanador,
    BASE_RIVAL1,
    BASE_RIVAL2,
    DELTA_RIVAL1,
    DELTA_RIVAL2,
} from './nucleo.js';

/* -- CUENTA REGRESIVA -- */

//INICIAR CUENTA
export function cuentaRegresiva() {
    //ESPERAR A QUE LAS IMAGENES SEAN VISIBLES ANTES DE EMPEZAR
    if (!recursosListos) {
        spanMensaje.textContent = 'Cargando...';
        botonSiguiente.style.display = 'none';
        setTimeout(cuentaRegresiva, 100);
        return;
    }

    //RECURSOS LISTOS: entrar en fase de cuenta regresiva
    estado.fase = 'cuenta';

    estado.cuenta = setInterval(contar, 800);
    dibujar();
    contar();

    //MOSTRAR DIBUJO
    mensajeNivel.style.display = 'flex';
    canvas.style.display = 'flex';
    botonIzquierda.style.display = 'flex';
    botonDerecha.style.display = 'flex';
}

function contar() {
    botonSiguiente.style.display = 'none';

    //CUENTA REGRESIVA
    if (estado.indice == 0) {
        spanMensaje.textContent = '3...';
        sonarCuenta(0);
    }
    if (estado.indice == 1) {
        spanMensaje.textContent = '3...2...';
        sonarCuenta(1);
    }
    if (estado.indice == 2) {
        spanMensaje.textContent = '3...2...1...';
        sonarCuenta(2);
    }
    if (estado.indice == 3) {
        spanMensaje.textContent = '3...2...1...¡YA!';
        sonarCuenta(3);
        clearInterval(estado.cuenta);
        iniciarCarrera();
    }
    estado.indice++;

    //TERMINAR
    if (estado.indice == 4) {
        estado.indice = 0;
    }

    //MOSTRAR NIVEL
    mensajeNivel.textContent = `Nivel ${estado.nivel}`;
}

/* -- ARRANQUE DE CARRERA -- */

//TUNING DE DIFICULTAD: las constantes y los calculos viven en nucleo.js
function iniciarCarrera() {
    //CRONOMETRO DE LA CARRERA ACTUAL + RECORD DE NIVEL ALCANZADO (gane o pierda)
    estado.inicioCarrera = performance.now();
    guardarNivelAlcanzado(estado.nivel);

    //pequena variacion por carrera para que no se sienta identico
    const jitter = aleatorio(-4, 4);

    //velocidad acotada por el nucleo: nunca baja de INTERVALO_MIN (el nivel siempre es ganable)
    estado.msRival1 = calcularVelocidadBot(estado.nivel, BASE_RIVAL1, DELTA_RIVAL1, jitter);
    estado.msRival2 = calcularVelocidadBot(estado.nivel, BASE_RIVAL2, DELTA_RIVAL2, jitter);

    //reiniciar acumuladores del loop
    estado.acumRival1 = 0;
    estado.acumRival2 = 0;

    //reiniciar rachas de los bots
    estado.escalaRival1 = 1;
    estado.escalaRival2 = 1;
    estado.restoRival1 = 0;
    estado.restoRival2 = 0;

    //PERMITIR MOVIMIENTO (fase de carrera activa)
    estado.fase = 'carrera';

    //BOTON DE PAUSA VISIBLE MIENTRAS DURE LA CARRERA
    botonPausa.hidden = false;
    actualizarBotonPausa(false);

    //ARRANCAR LOOP DE ANIMACION (rAF) que dibuja y mueve a los rivales
    arrancarLoop();
}

/* -- MOVIMIENTO -- */

export function darPasoIzquierdo() {
    if (estado.pasoIzquierdo == 0) {
        estado.posicionJugador = moverCorredor(estado.posicionJugador, unidad);
        estado.pasoIzquierdo = 1;
        estado.pasoDerecho = 0;
        sonarPaso(true);
    }
}

export function darPasoDerecho() {
    if (estado.pasoDerecho == 0) {
        estado.posicionJugador = moverCorredor(estado.posicionJugador, unidad);
        estado.pasoDerecho = 1;
        estado.pasoIzquierdo = 0;
        sonarPaso(false);
    }
}

//PASOS DEL JUGADOR 2: avanza el carril 1 (la variable "rival1" en 1 jugador)
export function darPasoIzquierdo2() {
    if (estado.pasoIzquierdo2 == 0) {
        estado.posicionRival1 = moverCorredor(estado.posicionRival1, unidad);
        estado.pasoIzquierdo2 = 1;
        estado.pasoDerecho2 = 0;
        sonarPaso(true);
    }
}

export function darPasoDerecho2() {
    if (estado.pasoDerecho2 == 0) {
        estado.posicionRival1 = moverCorredor(estado.posicionRival1, unidad);
        estado.pasoDerecho2 = 1;
        estado.pasoIzquierdo2 = 0;
        sonarPaso(false);
    }
}

//MOVIMIENTO RIVALES
export function moverRival1() {
    estado.posicionRival1 = moverCorredor(estado.posicionRival1, unidad);
    estado.pasoRival1++;
}

export function moverRival2() {
    estado.posicionRival2 = moverCorredor(estado.posicionRival2, unidad);
    estado.pasoRival2++;
}

/* -- LLEGADA A LA META -- */

export function victoria() {
    //el loop rAF se detiene solo (fase !== 'carrera'); no hay intervalos que limpiar

    //BLOQUEAR MOVIMIENTO: la carrera termino (fase de resultado)
    estado.fase = 'resultado';
    estado.pasoIzquierdo = 0;
    estado.pasoDerecho = 0;
    estado.pasoIzquierdo2 = 0;
    estado.pasoDerecho2 = 0;

    //EL BOTON DE PAUSA NO APLICA FUERA DE LA CARRERA
    botonPausa.hidden = true;

    //DURACION DE LA CARRERA -> record de mejor tiempo (ganes o pierdas)
    if (estado.inicioCarrera > 0) {
        guardarTiempo(performance.now() - estado.inicioCarrera);
        estado.inicioCarrera = 0;
    }

    //RESULTADO (nucleo puro: gana quien esta estrictamente primero; los empates no ganan)
    //carril 1: bot en 1P y Jugador 2 en 2P; carril 3: siempre el bot
    const ganador = determinarGanador(estado.posicionJugador, estado.posicionRival1, estado.posicionRival2);

    if (ganador === 'jugador') {
        spanMensaje.textContent = estado.modo2Jugadores
            ? '¡Ganaste Jugador 1! Pasas al siguiente nivel'
            : '¡Ganaste! Pasas al siguiente nivel';
        botonSiguiente.textContent = 'Siguiente';
        fanfarria();

        //PASA AL SIGUIENTE NIVEL
        estado.nivel++;
    } else if (ganador === 'rival1' && estado.modo2Jugadores) {
        //GANA UN HUMANO -> tambien sube de nivel
        spanMensaje.textContent = '¡Ganó Jugador 2! Pasas al siguiente nivel';
        botonSiguiente.textContent = 'Siguiente';
        fanfarria();
        estado.nivel++;
    } else if (ganador === 'empate' && estado.modo2Jugadores) {
        //empate entre corredores: se repite el nivel (nadie llego claramente primero)
        spanMensaje.textContent = '¡Empate! Repiten el nivel';
        botonSiguiente.textContent = 'Repetir';
    } else {
        spanMensaje.textContent = estado.modo2Jugadores
            ? 'Ganó la máquina... ¿Quieres intentarlo de nuevo?'
            : 'Perdiste... ¿Quieres intentarlo de nuevo?';
        botonSiguiente.textContent = 'Repetir';
        sonarDerrota();
    }

    //RESET POSICIONES
    estado.posicionJugador = unidad * 0.8;
    estado.posicionRival1 = unidad * 1.2;
    estado.posicionRival2 = unidad * 0.3;

    botonSiguiente.style.display = 'flex';
    botonIzquierda.style.display = 'none';
    botonDerecha.style.display = 'none';
}
