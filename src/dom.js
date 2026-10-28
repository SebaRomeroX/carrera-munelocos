/**
 * REFERENCIAS A ELEMENTOS DEL DOM
 *
 * Un solo lugar que resuelve los ids al importar; el resto de modulos importa de aqui
 * en lugar de repetir document.getElementById por todos lados.
 */

export const seccionIconos = document.getElementById('iconos');
export const seccionModos = document.getElementById('modos');
export const mensajeNivel = document.getElementById('mensajeNivel');
export const botonIzquierda = document.getElementById('botonIzquierda');
export const botonDerecha = document.getElementById('botonDerecha');
export const botonSiguiente = document.getElementById('botonSiguiente');

export const botonSonido = document.getElementById('botonSonido');
export const elementoRecord = document.getElementById('record');

export const botonPausa = document.getElementById('botonPausa');
export const overlayPausa = document.getElementById('pausa');
export const btnReanudar = document.getElementById('btnReanudar');
export const btnRepetirNivel = document.getElementById('btnRepetirNivel');
export const btnReiniciarPartida = document.getElementById('btnReiniciarPartida');

export const spanMensaje = document.getElementById('spanMensaje');

export const inputRojo = document.getElementById('radioRojo');
export const inputAzul = document.getElementById('radioAzul');
export const inputVerde = document.getElementById('radioVerde');
export const inputAmarillo = document.getElementById('radioAmarillo');
export const inputRosa = document.getElementById('radioRosa');

//ORDEN DE LOS RADIOS = ORDEN DE ELECCION (1..5)
export const radiosPersonajes = [inputRojo, inputAzul, inputVerde, inputRosa, inputAmarillo];

export const botonModo1Jugador = document.getElementById('btn1Jugador');
export const botonModo2Jugadores = document.getElementById('btn2Jugadores');

export const canvas = document.getElementById('canvas');
export const lienzo = canvas.getContext('2d');
