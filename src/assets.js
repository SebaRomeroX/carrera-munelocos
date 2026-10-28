/**
 * RECURSOS GRAFICOS: precarga de imagenes y asignacion de muñecos a los corredores
 *
 * Los bindings exportados con `export let` son "live bindings": render.js lee los valores
 * actualizados sin que pueda reasignarlos desde fuera (solo este modulo los escribe).
 */

export const muñecoRojoIzquierda = new Image();
muñecoRojoIzquierda.src = './imagenes/rojoIzquierda.webp';
export const muñecoRojoDerecha = new Image();
muñecoRojoDerecha.src = './imagenes/rojoDerecha.webp';

export const muñecoAzulIzquierda = new Image();
muñecoAzulIzquierda.src = './imagenes/azulIzquierda.webp';
export const muñecoAzulDerecha = new Image();
muñecoAzulDerecha.src = './imagenes/azulDerecha.webp';

export const muñecoVerdeIzquierda = new Image();
muñecoVerdeIzquierda.src = './imagenes/verdeIzquierda.webp';
export const muñecoVerdeDerecha = new Image();
muñecoVerdeDerecha.src = './imagenes/verdeDerecha.webp';

export const muñecoRosaIzquierda = new Image();
muñecoRosaIzquierda.src = './imagenes/rosaIzquierda.webp';
export const muñecoRosaDerecha = new Image();
muñecoRosaDerecha.src = './imagenes/rosaDerecha.webp';

export const muñecoAmarilloIzquierda = new Image();
muñecoAmarilloIzquierda.src = './imagenes/amarilloIzquierda.webp';
export const muñecoAmarilloDerecha = new Image();
muñecoAmarilloDerecha.src = './imagenes/amarilloDerecha.webp';

//FONDO DE LA CALLE
export const imagenFondo = new Image();
imagenFondo.src = './imagenes/fondo.webp';

/* -- PRECARGA (evita dibujar frames en blanco) -- */

export let recursosListos = false;

const listaRecursos = [
    imagenFondo,
    muñecoRojoIzquierda,
    muñecoRojoDerecha,
    muñecoAzulIzquierda,
    muñecoAzulDerecha,
    muñecoVerdeIzquierda,
    muñecoVerdeDerecha,
    muñecoRosaIzquierda,
    muñecoRosaDerecha,
    muñecoAmarilloIzquierda,
    muñecoAmarilloDerecha,
];

function cargarRecurso(img) {
    return new Promise((resolver) => {
        if (img.complete && img.naturalWidth > 0) {
            resolver(); //ya estaba cargada
        } else {
            img.onload = resolver;
            img.onerror = resolver; //si falla, no bloquea el juego
        }
    });
}

Promise.all(listaRecursos.map(cargarRecurso)).then(() => {
    recursosListos = true;
});

/* -- ASIGNACION DE MUÑECOS -- */

//IMAGENES DEL MUÑECO ACTUAL (temporales, compartidas por jugador y rivales)
let imagenIzquierda;
let imagenDerecha;

//ASIGNA IMAGENES CORRESPONDIENTES A MUÑECO
export function determinarImagenMuñeco(eleccion) {
    if (eleccion == 1) {
        imagenIzquierda = muñecoRojoIzquierda;
        imagenDerecha = muñecoRojoDerecha;
    }
    if (eleccion == 2) {
        imagenIzquierda = muñecoAzulIzquierda;
        imagenDerecha = muñecoAzulDerecha;
    }
    if (eleccion == 3) {
        imagenIzquierda = muñecoVerdeIzquierda;
        imagenDerecha = muñecoVerdeDerecha;
    }
    if (eleccion == 4) {
        imagenIzquierda = muñecoRosaIzquierda;
        imagenDerecha = muñecoRosaDerecha;
    }
    if (eleccion == 5) {
        imagenIzquierda = muñecoAmarilloIzquierda;
        imagenDerecha = muñecoAmarilloDerecha;
    }
}

//----------------------- JUGADOR
export let imagenJugadorIzquierda;
export let imagenJugadorDerecha;

//ASIGNAR IMAGENES
export function armarMuñecoJugador() {
    imagenJugadorIzquierda = imagenIzquierda;
    imagenJugadorDerecha = imagenDerecha;
}

//-------------------------- RIVALES

export let imagenRival1Izquierda;
export let imagenRival1Derecha;

//ASIGNAR IMAGENES
export function armarMuñecoRival1() {
    imagenRival1Izquierda = imagenIzquierda;
    imagenRival1Derecha = imagenDerecha;
}

export let imagenRival2Izquierda;
export let imagenRival2Derecha;

//ASIGNAR IMAGENES
export function armarMuñecoRival2() {
    imagenRival2Izquierda = imagenIzquierda;
    imagenRival2Derecha = imagenDerecha;
}
