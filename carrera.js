
/**   -------------------------------------  INICIO   -------------------------------     */

//ELEMENTOS     
const seccionIconos= document.getElementById('iconos');
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

    //por defecto avanza mensajes de intro; msg5 lo cambia a 'listo'
    fase = 'intro';

    if (contadorMensajes == 1) {
        mensaje='Bienvenido a la carrera de los muñelocos';
        botonSiguiente.textContent = 'Siguiente';
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
        botonSiguiente.textContent = 'Siguiente';
    } 
    if (contadorMensajes==5) {
        mensaje='Estas listo ?';

        //MANDA INICIO DE CARRERA
        botonSiguiente.textContent = 'Comenzar';
        fase = 'listo';
    } 
    spanMensaje.textContent=mensaje;
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
muñecoRojoIzquierda.src = './imagenes/rojoIzquierda.webp'
const muñecoRojoDerecha = new Image()
muñecoRojoDerecha.src = './imagenes/rojoDerecha.webp'

const muñecoAzulIzquierda = new Image()
muñecoAzulIzquierda.src = './imagenes/azulIzquierda.webp'
const muñecoAzulDerecha = new Image()
muñecoAzulDerecha.src = './imagenes/azulDerecha.webp'

const muñecoVerdeIzquierda = new Image()
muñecoVerdeIzquierda.src = './imagenes/verdeIzquierda.webp'
const muñecoVerdeDerecha = new Image()
muñecoVerdeDerecha.src = './imagenes/verdeDerecha.webp'

const muñecoRosaIzquierda = new Image()
muñecoRosaIzquierda.src = './imagenes/rosaIzquierda.webp'
const muñecoRosaDerecha = new Image()
muñecoRosaDerecha.src = './imagenes/rosaDerecha.webp'

const muñecoAmarilloIzquierda = new Image()
muñecoAmarilloIzquierda.src = './imagenes/amarilloIzquierda.webp'
const muñecoAmarilloDerecha = new Image()
muñecoAmarilloDerecha.src = './imagenes/amarilloDerecha.webp'


//HABILITA BOTON CUANDO SE ELIGE
function revisarEleccion() {
    botonSiguiente.style.display = 'flex';
    botonSiguiente.textContent = 'Confirmar'
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
imagenFondo.src = './imagenes/fondo.webp'

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

//ESTADO DEL LOOP DE ANIMACION (rAF + delta-time)
let msRival1 = 0
let msRival2 = 0
let acumRival1 = 0
let acumRival2 = 0
let ultimoTiempo = 0

//RACHAS DE LOS BOTS (multiplicador de velocidad y tiempo restante en el modo)
let escalaRival1 = 1
let escalaRival2 = 1
let restoRival1 = 0
let restoRival2 = 0

//RACHAS DE LOS BOTS: sprint / pausa / normal, conservando la velocidad media
function elegirModoRival() {
    const r = Math.random()
    if (r < 0.15) {
        return { escala: 0.7, dur: aleatorio(400,900) }   //SPRINT
    }
    if (r < 0.30) {
        return { escala: 3.0, dur: aleatorio(250,550) }   //PAUSA (duda)
    }
    return { escala: 1.0, dur: aleatorio(700,1500) }      //NORMAL
}

//INICIAR CUENTA
function cuentaRegresiva() {
    //ESPERAR A QUE LAS IMAGENES SEAN VISIBLES ANTES DE EMPEZAR
    if (!recursosListos) {
        spanMensaje.textContent = 'Cargando...'
        botonSiguiente.style.display = 'none'
        setTimeout(cuentaRegresiva, 100)
        return
    }

    //RECURSOS LISTOS: entrar en fase de cuenta regresiva
    fase = 'cuenta'

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
        spanMensaje.textContent='3...'  
    }if (indice==1) {
        spanMensaje.textContent='3...2...'
    }if (indice==2) {
        spanMensaje.textContent='3...2...1...'
    }if (indice==3) {
        spanMensaje.textContent='3...2...1...YA !!!'
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
    spanNivel.textContent=`Nivel ${nivel}`;
}

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
    msRival1 = Math.max(INTERVALO_MIN, BASE_RIVAL1-(nivel-1)*DELTA_RIVAL1+jitter);
    msRival2 = Math.max(INTERVALO_MIN, BASE_RIVAL2-(nivel-1)*DELTA_RIVAL2+jitter);

    //reiniciar acumuladores del loop
    acumRival1 = 0
    acumRival2 = 0

    //reiniciar rachas de los bots
    escalaRival1 = 1
    escalaRival2 = 1
    restoRival1 = 0
    restoRival2 = 0

    //PERMITIR MOVIMIENTO (fase de carrera activa)
    fase = 'carrera'

    //ARRANCAR LOOP DE ANIMACION (rAF) que dibuja y mueve a los rivales
    ultimoTiempo = performance.now()
    requestAnimationFrame(bucleAnimacion)
}

//LOOP PRINCIPAL: un solo reloj (rAF) para dibujo + movimiento de rivales
function bucleAnimacion(tiempoAhora) {
    //detener al terminar la carrera
    if (fase !== 'carrera') {
        return
    }

    //delta-time con tope: evita saltos tras volver de otra pestana
    const dt = Math.min(tiempoAhora - ultimoTiempo, 100)
    ultimoTiempo = tiempoAhora

    //rivales: acumulan tiempo y dan un paso cada msRivalN (misma cadencia de siempre)
    //rival 1: cambiar de modo si vencio
    restoRival1 -= dt
    if (restoRival1 <= 0) {
        const modo1 = elegirModoRival()
        escalaRival1 = modo1.escala
        restoRival1 = modo1.dur + restoRival1      //conserva el exceso
    }
    acumRival1 += dt
    const pasoMs1 = Math.max(INTERVALO_MIN, msRival1 * escalaRival1)
    while (acumRival1 >= pasoMs1) {
        moverRival1()
        acumRival1 -= pasoMs1
    }

    //rival 2: cambiar de modo si vencio
    restoRival2 -= dt
    if (restoRival2 <= 0) {
        const modo2 = elegirModoRival()
        escalaRival2 = modo2.escala
        restoRival2 = modo2.dur + restoRival2      //conserva el exceso
    }
    acumRival2 += dt
    const pasoMs2 = Math.max(INTERVALO_MIN, msRival2 * escalaRival2)
    while (acumRival2 >= pasoMs2) {
        moverRival2()
        acumRival2 -= pasoMs2
    }

    //dibuja y detecta la meta (puede llamar a victoria)
    dibujar()

    //no re-agendar si ya hay ganador
    if (fase === 'carrera') {
        requestAnimationFrame(bucleAnimacion)
    }
}



/**  ---------------------------------------------------------  MOVIMIENTO        */


document.addEventListener('keyup',correr);

//BOTONES EN PANTALLA (MOBILE): pointerdown responde al instante (sin delay de tap)
function pasoEnBoton(e, mover) {
    e.preventDefault()  //evita seleccion de texto y menu contextual en iOS
    if (fase !== 'carrera') {
        return  //igual que el teclado: solo se corre durante la carrera
    }
    mover()
}

botonIzquierda.addEventListener('pointerdown', (e) => pasoEnBoton(e, darPasoIzquierdo));
botonDerecha.addEventListener('pointerdown', (e) => pasoEnBoton(e, darPasoDerecho));

//TECLADO
function correr(tecla) {
    //solo corre durante la carrera
    if (fase !== 'carrera') {
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
    //el loop rAF se detiene solo (fase !== 'carrera'); no hay intervalos que limpiar

    //BLOQUEAR MOVIMIENTO: la carrera termino (fase de resultado)
    fase = 'resultado'
    pasoIzquierdo=0
    pasoDerecho=0
    
    //RESULTADO (gana quien llego mas lejos de la meta en el frame final)
    const llegadaJugador = posicionJugador - META
    const llegadaRival1 = posicionRival1 - META
    const llegadaRival2 = posicionRival2 - META

    if (llegadaJugador>llegadaRival1&&llegadaJugador>llegadaRival2) {
        spanMensaje.textContent = 'Ganaste!! Pasas al siguiente nivel'
         botonSiguiente.textContent = 'Siguiente';

        //PASA AL SIGUIENTE NIVEL
        nivel++
    }if (llegadaRival1>=llegadaJugador||llegadaRival2>=llegadaJugador) {
        spanMensaje.textContent = 'Perdiste.. Quieres intentarlo de nuevo ?'
        botonSiguiente.textContent = 'Repetir';
    }

    //RESET POSICIONES
    posicionJugador = unidad*0.8
    posicionRival1 =unidad*1.2
    posicionRival2 = unidad*0.3

    botonSiguiente.style.display = 'flex';
    botonIzquierda.style.display = 'none';
    botonDerecha.style.display = 'none';
}

