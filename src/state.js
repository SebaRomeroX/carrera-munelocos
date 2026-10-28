/**
 * ESTADO DEL JUEGO Y FLUJOS DE PANTALLA
 *
 * - `estado`: el UNICO objeto mutable compartido (maquina de estados, posiciones, contadores).
 *   Los modulos lo mutan en sitio: ESM no permite reasignar `export let` desde fuera,
 *   pero sí mutar las propiedades de un objeto exportado.
 * - Pausa, reinicios, mensajes de intro, modo 1P/2P y eleccion de personajes.
 *
 * OJO: este modulo participa en ciclos de importacion (state <-> render <-> game).
 * Regla de oro: NADA de top-level puede llamar a funciones o leer bindings de sus
 * socios del ciclo; solo declaraciones (const de estado y function hoisted).
 */

import {
    seccionIconos,
    seccionModos,
    mensajeNivel,
    botonIzquierda,
    botonDerecha,
    botonSiguiente,
    elementoRecord,
    botonPausa,
    overlayPausa,
    btnReanudar,
    spanMensaje,
    inputRojo,
    inputAzul,
    inputVerde,
    inputRosa,
    inputAmarillo,
    radiosPersonajes,
    canvas,
} from './dom.js';
import { pintarRecord } from './record.js';
import { determinarImagenMuñeco, armarMuñecoJugador, armarMuñecoRival1, armarMuñecoRival2 } from './assets.js';
import { unidad, arrancarLoop } from './render.js';
import { cuentaRegresiva } from './game.js';
import { elegirBot, elegirColoresRivales } from './nucleo.js';

//LA VERDAD DEL JUEGO (un solo origen de verdad, como la maquina de estados original)
export const estado = {
    //maquina de estados: intro | modo | seleccion | listo | cuenta | carrera | pausa | resultado
    fase: 'intro',
    nivel: 1,
    contadorMensajes: 1,
    modo2Jugadores: false,

    //seleccion en modo 2 jugadores
    eleccionP1: 0,
    esperandoEleccionP2: false,

    //posiciones y pasos (la meta es la misma para los tres)
    posicionJugador: 0,
    posicionRival1: 0,
    posicionRival2: 0,
    pasoIzquierdo: 0,
    pasoDerecho: 0,
    pasoIzquierdo2: 0,
    pasoDerecho2: 0,
    pasoRival1: 0,
    pasoRival2: 0,

    //loop de animacion (rAF + delta-time) y rachas de los bots
    msRival1: 0,
    msRival2: 0,
    acumRival1: 0,
    acumRival2: 0,
    ultimoTiempo: 0,
    idCadena: 0, //token de cadena rAF: al pausar invalida frames pendientes
    escalaRival1: 1,
    escalaRival2: 1,
    restoRival1: 0,
    restoRival2: 0,

    //cuenta regresiva y cronometro
    cuenta: undefined,
    indice: 0,
    inicioCarrera: 0,
};

/** -------------------------------------------------------   PAUSA Y REINICIO   */

export function actualizarBotonPausa(pausado) {
    botonPausa.textContent = pausado ? '▶' : '⏸';
    const texto = pausado ? 'Reanudar carrera' : 'Pausar carrera';
    botonPausa.setAttribute('aria-label', texto);
    botonPausa.title = texto;
}

function mostrarPausa() {
    overlayPausa.hidden = false;
    btnReanudar.focus();
}

function ocultarPausa() {
    overlayPausa.hidden = true;
}

//ENTRAR EN PAUSA: cambia la fase y invalida la cadena rAF pendiente
export function entrarEnPausa() {
    if (estado.fase !== 'carrera') return;
    estado.fase = 'pausa';
    estado.idCadena++;
    actualizarBotonPausa(true);
    mostrarPausa();
}

//REANUDAR: vuelve a 'carrera' con reloj fresco (sin salto de tiempo)
export function reanudarCarrera() {
    if (estado.fase !== 'pausa') return;
    ocultarPausa();
    estado.fase = 'carrera';
    actualizarBotonPausa(false);
    botonPausa.focus();
    arrancarLoop();
}

//ESTADO DE CARRERA A CERO (compartido: repetir nivel y reiniciar partida)
export function reiniciarEstadoCarrera() {
    estado.posicionJugador = unidad * 0.8;
    estado.posicionRival1 = unidad * 1.2;
    estado.posicionRival2 = unidad * 0.3;
    estado.pasoIzquierdo = 0;
    estado.pasoDerecho = 0;
    estado.pasoIzquierdo2 = 0;
    estado.pasoDerecho2 = 0;
    estado.pasoRival1 = 0;
    estado.pasoRival2 = 0;
    estado.acumRival1 = 0;
    estado.acumRival2 = 0;
    estado.escalaRival1 = 1;
    estado.escalaRival2 = 1;
    estado.restoRival1 = 0;
    estado.restoRival2 = 0;
    estado.indice = 0;
    estado.inicioCarrera = 0;
}

//REPETIR NIVEL: mismo nivel y personaje, cuenta regresiva y carrera desde cero
export function repetirNivel() {
    if (estado.fase !== 'pausa') return;
    ocultarPausa();
    reiniciarEstadoCarrera();
    estado.idCadena++;
    actualizarBotonPausa(false);
    cuentaRegresiva(); //nueva cuenta 3-2-1 y arranque (fase -> 'cuenta')
}

//REINICIAR PARTIDA COMPLETA: nivel 1 y vuelta a la intro
//(el record de localStorage NO se toca: es permanente)
export function reiniciarPartida() {
    if (estado.fase !== 'pausa') return;
    ocultarPausa();
    if (estado.cuenta) {
        clearInterval(estado.cuenta);
        estado.cuenta = undefined;
    }
    estado.idCadena++;
    reiniciarEstadoCarrera();
    estado.nivel = 1;

    //SELECCION A CERO: radios libres y sin eleccion pendiente del J2
    estado.esperandoEleccionP2 = false;
    estado.eleccionP1 = 0;
    radiosPersonajes.forEach((r) => {
        r.disabled = false;
    });

    //UI: esconder la carrera y volver a la intro
    canvas.style.display = 'none';
    botonIzquierda.style.display = 'none';
    botonDerecha.style.display = 'none';
    mensajeNivel.style.display = 'none';
    seccionModos.style.display = 'none';
    seccionIconos.style.display = 'none';
    botonSiguiente.style.display = 'flex';
    botonPausa.hidden = true;

    //mensaje 1 de la intro + record
    estado.contadorMensajes = 1;
    mostrarMensajeIntro();
}

/** -------------------------------------------------------   MODO DE JUEGO (1P / 2P)   */

export function elegirModo(jugadores) {
    estado.modo2Jugadores = jugadores === 2;
    seccionModos.style.display = 'none';
    mostrarMensajeIntro(); //siguiente mensaje: eleccion de muñeco
}

/** -------------------------------------------------------   MENSAJES INTRO   */

//MENSAJES
export function mostrarMensajeIntro() {
    let mensaje = '';

    //por defecto avanza mensajes de intro; el ultimo lo cambia a 'listo'
    estado.fase = 'intro';

    if (estado.contadorMensajes == 1) {
        mensaje = 'Bienvenido a la carrera de los muñelocos';
        botonSiguiente.textContent = 'Siguiente';
    }
    if (estado.contadorMensajes == 2) {
        //ELEGIR MODO ANTES QUE EL MUÑECO: 1 o 2 jugadores
        mensaje = '¿Cuántos juegan esta partida?';
        seccionModos.style.display = 'flex';
        botonSiguiente.style.display = 'none';
        estado.fase = 'modo';
    }
    if (estado.contadorMensajes == 3) {
        mensaje = estado.modo2Jugadores ? 'Jugador 1: elige tu muñeco' : 'Primero elige a tu personaje';
        seccionIconos.style.display = 'flex';
        botonSiguiente.style.display = 'none';
    }
    if (estado.contadorMensajes == 4) {
        mensaje = estado.modo2Jugadores
            ? 'Jugador 1: usa A y D  |  Jugador 2: usa las flechas IZQUIERDA y DERECHA, alternando para correr'
            : 'Cuando la carrera comience, oprime los botones IZQUIERDA y DERECHA alternadamente para correr';
        botonSiguiente.style.display = 'flex';
    }
    if (estado.contadorMensajes == 5) {
        mensaje = 'El primero en llegar al final de la calle gana';
        botonSiguiente.textContent = 'Siguiente';
    }
    if (estado.contadorMensajes == 6) {
        mensaje = '¿Estás listo?';

        //MANDA INICIO DE CARRERA
        botonSiguiente.textContent = 'Comenzar';
        estado.fase = 'listo';
    }
    spanMensaje.textContent = mensaje;

    //RECORD: visible unicamente en el primer mensaje de la intro
    elementoRecord.hidden = estado.contadorMensajes !== 1;
    if (estado.contadorMensajes === 1) pintarRecord();

    estado.contadorMensajes++;
}

/** -------------------------------------------------------   ELECCION PERSONAJES   */

//HABILITA BOTON CUANDO SE ELIGE
export function revisarEleccion() {
    botonSiguiente.style.display = 'flex';
    botonSiguiente.textContent = 'Confirmar';
    estado.fase = 'seleccion';
}

//LECTURA DE LA ELECCION ACTUAL
function eleccionActual() {
    if (inputRojo.checked) return 1;
    if (inputAzul.checked) return 2;
    if (inputVerde.checked) return 3;
    if (inputRosa.checked) return 4;
    if (inputAmarillo.checked) return 5;
    return 0;
}

//DETERMINAR PERSONAJE SEGUN ELECCION
export function determinarPersonaje() {
    seccionIconos.style.display = 'none';

    const eleccion = eleccionActual();

    //2 JUGADORES - PRIMERA PASADA: guarda al J1, bloquea su muñeco y pide el del J2
    if (estado.modo2Jugadores && !estado.esperandoEleccionP2) {
        estado.eleccionP1 = eleccion;
        estado.esperandoEleccionP2 = true;
        radiosPersonajes[estado.eleccionP1 - 1].disabled = true; //el J2 no puede repetir muñeco

        spanMensaje.textContent = 'Jugador 2: elige tu muñeco';
        seccionIconos.style.display = 'flex';
        return; //la eleccion del J2 vuelve a disparar 'change' -> 'Confirmar'
    }

    if (estado.esperandoEleccionP2) {
        //SEGUNDA PASADA: J1 en el carril 2, J2 en el carril 1 y bot en el carril 3
        estado.esperandoEleccionP2 = false;
        radiosPersonajes[estado.eleccionP1 - 1].disabled = false;

        determinarImagenMuñeco(estado.eleccionP1);
        armarMuñecoJugador();
        determinarImagenMuñeco(eleccion);
        armarMuñecoRival1(); //carril 1: en 2P lo controla el Jugador 2

        //bot distinto de los dos muñecos humanos (nucleo puro, con shuffle)
        const bot = elegirBot([estado.eleccionP1, eleccion]);
        determinarImagenMuñeco(bot);
        armarMuñecoRival2();
    } else {
        determinarImagenMuñeco(eleccion);
        armarMuñecoJugador();

        //3 muñecos distintos: jugador + 2 rivales (nucleo puro, con shuffle)
        const { rival1, rival2 } = elegirColoresRivales(eleccion);
        determinarImagenMuñeco(rival1);
        armarMuñecoRival1();
        determinarImagenMuñeco(rival2);
        armarMuñecoRival2();
    }

    mostrarMensajeIntro();
}
