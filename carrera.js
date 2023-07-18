                                                 /**    INICIO        */

const botonInicio = document.getElementById('botonInicio')
const botonColor = document.getElementById('eleccionColor')

const seccionInicio= document.getElementById('inicio')
const seccionMensaje= document.getElementById('mensaje')
const seccionLargada= document.getElementById('largada')

let mensaje1 = document.getElementById('mensaje-1')
let mensaje2 = document.getElementById('mensaje-2')
let mensaje3 = document.getElementById('mensaje-3')
let mensaje4 = document.getElementById('mensaje-4')
let mensaje5 = document.getElementById('mensaje-5')
let mensajeNivel = document.getElementById('mensajeNivel')
let botonIzquierda = document.getElementById('botonIzquierda')
let botonDerecha = document.getElementById('botonDerecha')

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

    revisar =setInterval(revisarEleccion,50)
    
    seccionInicio.style.display='none'
    seccionLargada.style.display='none'
    seccionMensaje.style.display='none'

    botonInicio.style.display='none'
    canvas.style.display='none'
    mensajeNivel.style.display='none'
    botonIzquierda.style.display='none'
    botonDerecha.style.display='none'

    mensaje2.style.display='none'
    mensaje3.style.display='none'
    mensaje4.style.display='none'
    mensaje5.style.display='none'
}


                                                 /**    ANTES DE JUGAR        */


let botonSiguiente = document.getElementById('botonSiguiente')
botonSiguiente.addEventListener('click',mostrarSiguienteMensaje)
let contadorMensajes = 1

function mostrarSiguienteMensaje() {
    if (contadorMensajes===1) {
        mensaje1.style.display='none'
        mensaje2.style.display='flex'
        seccionInicio.style.display='flex'
        botonSiguiente.style.display='none'
        contadorMensajes++
    } else if (contadorMensajes===2) {
        mensaje2.style.display='none'
        mensaje3.style.display='flex'
        botonSiguiente.style.display='flex'
        contadorMensajes++
    } else if (contadorMensajes===3) {
        mensaje3.style.display='none'
        mensaje4.style.display='flex'
        contadorMensajes++
    } else if (contadorMensajes===4) {
        mensaje4.style.display='none'
        mensaje5.style.display='flex'
        botonSiguiente.style.display='none'
        botonInicio.style.display='flex'
    } 
}


let inputRojo
let inputAzul
let inputVerde
let inputAmarillo
let inputRosa

function revisarEleccion() {
    if (inputRojo.checked||inputAzul.checked||inputVerde.checked||inputAmarillo.checked||inputRosa.checked) {
        botonColor.disabled=false
    }
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

let imagenJugador
let imagenJugadorIzquierda
let imagenJugadorDerecha
let imagenRival1
let imagenRival1Izquierda
let imagenRival1Derecha
let imagenRival2
let imagenRival2Izquierda
let imagenRival2Derecha

const spanMensaje=document.getElementById('spanMensaje')
let nivel= 1

function prepararCarrera() {
    seccionInicio.style.display='none'

    if (inputRojo.checked) {
        imagenJugador=muñecoRojo
        imagenJugadorIzquierda=muñecoRojoIzquierda
        imagenJugadorDerecha=muñecoRojoDerecha
        imagenRival1=muñecoAzul
        imagenRival1Izquierda=muñecoAzulIzquierda
        imagenRival1Derecha=muñecoAzulDerecha
        imagenRival2=muñecoVerde
        imagenRival2Izquierda=muñecoVerdeIzquierda
        imagenRival2Derecha=muñecoVerdeDerecha
    }if (inputAzul.checked) {
        imagenJugador=muñecoAzul
        imagenJugadorIzquierda=muñecoAzulIzquierda
        imagenJugadorDerecha=muñecoAzulDerecha
        imagenRival1=muñecoRojo
        imagenRival1Izquierda=muñecoRojoIzquierda
        imagenRival1Derecha=muñecoRojoDerecha
        imagenRival2=muñecoVerde
        imagenRival2Izquierda=muñecoVerdeIzquierda
        imagenRival2Derecha=muñecoVerdeDerecha
    }if (inputVerde.checked) {
        imagenJugador=muñecoVerde
        imagenJugadorIzquierda=muñecoVerdeIzquierda
        imagenJugadorDerecha=muñecoVerdeDerecha
        imagenRival1=muñecoAzul
        imagenRival1Izquierda=muñecoAzulIzquierda
        imagenRival1Derecha=muñecoAzulDerecha
        imagenRival2=muñecoRojo
        imagenRival2Izquierda=muñecoRojoIzquierda
        imagenRival2Derecha=muñecoRojoDerecha
    }if (inputRosa.checked) {
        imagenJugador=muñecoRosa
        imagenJugadorIzquierda=muñecoRosaIzquierda
        imagenJugadorDerecha=muñecoRosaDerecha
        imagenRival1=muñecoAzul
        imagenRival1Izquierda=muñecoAzulIzquierda
        imagenRival1Derecha=muñecoAzulDerecha
        imagenRival2=muñecoRojo
        imagenRival2Izquierda=muñecoRojoIzquierda
        imagenRival2Derecha=muñecoRojoDerecha
    }if (inputAmarillo.checked) {
        imagenJugador=muñecoAmarillo
        imagenJugadorIzquierda=muñecoAmarilloIzquierda
        imagenJugadorDerecha=muñecoAmarilloDerecha
        imagenRival1Izquierda=muñecoAzulIzquierda
        imagenRival1Derecha=muñecoAzulDerecha
        imagenRival2=muñecoRojo
        imagenRival2Izquierda=muñecoRojoIzquierda
        imagenRival2Derecha=muñecoRojoDerecha
    }

    mostrarSiguienteMensaje()

    spanMensaje.innerHTML='Cuando oprimas el boton empezara la carrera'
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


let cuenta

function cuentaRegresiva() {
    cuenta=setInterval(contar,800)
    dibujar()
    contar()
    mensajeNivel.style.display='flex'
    canvas.style.display='flex'
    mensaje5.style.display='none'
    botonIzquierda.style.display='flex'
    botonDerecha.style.display='flex'
}


const spanLargada=document.getElementById('spanLargada')
let i =0

function contar() {
    const spanNivel=document.getElementById('nivel')

    seccionMensaje.style.display='none'
    seccionLargada.style.display='flex'
    botonInicio.style.display='none'

    if (i==0) {
        spanLargada.innerHTML='3...'  
    }if (i==1) {
        spanLargada.innerHTML='3...2...'
    }if (i==2) {
        spanLargada.innerHTML='3...2...1...'
    }if (i==3) {
        spanLargada.innerHTML='3...2...1...YA !!!'
        clearInterval(cuenta)
        iniciarCarrera()
    }

    i++
    
    if (i==4) {
        i=0
    }

    spanNivel.innerHTML= ` ${nivel}`
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

    seccionMensaje.style.display='flex'
    seccionLargada.style.display='none'
    botonInicio.style.display='flex'
    botonIzquierda.style.display='none'
    botonDerecha.style.display='none'
}

