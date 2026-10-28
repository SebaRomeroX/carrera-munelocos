/**   -------------------------------------  INICIO   -------------------------------     */

//ELEMENTOS
const seccionIconos = document.getElementById('iconos');
const seccionModos = document.getElementById('modos');
const mensajeNivel = document.getElementById('mensajeNivel');
const botonIzquierda = document.getElementById('botonIzquierda');
const botonDerecha = document.getElementById('botonDerecha');

const botonSiguiente = document.getElementById('botonSiguiente');

//FASE ACTUAL DEL JUEGO (maquina de estados: un solo origen de verdad)
let fase = 'intro';

//UN SOLO LISTENER: despacha segun la fase actual (evita listeners acumulados)
botonSiguiente.addEventListener('click', () => {
    switch (fase) {
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
        // 'cuenta' y 'carrera': el boton esta oculto, no hace nada
    }
});

function cargarElementos() {
    // DISPLAY ELEMENTOS
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

/**   -------------------------------------  SONIDO (WebAudio, sin archivos)  ------------------  */

const botonSonido = document.getElementById('botonSonido');

//ESTADO PERSISTIDO: '1' activo (default), '0' silenciado
let sonidoActivo = true;
try {
    sonidoActivo = localStorage.getItem('sonido') !== '0';
} catch (e) {
    /* sin storage */
}

const VOLUMEN_MASTER = 0.3;

let contextoAudio = null; //se crea en el primer gesto (politica de autoplay)
let gananciaMaster = null;

function asegurarAudio() {
    if (!contextoAudio) {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!Ctx) return; //navegador sin WebAudio: el juego funciona sin sonido
        contextoAudio = new Ctx();
        gananciaMaster = contextoAudio.createGain();
        gananciaMaster.gain.value = sonidoActivo ? VOLUMEN_MASTER : 0;
        gananciaMaster.connect(contextoAudio.destination);
    }
    if (contextoAudio.state === 'suspended') {
        contextoAudio.resume();
    }
}

//TONO GENERICO: oscilador + envolvente de volumen (ataque/release suaves, sin clics)
function tono({ frecuencia, duracion, tipo = 'square', retraso = 0, volumen = 1, hasta = null }) {
    if (!sonidoActivo) return;
    asegurarAudio();
    if (!contextoAudio) return;

    const t0 = contextoAudio.currentTime + retraso;
    const osc = contextoAudio.createOscillator();
    const env = contextoAudio.createGain();

    osc.type = tipo;
    osc.frequency.setValueAtTime(frecuencia, t0);
    if (hasta !== null) {
        osc.frequency.exponentialRampToValueAtTime(hasta, t0 + duracion);
    }

    env.gain.setValueAtTime(0.0001, t0);
    env.gain.exponentialRampToValueAtTime(volumen, t0 + 0.012); //ataque
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + duracion); //release

    osc.connect(env);
    env.connect(gananciaMaster);
    osc.start(t0);
    osc.stop(t0 + duracion + 0.02);
}

//PASO DEL JUGADOR: blip corto con pitch distinto por lado (izq 880 / der 988)
function sonarPaso(izquierda) {
    tono({ frecuencia: izquierda ? 880 : 988, duracion: 0.05, tipo: 'square', volumen: 0.25 });
}

//CUENTA REGRESIVA: beeps 3-2-1 (Do5) y tono mas agudo y largo en "YA !!!" (Do6)
function sonarCuenta(indice) {
    if (indice <= 2) {
        tono({ frecuencia: 523, duracion: 0.12, tipo: 'square', volumen: 0.7 });
    } else {
        tono({ frecuencia: 1047, duracion: 0.25, tipo: 'square', volumen: 0.7 });
    }
}

//VICTORIA: fanfarria en arpegio Do5-Mi5-Sol5-Do6
function fanfarria() {
    const notas = [523, 659, 784, 1047];
    notas.forEach((f, i) =>
        tono({
            frecuencia: f,
            duracion: i === notas.length - 1 ? 0.4 : 0.14,
            tipo: 'triangle',
            retraso: i * 0.11,
            volumen: 0.9,
        }),
    );
}

//DERROTA: tono grave descendente (Do3 -> Do2)
function sonarDerrota() {
    tono({ frecuencia: 131, hasta: 65, duracion: 0.5, tipo: 'sawtooth', volumen: 0.6 });
}

//MUTE PERSISTIDO
function actualizarBotonSonido() {
    botonSonido.textContent = sonidoActivo ? '🔊' : '🔇';
    botonSonido.setAttribute('aria-pressed', sonidoActivo ? 'true' : 'false');
    botonSonido.setAttribute('aria-label', sonidoActivo ? 'Silenciar sonido' : 'Activar sonido');
    botonSonido.title = sonidoActivo ? 'Silenciar sonido' : 'Activar sonido';
}

function alternarSonido() {
    sonidoActivo = !sonidoActivo;
    try {
        localStorage.setItem('sonido', sonidoActivo ? '1' : '0');
    } catch (e) {
        /* sin storage */
    }
    if (gananciaMaster) {
        gananciaMaster.gain.value = sonidoActivo ? VOLUMEN_MASTER : 0;
    }
    actualizarBotonSonido();
    if (sonidoActivo) {
        //corto blip de confirmacion al reactivar
        tono({ frecuencia: 880, duracion: 0.06, volumen: 0.5 });
    }
}

botonSonido.addEventListener('click', alternarSonido);
actualizarBotonSonido();

//POLITICA DE AUTOPLAY: el contexto necesita un gesto del usuario para arrancar
document.addEventListener('pointerdown', asegurarAudio);
document.addEventListener('keydown', asegurarAudio);

/**   -------------------------------------  RECORD PERSISTENTE (localStorage)  --------------  */

const CLAVE_RECORD = 'record';
const elementoRecord = document.getElementById('record');

//LEE Y VALIDA: JSON corrupto, storage bloqueado o datos invalidos -> null (sin record)
function leerRecord() {
    try {
        const r = JSON.parse(localStorage.getItem(CLAVE_RECORD));
        if (!r) return null;
        const nivelMax = Number.isFinite(r.nivelMax) && r.nivelMax >= 1 ? r.nivelMax : null;
        const mejorTiempo = Number.isFinite(r.mejorTiempo) && r.mejorTiempo > 0 ? r.mejorTiempo : null;
        if (nivelMax === null && mejorTiempo === null) return null;
        return { nivelMax, mejorTiempo };
    } catch (e) {
        /* sin storage o JSON corrupto */
    }
    return null;
}

//GUARDA SOLO LOS CAMPOS VALIDOS (el objeto almacenado queda limpio)
function guardarRecord(r) {
    const limpio = {};
    if (Number.isFinite(r.nivelMax) && r.nivelMax >= 1) limpio.nivelMax = Math.round(r.nivelMax);
    if (Number.isFinite(r.mejorTiempo) && r.mejorTiempo > 0) limpio.mejorTiempo = Math.round(r.mejorTiempo);
    try {
        localStorage.setItem(CLAVE_RECORD, JSON.stringify(limpio));
    } catch (e) {
        /* sin storage */
    }
}

//NIVEL ALCANZADO: se guarda al INICIAR la carrera (gane o pierda)
function guardarNivelAlcanzado(nivelAlcanzado) {
    const r = leerRecord() || {};
    if (!Number.isFinite(r.nivelMax) || nivelAlcanzado > r.nivelMax) {
        r.nivelMax = nivelAlcanzado;
        guardarRecord(r);
    }
}

//MEJOR TIEMPO: se guarda en CADA fin de carrera (victoria o derrota), conservando el minimo
function guardarTiempo(duracion) {
    const r = leerRecord() || {};
    if (!Number.isFinite(r.mejorTiempo) || duracion < r.mejorTiempo) {
        r.mejorTiempo = Math.round(duracion);
        guardarRecord(r);
    }
}

//TEXTO DEL RECORD PARA LA INTRO
function pintarRecord() {
    const r = leerRecord();

    if (!r) {
        elementoRecord.textContent = 'Juega y marca tus propios récords';
    } else if (Number.isFinite(r.mejorTiempo)) {
        const tiempo = (r.mejorTiempo / 1000).toFixed(1);
        elementoRecord.textContent = Number.isFinite(r.nivelMax)
            ? `Récord: Nivel ${r.nivelMax} · mejor tiempo ${tiempo} s`
            : `Récord: mejor tiempo ${tiempo} s`;
    } else {
        elementoRecord.textContent = `Récord: Nivel ${r.nivelMax}`;
    }
}

/**   -------------------------------------  PAUSA Y REINICIO  ---------------------------  */

const botonPausa = document.getElementById('botonPausa');
const overlayPausa = document.getElementById('pausa');
const btnReanudar = document.getElementById('btnReanudar');
const btnRepetirNivel = document.getElementById('btnRepetirNivel');
const btnReiniciarPartida = document.getElementById('btnReiniciarPartida');

function actualizarBotonPausa(pausado) {
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
function entrarEnPausa() {
    if (fase !== 'carrera') return;
    fase = 'pausa';
    idCadena++;
    actualizarBotonPausa(true);
    mostrarPausa();
}

//REANUDAR: vuelve a 'carrera' con reloj fresco (sin salto de tiempo)
function reanudarCarrera() {
    if (fase !== 'pausa') return;
    ocultarPausa();
    fase = 'carrera';
    actualizarBotonPausa(false);
    botonPausa.focus();
    arrancarLoop();
}

//ESTADO DE CARRERA A CERO (compartido: repetir nivel y reiniciar partida)
function reiniciarEstadoCarrera() {
    posicionJugador = unidad * 0.8;
    posicionRival1 = unidad * 1.2;
    posicionRival2 = unidad * 0.3;
    pasoIzquierdo = 0;
    pasoDerecho = 0;
    pasoIzquierdo2 = 0;
    pasoDerecho2 = 0;
    pasoRival1 = 0;
    pasoRival2 = 0;
    acumRival1 = 0;
    acumRival2 = 0;
    escalaRival1 = 1;
    escalaRival2 = 1;
    restoRival1 = 0;
    restoRival2 = 0;
    indice = 0;
    inicioCarrera = 0;
}

//REPETIR NIVEL: mismo nivel y personaje, cuenta regresiva y carrera desde cero
function repetirNivel() {
    if (fase !== 'pausa') return;
    ocultarPausa();
    reiniciarEstadoCarrera();
    idCadena++;
    actualizarBotonPausa(false);
    cuentaRegresiva(); //nueva cuenta 3-2-1 y arranque (fase -> 'cuenta')
}

//REINICIAR PARTIDA COMPLETA: nivel 1 y vuelta a la intro
//(el record de localStorage NO se toca: es permanente)
function reiniciarPartida() {
    if (fase !== 'pausa') return;
    ocultarPausa();
    if (cuenta) {
        clearInterval(cuenta);
        cuenta = undefined;
    }
    idCadena++;
    reiniciarEstadoCarrera();
    nivel = 1;

    //SELECCION A CERO: radios libres y sin eleccion pendiente del J2
    esperandoEleccionP2 = false;
    eleccionP1 = 0;
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
    contadorMensajes = 1;
    mostrarMensajeIntro();
}

//ESCAPE: pausa o reanudar (fuera de la carrera no hace nada; e.repeat evita el auto-repeat)
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape' || e.repeat) return;
    if (fase === 'carrera') entrarEnPausa();
    else if (fase === 'pausa') reanudarCarrera();
});

botonPausa.addEventListener('click', () => {
    if (fase === 'carrera') entrarEnPausa();
    else if (fase === 'pausa') reanudarCarrera();
});
btnReanudar.addEventListener('click', reanudarCarrera);
btnRepetirNivel.addEventListener('click', repetirNivel);
btnReiniciarPartida.addEventListener('click', reiniciarPartida);

/**   -------------------------------------  MODO DE JUEGO (1P / 2P)  ---------------------  */

//MODO DE LA PARTIDA: false = 1 jugador (default), true = 2 jugadores en un teclado
let modo2Jugadores = false;

function elegirModo(jugadores) {
    modo2Jugadores = jugadores === 2;
    seccionModos.style.display = 'none';
    mostrarMensajeIntro(); //siguiente mensaje: eleccion de muñeco
}

document.getElementById('btn1Jugador').addEventListener('click', () => elegirModo(1));
document.getElementById('btn2Jugadores').addEventListener('click', () => elegirModo(2));

/** ---------------------------------------------------------   MENSAJES INTRO        */

// CONTADOR MENSAJES
let contadorMensajes = 1;

// SPAN MENSAJE
let spanMensaje = document.getElementById('spanMensaje');

//MENSAJES
function mostrarMensajeIntro() {
    let mensaje = '';

    //por defecto avanza mensajes de intro; msg5 lo cambia a 'listo'
    fase = 'intro';

    if (contadorMensajes == 1) {
        mensaje = 'Bienvenido a la carrera de los muñelocos';
        botonSiguiente.textContent = 'Siguiente';
    }
    if (contadorMensajes == 2) {
        //ELEGIR MODO ANTES QUE EL MUÑECO: 1 o 2 jugadores
        mensaje = '¿Cuántos juegan esta partida?';
        seccionModos.style.display = 'flex';
        botonSiguiente.style.display = 'none';
        fase = 'modo';
    }
    if (contadorMensajes == 3) {
        mensaje = modo2Jugadores ? 'Jugador 1: elige tu muñeco' : 'Primero elige a tu personaje';
        seccionIconos.style.display = 'flex';
        botonSiguiente.style.display = 'none';
    }
    if (contadorMensajes == 4) {
        mensaje = modo2Jugadores
            ? 'Jugador 1: usa A y D  |  Jugador 2: usa las flechas IZQUIERDA y DERECHA, alternando para correr'
            : 'Cuando la carrera comienze, oprime los botones IZQUIERDA y DERECHA alternadamente para correr';
        botonSiguiente.style.display = 'flex';
    }
    if (contadorMensajes == 5) {
        mensaje = 'El primero en llegar al final de la calle gana';
        botonSiguiente.textContent = 'Siguiente';
    }
    if (contadorMensajes == 6) {
        mensaje = 'Estas listo ?';

        //MANDA INICIO DE CARRERA
        botonSiguiente.textContent = 'Comenzar';
        fase = 'listo';
    }
    spanMensaje.textContent = mensaje;

    //RECORD: visible unicamente en el primer mensaje de la intro
    elementoRecord.hidden = contadorMensajes !== 1;
    if (contadorMensajes === 1) pintarRecord();

    contadorMensajes++;
}

/** ------------------------------------------------------------    ELECCION PERSONAJES        */

// INPUTS
let inputRojo = document.getElementById('radioRojo');
let inputAzul = document.getElementById('radioAzul');
let inputVerde = document.getElementById('radioVerde');
let inputAmarillo = document.getElementById('radioAmarillo');
let inputRosa = document.getElementById('radioRosa');

// EVENTO 'change' (delegation): se dispara apenas se elige un personaje
seccionIconos.addEventListener('change', revisarEleccion);

//ORDEN DE LOS RADIOS = ORDEN DE ELECCION (1..5)
const radiosPersonajes = [inputRojo, inputAzul, inputVerde, inputRosa, inputAmarillo];

//IMAGENES
const muñecoRojoIzquierda = new Image();
muñecoRojoIzquierda.src = './imagenes/rojoIzquierda.webp';
const muñecoRojoDerecha = new Image();
muñecoRojoDerecha.src = './imagenes/rojoDerecha.webp';

const muñecoAzulIzquierda = new Image();
muñecoAzulIzquierda.src = './imagenes/azulIzquierda.webp';
const muñecoAzulDerecha = new Image();
muñecoAzulDerecha.src = './imagenes/azulDerecha.webp';

const muñecoVerdeIzquierda = new Image();
muñecoVerdeIzquierda.src = './imagenes/verdeIzquierda.webp';
const muñecoVerdeDerecha = new Image();
muñecoVerdeDerecha.src = './imagenes/verdeDerecha.webp';

const muñecoRosaIzquierda = new Image();
muñecoRosaIzquierda.src = './imagenes/rosaIzquierda.webp';
const muñecoRosaDerecha = new Image();
muñecoRosaDerecha.src = './imagenes/rosaDerecha.webp';

const muñecoAmarilloIzquierda = new Image();
muñecoAmarilloIzquierda.src = './imagenes/amarilloIzquierda.webp';
const muñecoAmarilloDerecha = new Image();
muñecoAmarilloDerecha.src = './imagenes/amarilloDerecha.webp';

//HABILITA BOTON CUANDO SE ELIGE
function revisarEleccion() {
    botonSiguiente.style.display = 'flex';
    botonSiguiente.textContent = 'Confirmar';
    fase = 'seleccion';
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

//ESTADO DE LA SELECCION EN MODO 2 JUGADORES
let eleccionP1 = 0;
let esperandoEleccionP2 = false;

//DETERMINAR PERSONAJE SEGUN ELECCION
function determinarPersonaje() {
    seccionIconos.style.display = 'none';

    const eleccion = eleccionActual();

    //2 JUGADORES - PRIMERA PASADA: guarda al J1, bloquea su muñeco y pide el del J2
    if (modo2Jugadores && !esperandoEleccionP2) {
        eleccionP1 = eleccion;
        esperandoEleccionP2 = true;
        radiosPersonajes[eleccionP1 - 1].disabled = true; //el J2 no puede repetir muñeco

        spanMensaje.textContent = 'Jugador 2: elige tu muñeco';
        seccionIconos.style.display = 'flex';
        return; //la eleccion del J2 vuelve a disparar 'change' -> 'Confirmar'
    }

    if (esperandoEleccionP2) {
        //SEGUNDA PASADA: J1 en el carril 2, J2 en el carril 1 y bot en el carril 3
        esperandoEleccionP2 = false;
        radiosPersonajes[eleccionP1 - 1].disabled = false;

        determinarImagenMuñeco(eleccionP1);
        armarMuñecoJugador();
        determinarImagenMuñeco(eleccion);
        armarMuñecoRival1(); //carril 1: en 2P lo controla el Jugador 2

        //bot distinto de los dos muñecos humanos (nucleo puro, con shuffle)
        const bot = Nucleo.elegirBot([eleccionP1, eleccion]);
        determinarImagenMuñeco(bot);
        armarMuñecoRival2();
    } else {
        determinarImagenMuñeco(eleccion);
        armarMuñecoJugador();

        //3 muñecos distintos: jugador + 2 rivales (nucleo puro, con shuffle)
        const { rival1, rival2 } = Nucleo.elegirColoresRivales(eleccion);
        determinarImagenMuñeco(rival1);
        armarMuñecoRival1();
        determinarImagenMuñeco(rival2);
        armarMuñecoRival2();
    }

    mostrarMensajeIntro();
}

//IMAGENES DEL MUÑECO ACTUAL (temporales, compartidas por jugador y rivales)
let imagenIzquierda;
let imagenDerecha;

//ASIGNA IMAGENES CORRESPONDIENTES A MUÑECO
function determinarImagenMuñeco(eleccion) {
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
let imagenJugador;
let imagenJugadorIzquierda;
let imagenJugadorDerecha;

//ASIGNAR IMAGENES
function armarMuñecoJugador() {
    imagenJugadorIzquierda = imagenIzquierda;
    imagenJugadorDerecha = imagenDerecha;
}

//-------------------------- RIVALES

let imagenRival1Izquierda;
let imagenRival1Derecha;

//ASIGNAR IMAGENES
function armarMuñecoRival1() {
    imagenRival1Izquierda = imagenIzquierda;
    imagenRival1Derecha = imagenDerecha;
}

let imagenRival2Izquierda;
let imagenRival2Derecha;

//ASIGNAR IMAGENES
function armarMuñecoRival2() {
    imagenRival2Izquierda = imagenIzquierda;
    imagenRival2Derecha = imagenDerecha;
}

/** -----------------------------------------------------------------   DIBUJO        */

//ELEMENTOS
const canvas = document.getElementById('canvas');
const lienzo = canvas.getContext('2d');
const imagenFondo = new Image();
imagenFondo.src = './imagenes/fondo.webp';

//PRECARGA DE IMAGENES (evita dibujar frames en blanco)
let recursosListos = false;

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

let anchoImagenFondo = window.innerWidth;
let alturaImagenFondo = (anchoImagenFondo * 500) / 1200;
canvas.width = anchoImagenFondo;
canvas.height = alturaImagenFondo;
let unidad = anchoImagenFondo / 10;

//META COMPARTIDA (misma distancia para todos los corredores)
const META = anchoImagenFondo - unidad * 1.2;

//POSICION INICIAL
let posicionJugador = unidad * 0.8;
let posicionRival1 = unidad * 1.2;
let posicionRival2 = unidad * 0.3;
let pasoIzquierdo = 0;
let pasoDerecho = 0;
//pasos del JUGADOR 2 (carril 1): misma regla de alternancia que el J1
let pasoIzquierdo2 = 0;
let pasoDerecho2 = 0;
let pasoRival1 = 0;
let pasoRival2 = 0;

//IMAGENES DE RIVALES EN EL FRAME ACTUAL
let imagenRival1;
let imagenRival2;

function dibujar() {
    imagenJugador = imagenJugadorDerecha;

    //FONDO
    lienzo.drawImage(imagenFondo, 0, 0, canvas.width, canvas.height);

    //RIVAL 1
    if (pasoRival1 % 2 == 0) {
        imagenRival1 = imagenRival1Izquierda;
    } else if (pasoRival1 % 2 !== 0) {
        imagenRival1 = imagenRival1Derecha;
    }

    lienzo.drawImage(imagenRival1, posicionRival1, alturaImagenFondo / 2 - unidad * 0.6, unidad * 1.2, unidad * 1.2);

    //JUGADOR
    if (pasoIzquierdo == 1) {
        imagenJugador = imagenJugadorIzquierda;
    } else if (pasoDerecho == 1) {
        imagenJugador = imagenJugadorDerecha;
    }

    lienzo.drawImage(imagenJugador, posicionJugador, alturaImagenFondo / 2 - unidad * 0.2, unidad * 1.2, unidad * 1.2);

    //RIVAL 2
    if (pasoRival2 % 2 !== 0) {
        imagenRival2 = imagenRival2Izquierda;
    } else if (pasoRival2 % 2 == 0) {
        imagenRival2 = imagenRival2Derecha;
    }

    lienzo.drawImage(imagenRival2, posicionRival2, alturaImagenFondo / 2 + unidad * 0.3, unidad * 1.2, unidad * 1.2);

    //FIN DE CARRERA
    if (posicionJugador >= META || posicionRival1 >= META || posicionRival2 >= META) {
        victoria();
    }
}

/** ----------------------------------------------------------   INICIO DE CARRERA        */

let cuenta;

//ESTADO DEL LOOP DE ANIMACION (rAF + delta-time)
let msRival1 = 0;
let msRival2 = 0;
let acumRival1 = 0;
let acumRival2 = 0;
let ultimoTiempo = 0;

//TOKEN DE CADENA rAF: al pausar/reanudar invalida cualquier frame pendiente
//(sin esto, un doble Escape rapido dejaria DOS cadenas activas = doble velocidad)
let idCadena = 0;

//RACHAS DE LOS BOTS (multiplicador de velocidad y tiempo restante en el modo)
let escalaRival1 = 1;
let escalaRival2 = 1;
let restoRival1 = 0;
let restoRival2 = 0;

//INICIAR CUENTA
function cuentaRegresiva() {
    //ESPERAR A QUE LAS IMAGENES SEAN VISIBLES ANTES DE EMPEZAR
    if (!recursosListos) {
        spanMensaje.textContent = 'Cargando...';
        botonSiguiente.style.display = 'none';
        setTimeout(cuentaRegresiva, 100);
        return;
    }

    //RECURSOS LISTOS: entrar en fase de cuenta regresiva
    fase = 'cuenta';

    cuenta = setInterval(contar, 800);
    dibujar();
    contar();

    //MOSTRAR DIBUJO
    mensajeNivel.style.display = 'flex';
    canvas.style.display = 'flex';
    botonIzquierda.style.display = 'flex';
    botonDerecha.style.display = 'flex';
}

let indice = 0;
let nivel = 1;
let inicioCarrera = 0; //marcador de tiempo de la carrera actual (performance.now)

function contar() {
    botonSiguiente.style.display = 'none';

    //CUENTA REGRESIVA
    if (indice == 0) {
        spanMensaje.textContent = '3...';
        sonarCuenta(0);
    }
    if (indice == 1) {
        spanMensaje.textContent = '3...2...';
        sonarCuenta(1);
    }
    if (indice == 2) {
        spanMensaje.textContent = '3...2...1...';
        sonarCuenta(2);
    }
    if (indice == 3) {
        spanMensaje.textContent = '3...2...1...YA !!!';
        sonarCuenta(3);
        clearInterval(cuenta);
        iniciarCarrera();
    }
    indice++;

    //TERMINAR
    if (indice == 4) {
        indice = 0;
    }

    //MOSTRAR NIVEL
    let spanNivel = document.getElementById('mensajeNivel');
    spanNivel.textContent = `Nivel ${nivel}`;
}

//TUNING DE DIFICULTAD: las constantes y los calculos viven en nucleo.js (Nucleo.*)

function iniciarCarrera() {
    //CRONOMETRO DE LA CARRERA ACTUAL + RECORD DE NIVEL ALCANZADO (gane o pierda)
    inicioCarrera = performance.now();
    guardarNivelAlcanzado(nivel);

    //pequena variacion por carrera para que no se sienta identico
    const jitter = Nucleo.aleatorio(-4, 4);

    //velocidad acotada por el nucleo: nunca baja de INTERVALO_MIN (el nivel siempre es ganable)
    msRival1 = Nucleo.calcularVelocidadBot(nivel, Nucleo.BASE_RIVAL1, Nucleo.DELTA_RIVAL1, jitter);
    msRival2 = Nucleo.calcularVelocidadBot(nivel, Nucleo.BASE_RIVAL2, Nucleo.DELTA_RIVAL2, jitter);

    //reiniciar acumuladores del loop
    acumRival1 = 0;
    acumRival2 = 0;

    //reiniciar rachas de los bots
    escalaRival1 = 1;
    escalaRival2 = 1;
    restoRival1 = 0;
    restoRival2 = 0;

    //PERMITIR MOVIMIENTO (fase de carrera activa)
    fase = 'carrera';

    //BOTON DE PAUSA VISIBLE MIENTRAS DURE LA CARRERA
    botonPausa.hidden = false;
    actualizarBotonPausa(false);

    //ARRANCAR LOOP DE ANIMACION (rAF) que dibuja y mueve a los rivales
    arrancarLoop();
}

//ARRANQUE DEL LOOP CON TOKEN NUEVO (invalida cadenas anteriores)
function arrancarLoop() {
    idCadena++;
    ultimoTiempo = performance.now();
    requestAnimationFrame((t) => bucleAnimacion(t, idCadena));
}

//LOOP PRINCIPAL: un solo reloj (rAF) para dibujo + movimiento de rivales
function bucleAnimacion(tiempoAhora, cadena) {
    //detener al terminar la carrera, al pausar o si la cadena quedo obsoleta
    if (cadena !== idCadena || fase !== 'carrera') {
        return;
    }

    //delta-time con tope: evita saltos tras volver de otra pestana
    const dt = Math.min(tiempoAhora - ultimoTiempo, 100);
    ultimoTiempo = tiempoAhora;

    //rivales: acumulan tiempo y dan un paso cada msRivalN (misma cadencia de siempre)
    //carril 1: es el bot en 1 jugador; en 2 jugadores lo mueve el Jugador 2 (WASD/flechas)
    if (!modo2Jugadores) {
        //rival 1: cambiar de modo si vencio
        restoRival1 -= dt;
        if (restoRival1 <= 0) {
            const modo1 = Nucleo.elegirModoRival();
            escalaRival1 = modo1.escala;
            restoRival1 = modo1.dur + restoRival1; //conserva el exceso
        }
        acumRival1 += dt;
        const pasoMs1 = Math.max(Nucleo.INTERVALO_MIN, msRival1 * escalaRival1);
        while (acumRival1 >= pasoMs1) {
            moverRival1();
            acumRival1 -= pasoMs1;
        }
    }

    //rival 2: cambiar de modo si vencio
    restoRival2 -= dt;
    if (restoRival2 <= 0) {
        const modo2 = Nucleo.elegirModoRival();
        escalaRival2 = modo2.escala;
        restoRival2 = modo2.dur + restoRival2; //conserva el exceso
    }
    acumRival2 += dt;
    const pasoMs2 = Math.max(Nucleo.INTERVALO_MIN, msRival2 * escalaRival2);
    while (acumRival2 >= pasoMs2) {
        moverRival2();
        acumRival2 -= pasoMs2;
    }

    //dibuja y detecta la meta (puede llamar a victoria)
    dibujar();

    //no re-agendar si ya hay ganador o si la cadena quedo obsoleta (pausa/reinicio)
    if (fase === 'carrera' && cadena === idCadena) {
        requestAnimationFrame((t) => bucleAnimacion(t, cadena));
    }
}

/**  ---------------------------------------------------------  MOVIMIENTO        */

document.addEventListener('keyup', correr);

//BOTONES EN PANTALLA (MOBILE): pointerdown responde al instante (sin delay de tap)
function pasoEnBoton(e, mover) {
    e.preventDefault(); //evita seleccion de texto y menu contextual en iOS
    if (fase !== 'carrera') {
        return; //igual que el teclado: solo se corre durante la carrera
    }
    mover();
}

botonIzquierda.addEventListener('pointerdown', (e) => pasoEnBoton(e, darPasoIzquierdo));
botonDerecha.addEventListener('pointerdown', (e) => pasoEnBoton(e, darPasoDerecho));

//TECLADO
function correr(tecla) {
    //solo corre durante la carrera
    if (fase !== 'carrera') {
        return;
    }

    //MODO 2 JUGADORES: J1 con A/D, J2 con las flechas
    if (modo2Jugadores) {
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

function darPasoIzquierdo() {
    if (pasoIzquierdo == 0) {
        posicionJugador = Nucleo.moverCorredor(posicionJugador, unidad);
        pasoIzquierdo = 1;
        pasoDerecho = 0;
        sonarPaso(true);
    }
}

function darPasoDerecho() {
    if (pasoDerecho == 0) {
        posicionJugador = Nucleo.moverCorredor(posicionJugador, unidad);
        pasoDerecho = 1;
        pasoIzquierdo = 0;
        sonarPaso(false);
    }
}

//PASOS DEL JUGADOR 2: avanza el carril 1 (la variable "rival1" en 1 jugador)
function darPasoIzquierdo2() {
    if (pasoIzquierdo2 == 0) {
        posicionRival1 = Nucleo.moverCorredor(posicionRival1, unidad);
        pasoIzquierdo2 = 1;
        pasoDerecho2 = 0;
        sonarPaso(true);
    }
}

function darPasoDerecho2() {
    if (pasoDerecho2 == 0) {
        posicionRival1 = Nucleo.moverCorredor(posicionRival1, unidad);
        pasoDerecho2 = 1;
        pasoIzquierdo2 = 0;
        sonarPaso(false);
    }
}

//MOVIMIENTO RIVALES
function moverRival1() {
    posicionRival1 = Nucleo.moverCorredor(posicionRival1, unidad);
    pasoRival1++;
}

function moverRival2() {
    posicionRival2 = Nucleo.moverCorredor(posicionRival2, unidad);
    pasoRival2++;
}

/**    LLEGADA  A LA META        */

function victoria() {
    //el loop rAF se detiene solo (fase !== 'carrera'); no hay intervalos que limpiar

    //BLOQUEAR MOVIMIENTO: la carrera termino (fase de resultado)
    fase = 'resultado';
    pasoIzquierdo = 0;
    pasoDerecho = 0;
    pasoIzquierdo2 = 0;
    pasoDerecho2 = 0;

    //EL BOTON DE PAUSA NO APLICA FUERA DE LA CARRERA
    botonPausa.hidden = true;

    //DURACION DE LA CARRERA -> record de mejor tiempo (ganes o pierdas)
    if (inicioCarrera > 0) {
        guardarTiempo(performance.now() - inicioCarrera);
        inicioCarrera = 0;
    }

    //RESULTADO (nucleo puro: gana quien esta estrictamente primero; los empates no ganan)
    //carril 1: bot en 1P y Jugador 2 en 2P; carril 3: siempre el bot
    const ganador = Nucleo.determinarGanador(posicionJugador, posicionRival1, posicionRival2);

    if (ganador === 'jugador') {
        spanMensaje.textContent = modo2Jugadores
            ? 'Ganaste Jugador 1!! Pasas al siguiente nivel'
            : 'Ganaste!! Pasas al siguiente nivel';
        botonSiguiente.textContent = 'Siguiente';
        fanfarria();

        //PASA AL SIGUIENTE NIVEL
        nivel++;
    } else if (ganador === 'rival1' && modo2Jugadores) {
        //GANA UN HUMANO -> tambien sube de nivel
        spanMensaje.textContent = 'Gano Jugador 2!! Pasas al siguiente nivel';
        botonSiguiente.textContent = 'Siguiente';
        fanfarria();
        nivel++;
    } else if (ganador === 'empate' && modo2Jugadores) {
        //empate entre corredores: se repite el nivel (nadie llego claramente primero)
        spanMensaje.textContent = 'Empate!! Repiten el nivel';
        botonSiguiente.textContent = 'Repetir';
    } else {
        spanMensaje.textContent = modo2Jugadores
            ? 'Gano la máquina.. Quieres intentarlo de nuevo ?'
            : 'Perdiste.. Quieres intentarlo de nuevo ?';
        botonSiguiente.textContent = 'Repetir';
        sonarDerrota();
    }

    //RESET POSICIONES
    posicionJugador = unidad * 0.8;
    posicionRival1 = unidad * 1.2;
    posicionRival2 = unidad * 0.3;

    botonSiguiente.style.display = 'flex';
    botonIzquierda.style.display = 'none';
    botonDerecha.style.display = 'none';
}
