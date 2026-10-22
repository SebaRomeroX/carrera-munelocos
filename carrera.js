
/**   -------------------------------------  INICIO   -------------------------------     */

//ELEMENTOS     
const seccionIconos= document.getElementById('iconos');
const mensajeNivel = document.getElementById('mensajeNivel');
const botonIzquierda = document.getElementById('botonIzquierda');
const botonDerecha = document.getElementById('botonDerecha');

const botonSiguiente = document.getElementById('botonSiguiente');

//FASE ACTUAL DEL JUEGO (define que hace el boton Siguiente)
let fase = 'intro';

//UN SOLO LISTENER: despacha segun la fase actual (evita listeners acumulados)
botonSiguiente.addEventListener('click', () => {
    if (fase == 'seleccion') {
        determinarPersonaje();
    } else if (fase == 'listo') {
        cuentaRegresiva();
    } else {
        mostrarMensajeIntro();
    }
});

function cargarElementos() {
    
    // DISPLAY ELEMENTOS
    seccionIconos.style.display='none';
    canvas.style.display='none';
    mensajeNivel.style.display='none';
    botonIzquierda.style.display='none';
    botonDerecha.style.display='none';

    //SIGUIENTE
    mostrarMensajeIntro();
}

window.addEventListener('load',cargarElementos);



     /** ---------------------------------------------------------   MENSAJES INTRO        */

// CONTADOR MENSAJES
let contadorMensajes = 1;

// SPAN MENSAJE
let spanMensaje=document.getElementById('spanMensaje');

//MENSAJES 
function mostrarMensajeIntro() {
    let mensaje = '';

    if (contadorMensajes == 1) {
        mensaje='Bienvenido a la carrera de los muñelocos';
        botonSiguiente.innerText = 'Siguiente';
    }
    if (contadorMensajes==2) {
        mensaje='Primero elige a tu personaje';
        seccionIconos.style.display ='flex';
        botonSiguiente.style.display = 'none';
    } 
    if (contadorMensajes==3) {
        mensaje='Cuando la carrera comienze, oprime los botones IZQUIERDA y DERECHA alternadamente para correr';
        botonSiguiente.style.display = 'flex';
    } 
    if (contadorMensajes==4) {
        mensaje='El primero en llegar al final de la calle gana';
        botonSiguiente.innerText = 'Siguiente';
    } 
    if (contadorMensajes==5) {
        mensaje='Estas listo ?';

        //MANDA INICIO DE CARRERA
        botonSiguiente.innerText = 'Comenzar';
        fase = 'listo';
    } 
    spanMensaje.innerText=mensaje;
    contadorMensajes++;
}





        /** ------------------------------------------------------------    ELECCION PERSONAJES        */


// INPUTS
let inputRojo= document.getElementById('radioRojo');
let inputAzul= document.getElementById('radioAzul');
let inputVerde= document.getElementById('radioVerde');
let inputAmarillo = document.getElementById('radioAmarillo');
let inputRosa  = document.getElementById('radioRosa');

// EVENTO 'change' (delegation): se dispara apenas se elige un personaje
seccionIconos.addEventListener('change', revisarEleccion);


//IMAGENES
const muñecoRojoIzquierda = new Image()
muñecoRojoIzquierda.src = './imagenes/rojoIzquierda.png'
const muñecoRojoDerecha = new Image()
muñecoRojoDerecha.src = './imagenes/rojoDerecha.png'

const muñecoAzulIzquierda = new Image()
muñecoAzulIzquierda.src = './imagenes/azulIzquierda.png'
const muñecoAzulDerecha = new Image()
muñecoAzulDerecha.src = './imagenes/azulDerecha.png'

const muñecoVerdeIzquierda = new Image()
muñecoVerdeIzquierda.src = './imagenes/verdeIzquierda.png'
const muñecoVerdeDerecha = new Image()
muñecoVerdeDerecha.src = './imagenes/verdeDerecha.png'

const muñecoRosaIzquierda = new Image()
muñecoRosaIzquierda.src = './imagenes/rosaIzquierda.png'
const muñecoRosaDerecha = new Image()
muñecoRosaDerecha.src = './imagenes/rosaDerecha.png'

const muñecoAmarilloIzquierda = new Image()
muñecoAmarilloIzquierda.src = './imagenes/amarilloIzquierda.png'
const muñecoAmarilloDerecha = new Image()
muñecoAmarilloDerecha.src = './imagenes/amarilloDerecha.png'


//HABILITA BOTON CUANDO SE ELIGE
function revisarEleccion() {
    botonSiguiente.style.display = 'flex';
    botonSiguiente.innerText = 'Confirmar'
    fase = 'seleccion';
}


//DETERMINAR PERSONAJE SEGUN ELECCION
function determinarPersonaje() {
    seccionIconos.style.display = 'none';

    let eleccion;

    if (inputRojo.checked) {
        eleccion=1;
    }if (inputAzul.checked) {
        eleccion=2;
    }if (inputVerde.checked) {
        eleccion=3;
    }if (inputRosa.checked) {
        eleccion=4;
    }if (inputAmarillo.checked) {
        eleccion=5;
    }

    determinarImagenMuñeco(eleccion);
    armarMuñecoJugador();
    elegirRival1(eleccion);
    mostrarMensajeIntro();
}

//IMAGENES DEL MUÑECO ACTUAL (temporales, compartidas por jugador y rivales)
let imagenIzquierda
let imagenDerecha

//ASIGNA IMAGENES CORRESPONDIENTES A MUÑECO
function determinarImagenMuñeco(eleccion) {
    if (eleccion==1) {
        imagenIzquierda=muñecoRojoIzquierda;
        imagenDerecha=muñecoRojoDerecha;
    }
    if (eleccion==2) {
        imagenIzquierda=muñecoAzulIzquierda;
        imagenDerecha=muñecoAzulDerecha;
    }
    if (eleccion==3) {
        imagenIzquierda=muñecoVerdeIzquierda;
        imagenDerecha=muñecoVerdeDerecha;
    }
    if (eleccion==4) {
        imagenIzquierda=muñecoRosaIzquierda;
        imagenDerecha=muñecoRosaDerecha;
    }
    if (eleccion==5) {
        imagenIzquierda=muñecoAmarilloIzquierda;
        imagenDerecha=muñecoAmarilloDerecha;
    }
}


//----------------------- JUGADOR
let imagenJugador
let imagenJugadorIzquierda
let imagenJugadorDerecha

//ASIGNAR IMAGENES
function armarMuñecoJugador(){
    imagenJugadorIzquierda=imagenIzquierda
    imagenJugadorDerecha=imagenDerecha
}

//ALEATORIO
function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

//-------------------------- RIVAL 1

// ELEGIR DISTINTO A JUGADOR
function elegirRival1(jugador) {
    let rival1=aleatorio(1,5)
    if (rival1!=jugador) {
        determinarImagenMuñeco(rival1)
        armarMuñecoRival1()
        elegirRival2(jugador,rival1)
    } else {
        elegirRival1(jugador)
    }    
}

let imagenRival1Izquierda
let imagenRival1Derecha

//ASIGNAR IMAGENES
function armarMuñecoRival1(){
    imagenRival1Izquierda=imagenIzquierda
    imagenRival1Derecha=imagenDerecha
}



//----------------------------------- RIVAL 2

// ELEGIR DISTINTO A JUGADOR Y RIVAL
function elegirRival2(jugador,rival1) {
    let rival2=aleatorio(1,5)
    if (rival2!=jugador&&rival2!=rival1) {
        determinarImagenMuñeco(rival2)
        armarMuñecoRival2()
    } else {
        elegirRival2(jugador,rival1)
    }
}

let imagenRival2Izquierda
let imagenRival2Derecha

//ASIGNAR IMAGENES
function armarMuñecoRival2(){
    imagenRival2Izquierda=imagenIzquierda
    imagenRival2Derecha=imagenDerecha
}



/** -----------------------------------------------------------------   DIBUJO        */

//ELEMENTOS
const canvas = document.getElementById('canvas')
const lienzo = canvas.getContext('2d')
const imagenFondo = new Image()
imagenFondo.src = './imagenes/fondo.png'

//PRECARGA DE IMAGENES (evita dibujar frames en blanco)
let recursosListos = false

const listaRecursos = [
    imagenFondo,
    muñecoRojoIzquierda, muñecoRojoDerecha,
    muñecoAzulIzquierda, muñecoAzulDerecha,
    muñecoVerdeIzquierda, muñecoVerdeDerecha,
    muñecoRosaIzquierda, muñecoRosaDerecha,
    muñecoAmarilloIzquierda, muñecoAmarilloDerecha
]

function cargarRecurso(img) {
    return new Promise((resolver) => {
        if (img.complete && img.naturalWidth > 0) {
            resolver()  //ya estaba cargada
        } else {
            img.onload = resolver
            img.onerror = resolver  //si falla, no bloquea el juego
        }
    })
}

Promise.all(listaRecursos.map(cargarRecurso)).then(() => {
    recursosListos = true
})

let anchoImagenFondo = window.innerWidth
let alturaImagenFondo = anchoImagenFondo * 500 / 1200
canvas.width = anchoImagenFondo
canvas.height = alturaImagenFondo 
let unidad = anchoImagenFondo/10

//META COMPARTIDA (misma distancia para todos los corredores)
const META = anchoImagenFondo - unidad*1.2

//POSICION INICIAL
let posicionJugador = unidad*0.8
let posicionRival1 =unidad*1.2
let posicionRival2 = unidad*0.3
let pasoIzquierdo=0
let pasoDerecho=0
let pasoRival1=0
let pasoRival2=0

//IMAGENES DE RIVALES EN EL FRAME ACTUAL
let imagenRival1
let imagenRival2

function dibujar() {
    imagenJugador = imagenJugadorDerecha

    //FONDO
    lienzo.drawImage(
        imagenFondo,
        0,
        0,
        canvas.width,
        canvas.height
    )
    
    //RIVAL 1
    if (pasoRival1%2==0) {
        imagenRival1=imagenRival1Izquierda
    } else if (pasoRival1%2!==0) {
        imagenRival1=imagenRival1Derecha
    }  

    lienzo.drawImage(
        imagenRival1,
        posicionRival1,
        (alturaImagenFondo/2)-unidad*0.6,
        unidad*1.2,
        unidad*1.2
    )
    
    //JUGADOR
    if (pasoIzquierdo==1) {
        imagenJugador=imagenJugadorIzquierda
    } else if (pasoDerecho==1) {
        imagenJugador=imagenJugadorDerecha
    }    

    lienzo.drawImage(
        imagenJugador,
        posicionJugador,
        (alturaImagenFondo/2)-unidad*0.2,
        unidad*1.2,
        unidad*1.2
    )
    
    //RIVAL 2
    if (pasoRival2%2!==0) {
        imagenRival2=imagenRival2Izquierda
    } else if (pasoRival2%2==0) {
        imagenRival2=imagenRival2Derecha
    }

    lienzo.drawImage(
        imagenRival2,
        posicionRival2,
        (alturaImagenFondo/2)+unidad*0.3,
        unidad*1.2,
        unidad*1.2
    )

    //FIN DE CARRERA
    if (posicionJugador>=META||
        posicionRival1>=META||
        posicionRival2>=META) {
        victoria()
    }
}


    /** ----------------------------------------------------------   INICIO DE CARRERA        */

let cuenta
let intervalo

//INICIAR CUENTA
function cuentaRegresiva() {
    //ESPERAR A QUE LAS IMAGENES SEAN VISIBLES ANTES DE EMPEZAR
    if (!recursosListos) {
        spanMensaje.innerText = 'Cargando...'
        botonSiguiente.style.display = 'none'
        setTimeout(cuentaRegresiva, 100)
        return
    }

    cuenta=setInterval(contar,800)
    dibujar()
    contar()

    //MOSTRAR DIBUJO
    mensajeNivel.style.display='flex'
    canvas.style.display='flex'
    botonIzquierda.style.display='flex'
    botonDerecha.style.display='flex'
}

let indice =0
let nivel= 1

function contar() {
    botonSiguiente.style.display='none'

    //CUENTA REGRESIVA
    if (indice==0) {
        spanMensaje.innerHTML='3...'  
    }if (indice==1) {
        spanMensaje.innerHTML='3...2...'
    }if (indice==2) {
        spanMensaje.innerHTML='3...2...1...'
    }if (indice==3) {
        spanMensaje.innerHTML='3...2...1...YA !!!'
        clearInterval(cuenta)
        iniciarCarrera()
    }
    indice++
    
    //TERMINAR
    if (indice==4) {
        indice=0
    }

    //MOSTRAR NIVEL   
    let spanNivel=document.getElementById('mensajeNivel')
    spanNivel.innerText=`Nivel ${nivel}`;
}

let velocidadRival1
let velocidadRival2
let validadcionInicio

//TUNING DE DIFICULTAD (ms de intervalo por rival; menor = mas rapido)
const INTERVALO_MIN = 55   //techo de velocidad: nunca mas rapido que esto
const BASE_RIVAL1   = 125  //ms en nivel 1
const BASE_RIVAL2   = 150  //ms en nivel 1
const DELTA_RIVAL1  = 1.2  //ms mas rapido por nivel
const DELTA_RIVAL2  = 2.5  //ms mas rapido por nivel (un poco mas agresivo)

function iniciarCarrera() {
    //pequena variacion por carrera para que no se sienta identico
    const jitter = aleatorio(-4,4);

    //velocidad acotada: nunca baja de INTERVALO_MIN (el nivel siempre es ganable)
    const msRival1 = Math.max(INTERVALO_MIN, BASE_RIVAL1-(nivel-1)*DELTA_RIVAL1+jitter);
    const msRival2 = Math.max(INTERVALO_MIN, BASE_RIVAL2-(nivel-1)*DELTA_RIVAL2+jitter);

    velocidadRival1 =setInterval(moverRival1,msRival1)
    velocidadRival2 =setInterval(moverRival2,msRival2)

    //PERMITIR MOVIMIENTO
    validadcionInicio=true

    //ACTUALIZAR DIBUJO
    intervalo =setInterval(dibujar,50)
}



/**  ---------------------------------------------------------  MOVIMIENTO        */


document.addEventListener('keyup',correr);

//BOTONES EN PANTALLA (MOBILE)
botonIzquierda.addEventListener('touchstart', (e) => {
    e.preventDefault();
    darPasoIzquierdo()
});
botonDerecha.addEventListener('touchstart', (e) => {
    e.preventDefault();
    darPasoDerecho()
});

//TECLADO
function correr(tecla) {
    //solo corre durante la carrera
    if (!validadcionInicio) {
        return;
    }

    if (tecla.key === 'ArrowLeft') {
        darPasoIzquierdo()
    } else if (tecla.key === 'ArrowRight') {
        darPasoDerecho()
    }
}

function darPasoIzquierdo() {
    if (pasoIzquierdo==0) {
        posicionJugador+=unidad*0.05
        pasoIzquierdo=1
        pasoDerecho=0
    }
}

function darPasoDerecho() {
    if (pasoDerecho==0) {
        posicionJugador+=unidad*0.05
        pasoDerecho=1
        pasoIzquierdo=0
    }
}


//MOVIMIENTO RIVALES
function moverRival1() {
    posicionRival1 += unidad*0.05
    pasoRival1++
}

function moverRival2() {
    posicionRival2 += unidad*0.05
    pasoRival2++
}


            /**    LLEGADA  A LA META        */


function victoria() {
    clearInterval(intervalo)
    clearInterval(velocidadRival1)
    clearInterval(velocidadRival2)

    //BLOQUEAR MOVIMIENTO YA QUE LA CARRERA TERMINO
    validadcionInicio=false
    pasoIzquierdo=0
    pasoDerecho=0
    
    //RESULTADO (gana quien llego mas lejos de la meta en el frame final)
    const llegadaJugador = posicionJugador - META
    const llegadaRival1 = posicionRival1 - META
    const llegadaRival2 = posicionRival2 - META

    if (llegadaJugador>llegadaRival1&&llegadaJugador>llegadaRival2) {
        spanMensaje.innerText = 'Ganaste!! Pasas al siguiente nivel'
         botonSiguiente.innerText = 'Siguiente';

        //PASA AL SIGUIENTE NIVEL
        nivel++
    }if (llegadaRival1>=llegadaJugador||llegadaRival2>=llegadaJugador) {
        spanMensaje.innerText = 'Perdiste.. Quieres intentarlo de nuevo ?'
        botonSiguiente.innerText = 'Repetir';
    }

    //RESET POSICIONES
    posicionJugador = unidad*0.8
    posicionRival1 =unidad*1.2
    posicionRival2 = unidad*0.3

    botonSiguiente.style.display = 'flex';
    botonIzquierda.style.display = 'none';
    botonDerecha.style.display = 'none';
}

