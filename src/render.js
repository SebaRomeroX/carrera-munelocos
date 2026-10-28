/**
 * DIBUJO (canvas) Y LOOP DE ANIMACION (rAF + delta-time)
 *
 * Ciclos de importacion con state.js y game.js: solo se usan en tiempo de ejecucion,
 * nunca en top-level (ver la regla en state.js).
 */

import { canvas, lienzo } from './dom.js';
import {
    imagenFondo,
    imagenJugadorIzquierda,
    imagenJugadorDerecha,
    imagenRival1Izquierda,
    imagenRival1Derecha,
    imagenRival2Izquierda,
    imagenRival2Derecha,
} from './assets.js';
import { estado } from './state.js';
import { victoria, moverRival1, moverRival2 } from './game.js';
import { elegirModoRival, INTERVALO_MIN } from './nucleo.js';

/* -- GEOMETRIA DE LA CALLE (se calcula una vez al cargar) -- */

export const anchoImagenFondo = window.innerWidth;
export const alturaImagenFondo = (anchoImagenFondo * 500) / 1200;
canvas.width = anchoImagenFondo;
canvas.height = alturaImagenFondo;

export const unidad = anchoImagenFondo / 10;

//META COMPARTIDA (misma distancia para todos los corredores)
export const META = anchoImagenFondo - unidad * 1.2;

/* -- DIBUJO -- */

export function dibujar() {
    let imagenJugador = imagenJugadorDerecha;

    //FONDO
    lienzo.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);

    //RIVAL 1
    let imagenRival1;
    if (estado.pasoRival1 % 2 == 0) {
        imagenRival1 = imagenRival1Izquierda;
    } else if (estado.pasoRival1 % 2 !== 0) {
        imagenRival1 = imagenRival1Derecha;
    }

    lienzo.drawImage(
        imagenRival1,
        estado.posicionRival1,
        alturaImagenFondo / 2 - unidad * 0.6,
        unidad * 1.2,
        unidad * 1.2,
    );

    //JUGADOR
    if (estado.pasoIzquierdo == 1) {
        imagenJugador = imagenJugadorIzquierda;
    } else if (estado.pasoDerecho == 1) {
        imagenJugador = imagenJugadorDerecha;
    }

    lienzo.drawImage(
        imagenJugador,
        estado.posicionJugador,
        alturaImagenFondo / 2 - unidad * 0.2,
        unidad * 1.2,
        unidad * 1.2,
    );

    //RIVAL 2
    let imagenRival2;
    if (estado.pasoRival2 % 2 !== 0) {
        imagenRival2 = imagenRival2Izquierda;
    } else if (estado.pasoRival2 % 2 == 0) {
        imagenRival2 = imagenRival2Derecha;
    }

    lienzo.drawImage(
        imagenRival2,
        estado.posicionRival2,
        alturaImagenFondo / 2 + unidad * 0.3,
        unidad * 1.2,
        unidad * 1.2,
    );

    //FIN DE CARRERA
    if (estado.posicionJugador >= META || estado.posicionRival1 >= META || estado.posicionRival2 >= META) {
        victoria();
    }
}

/* -- LOOP PRINCIPAL -- */

//ARRANQUE DEL LOOP CON TOKEN NUEVO (invalida cadenas anteriores)
export function arrancarLoop() {
    estado.idCadena++;
    estado.ultimoTiempo = performance.now();
    requestAnimationFrame((t) => bucleAnimacion(t, estado.idCadena));
}

//LOOP PRINCIPAL: un solo reloj (rAF) para dibujo + movimiento de rivales
function bucleAnimacion(tiempoAhora, cadena) {
    //detener al terminar la carrera, al pausar o si la cadena quedo obsoleta
    if (cadena !== estado.idCadena || estado.fase !== 'carrera') {
        return;
    }

    //delta-time con tope: evita saltos tras volver de otra pestana
    const dt = Math.min(tiempoAhora - estado.ultimoTiempo, 100);
    estado.ultimoTiempo = tiempoAhora;

    //rivales: acumulan tiempo y dan un paso cada msRivalN (misma cadencia de siempre)
    //carril 1: es el bot en 1 jugador; en 2 jugadores lo mueve el Jugador 2 (A/D y flechas)
    if (!estado.modo2Jugadores) {
        //rival 1: cambiar de modo si vencio
        estado.restoRival1 -= dt;
        if (estado.restoRival1 <= 0) {
            const modo1 = elegirModoRival();
            estado.escalaRival1 = modo1.escala;
            estado.restoRival1 = modo1.dur + estado.restoRival1; //conserva el exceso
        }
        estado.acumRival1 += dt;
        const pasoMs1 = Math.max(INTERVALO_MIN, estado.msRival1 * estado.escalaRival1);
        while (estado.acumRival1 >= pasoMs1) {
            moverRival1();
            estado.acumRival1 -= pasoMs1;
        }
    }

    //rival 2: cambiar de modo si vencio
    estado.restoRival2 -= dt;
    if (estado.restoRival2 <= 0) {
        const modo2 = elegirModoRival();
        estado.escalaRival2 = modo2.escala;
        estado.restoRival2 = modo2.dur + estado.restoRival2; //conserva el exceso
    }
    estado.acumRival2 += dt;
    const pasoMs2 = Math.max(INTERVALO_MIN, estado.msRival2 * estado.escalaRival2);
    while (estado.acumRival2 >= pasoMs2) {
        moverRival2();
        estado.acumRival2 -= pasoMs2;
    }

    //dibuja y detecta la meta (puede llamar a victoria)
    dibujar();

    //no re-agendar si ya hay ganador o si la cadena quedo obsoleta (pausa/reinicio)
    if (estado.fase === 'carrera' && cadena === estado.idCadena) {
        requestAnimationFrame((t) => bucleAnimacion(t, cadena));
    }
}
