                                                 /**    INICIO        */

const botonInicio = document.getElementById('botonInicio')
const botonColor = document.getElementById('eleccionColor')
const seccionInicio= document.getElementById('inicio')
const mensajeNivel = document.getElementById('mensajeNivel')
const botonIzquierda = document.getElementById('botonIzquierda')
const botonDerecha = document.getElementById('botonDerecha')

let revisar

window.addEventListener('load',iniciarJuego)

function iniciarJuego() {
    inputRojo  = document.getElementById('radioRojo')
    inputAzul  = document.getElementById('radioAzul')
    inputVerde  = document.getElementById('radioVerde')
    inputAmarillo  = document.getElementById('radioAmarillo')
    inputRosa  = document.getElementById('radioRosa')
    
    document.addEventListener('keyup',correr)
    botonColor.addEventListener('click',prepararCarrera)
    botonInicio.addEventListener('click',cuentaRegresiva)
    botonIzquierda.addEventListener('click',darPasoIzquierdo)
    botonDerecha.addEventListener('click',darPasoDerecho)

    botonColor.disabled=true

    seccionInicio.style.display='none'
    botonInicio.style.display='none'
    canvas.style.display='none'
    mensajeNivel.style.display='none'
    botonIzquierda.style.display='none'
    botonDerecha.style.display='none'

    revisar =setInterval(revisarEleccion,50)
    mostrarMensajeIntro()
}


                                                                     /**    ANTES DE JUGAR        */


const botonSiguiente = document.getElementById('botonSiguiente')
botonSiguiente.addEventListener('click',mostrarMensajeIntro)
let contadorMensajes = 1


                                 /**    MENSAJES INTRO        */


let spanMensaje=document.getElementById('spanMensaje')                                

function mostrarMensajeIntro() {
    if (contadorMensajes==1) {
        spanMensaje.innerHTML='Bienvenido a la carrera de los muñelocos'
    }
    if (contadorMensajes==2) {
        spanMensaje.innerHTML='Primero elige a tu personaje y luego presiona el boton "Siguiente"'  
        seccionInicio.style.display='flex'
        botonSiguiente.style.display='none'
    } 
    if (contadorMensajes==3) {
        spanMensaje.innerHTML='Cuando la carrera comienze, oprime los botones IZQUIERDA y DERECHA alternadamente para correr'  
        botonSiguiente.style.display='flex'
    } 
    if (contadorMensajes==4) {
        spanMensaje.innerHTML='El primero en llegar al otro lado de la calle gana'  
    } 
    if (contadorMensajes==5) {
        spanMensaje.innerHTML='Oprime el boton "Comenzar" para que inicie la carrera'  
        botonSiguiente.style.display='none'
        botonInicio.style.display='flex'
    } 
    contadorMensajes++
}


                                 /**    ELECCION PERSONAJE        */

let inputRojo
let inputAzul
let inputVerde
let inputAmarillo
let inputRosa

function revisarEleccion() {
    if (inputRojo.checked||inputAzul.checked||inputVerde.checked||inputAmarillo.checked||inputRosa.checked) {
        botonColor.disabled=false

        clearInterval(revisar)
    }
}

                                 /**    ARMAR IMAGENES        */


function prepararCarrera() {
    seccionInicio.style.display='none'

    let eleccion
    if (inputRojo.checked) {
        eleccion=1
    }if (inputAzul.checked) {
        eleccion=2
    }if (inputVerde.checked) {
        eleccion=3
    }if (inputRosa.checked) {
        eleccion=4
    }if (inputAmarillo.checked) {
        eleccion=5
    }

    determinarImagenMuñeco(eleccion)
    armarMuñecoJugador()
    elegirRival1(eleccion)
    mostrarMensajeIntro()
}

const muñecoRojo = new Image()
muñecoRojo.src = './imagenes/rojo.png'
const muñecoRojoIzquierda = new Image()
muñecoRojoIzquierda.src = './imagenes/rojoIzquierda.png'
const muñecoRojoDerecha = new Image()
muñecoRojoDerecha.src = './imagenes/rojoDerecha.png'

const muñecoAzul = new Image()
muñecoAzul.src = './imagenes/azul.png'
const muñecoAzulIzquierda = new Image()
muñecoAzulIzquierda.src = './imagenes/azulIzquierda.png'
const muñecoAzulDerecha = new Image()
muñecoAzulDerecha.src = './imagenes/azulDerecha.png'

const muñecoVerde = new Image()
muñecoVerde.src = './imagenes/verde.png'
const muñecoVerdeIzquierda = new Image()
muñecoVerdeIzquierda.src = './imagenes/verdeIzquierda.png'
const muñecoVerdeDerecha = new Image()
muñecoVerdeDerecha.src = './imagenes/verdeDerecha.png'

const muñecoRosa = new Image()
muñecoRosa.src = './imagenes/rosa.png'
const muñecoRosaIzquierda = new Image()
muñecoRosaIzquierda.src = './imagenes/rosaIzquierda.png'
const muñecoRosaDerecha = new Image()
muñecoRosaDerecha.src = './imagenes/rosaDerecha.png'

const muñecoAmarillo = new Image()
muñecoAmarillo.src = './imagenes/amarillo.png'
const muñecoAmarilloIzquierda = new Image()
muñecoAmarilloIzquierda.src = './imagenes/amarilloIzquierda.png'
const muñecoAmarilloDerecha = new Image()
muñecoAmarilloDerecha.src = './imagenes/amarilloDerecha.png'

function determinarImagenMuñeco(eleccion) {
    if (eleccion==1) {
        imagenFrente=muñecoRojo;
        imagenIzquierda=muñecoRojoIzquierda
        imagenDerecha=muñecoRojoDerecha

    }if (eleccion==2) {
        imagenFrente=muñecoAzul;
        imagenIzquierda=muñecoAzulIzquierda
        imagenDerecha=muñecoAzulDerecha

    }if (eleccion==3) {
        imagenFrente=muñecoVerde;
        imagenIzquierda=muñecoVerdeIzquierda
        imagenDerecha=muñecoVerdeDerecha

    }if (eleccion==4) {
        imagenFrente=muñecoRosa;
        imagenIzquierda=muñecoRosaIzquierda
        imagenDerecha=muñecoRosaDerecha

    }if (eleccion==5) {
        imagenFrente=muñecoAmarillo;
        imagenIzquierda=muñecoAmarilloIzquierda
        imagenDerecha=muñecoAmarilloDerecha
    }
}


let imagenJugador
let imagenJugadorIzquierda
let imagenJugadorDerecha

function armarMuñecoJugador(){
    imagenJugador=imagenFrente
    imagenJugadorIzquierda=imagenIzquierda
    imagenJugadorDerecha=imagenDerecha
}


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
function elegirRival2(jugador,rival1) {
    let rival2=aleatorio(1,5)
    if (rival2!=jugador&&rival2!=rival1) {
        determinarImagenMuñeco(rival2)
        armarMuñecoRival2()
    } else {
        elegirRival2(jugador,rival1)
    }
}

let imagenRival1
let imagenRival1Izquierda
let imagenRival1Derecha

function armarMuñecoRival1(){
    imagenRival1=imagenFrente
    imagenRival1Izquierda=imagenIzquierda
    imagenRival1Derecha=imagenDerecha
}

let imagenRival2
let imagenRival2Izquierda
let imagenRival2Derecha

function armarMuñecoRival2(){
    imagenRival2=imagenFrente
    imagenRival2Izquierda=imagenIzquierda
    imagenRival2Derecha=imagenDerecha
}


                                                 /**    DIBUJO        */


const canvas = document.getElementById('canvas')
const lienzo = canvas.getContext('2d')
const imagenFondo = new Image()
imagenFondo.src = './imagenes/fondo.png'

let anchoImagenFondo = window.innerWidth
let alturaImagenFondo = anchoImagenFondo * 500 / 1200
canvas.width = anchoImagenFondo
canvas.height = alturaImagenFondo 
let unidad = anchoImagenFondo/10

let posicionJugador = unidad*0.8
let posicionRival1 =unidad*1.2
let posicionRival2 = unidad*0.3
let pasoIzquierdo=0
let pasoDerecho=0
let pasoRival1=0
let pasoRival2=0

function dibujar() {
    lienzo.drawImage(
        imagenFondo,
        0,
        0,
        canvas.width,
        canvas.height
    )
    
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

    if (posicionJugador>=anchoImagenFondo-unidad*1.6||
        posicionRival1>=anchoImagenFondo-unidad*1.2||
        posicionRival2>=anchoImagenFondo-unidad*1.8) {
        victoria()
    }
}


                                                 /**    INICIO DE CARRERA        */

let cuenta

function cuentaRegresiva() {
    cuenta=setInterval(contar,800)
    dibujar()
    contar()
    mensajeNivel.style.display='flex'
    canvas.style.display='flex'
    botonIzquierda.style.display='flex'
    botonDerecha.style.display='flex'

}

let indice =0
let nivel= 1

function contar() {
    let spanNivel=document.getElementById('nivel')

    botonInicio.style.display='none'

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
    
    if (indice==4) {
        indice=0
    }

    spanNivel.innerHTML=`Nivel°  ${nivel}`;
}

let velocidadRival1
let velocidadRival2
let dificultad = 0
let validadcionInicio

function iniciarCarrera() {
    let velocidad = aleatorio(100,120)-(dificultad*0.1);

    intervalo =setInterval(dibujar,50)
    velocidadRival1 =setInterval(moverRival1,velocidad)
    velocidadRival2 =setInterval(moverRival2,150-dificultad)
    validadcionInicio=true

}

function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}


                                                 /**    MOVIMIENTO        */


function correr(algo) {
    const t = {
        LEFT:37,
        RIGHT:39
    };

    if (validadcionInicio==true) {
        switch (algo.keyCode){
            case t.LEFT:            
                darPasoIzquierdo()
                
                break;
            case t.RIGHT:
                darPasoDerecho()
               
                break;
        }
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

function moverRival1() {
    posicionRival1 += unidad*0.05
    pasoRival1++
}

function moverRival2() {
    posicionRival2 += unidad*0.05
    pasoRival2++
}


                                                 /**    DESPUES DEL JUEGO        */


function victoria() {
    clearInterval(intervalo)
    clearInterval(velocidadRival1)
    clearInterval(velocidadRival2)
    
    if (posicionJugador>posicionRival1&&posicionJugador>posicionRival2) {
        spanMensaje.innerHTML='Ganaste !! Si oprimes el boton pasaras al siguiente nivel'
        nivel++
        dificultad=dificultad+10
    }if (posicionRival1>=posicionJugador||posicionRival2>=posicionJugador) {
        spanMensaje.innerHTML='Perdiste.. Si oprimes el boton podras intentarlo de nuevo'
    }

    posicionJugador = unidad*0.8
    posicionRival1 =unidad*1.2
    posicionRival2 = unidad*0.3

    botonInicio.style.display='flex'
    botonIzquierda.style.display='none'
    botonDerecha.style.display='none'
}

