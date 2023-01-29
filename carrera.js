const escenario = document.getElementById('canvas')
const lienzo = escenario.getContext('2d')
const imagenFondo = new Image()
imagenFondo.src = './imagenes/fondo.png'
let alturaImagenFondo
let anchoImagenFondo = window.innerWidth
const anchoMaxMapa = 1200
if (anchoImagenFondo > anchoMaxMapa) {
    anchoImagenFondo = anchoMaxMapa
}
alturaImagenFondo = anchoImagenFondo * 500 / 1200
escenario.width = anchoImagenFondo
escenario.height = alturaImagenFondo 

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

let alturaImagenMuñequito =100
let anchoImagenMuñequito =100

let posicionJugador =10
let posicionRival1 =10
let posicionRival2 =10

let movimiento=0

const t = {
    LEFT:37,
    RIGHT:39
  };

const botonInicio = document.getElementById('botonInicio')
const botonColor = document.getElementById('eleccionColor')

const seccionInicio= document.getElementById('inicio')
const seccionCarrera= document.getElementById('carrera')
const seccionMensaje= document.getElementById('mensaje')
const seccionLargada= document.getElementById('largada')

const spanMensaje=document.getElementById('spanMensaje')
const spanNivel=document.getElementById('nivel')
const spanLargada=document.getElementById('spanLargada')


let inputRojo
let inputAzul
let inputVerde
let inputAmarillo
let inputRosa

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

    botonColor.disabled=true

    revisar =setInterval(revisarEleccion,50)
    
    seccionInicio.style.display='flex'
    seccionCarrera.style.display='none'
    seccionMensaje.style.display='none'
    seccionLargada.style.display='none'
}

function revisarEleccion() {
    if (inputRojo.checked||inputAzul.checked||inputVerde.checked||inputAmarillo.checked||inputRosa.checked) {
        botonColor.disabled=false
    }
}

let imagenJugador
let imagenJugadorIzquierda
let imagenJugadorDerecha
let imagenRival1
let imagenRival1Izquierda
let imagenRival1Derecha
let imagenRival2
let imagenRival2Izquierda
let imagenRival2Derecha

let nivel= 1
function prepararCarrera() {
    seccionCarrera.style.display='flex'
    seccionMensaje.style.display='flex'
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

    dibujar()

    spanMensaje.innerHTML='Cuando oprimas el boton empezara la carrera'
    spanNivel.innerHTML= ` ${nivel}`
}

function dibujar() {
    lienzo.drawImage(
        imagenFondo,
        0,
        0,
        escenario.width,
        escenario.height
    )
    
    if (pasoRival1%2==0) {
        imagenRival1=imagenRival1Izquierda
    } else if (pasoRival1%2!==0) {
        imagenRival1=imagenRival1Derecha
    }  
    lienzo.drawImage(
        imagenRival1,
        posicionRival1+80,
        alturaImagenFondo*4/5-80-alturaImagenMuñequito/2,
        anchoImagenMuñequito,
        alturaImagenMuñequito
    )
    
    if (pasoIzquierdo==1) {
        imagenJugador=imagenJugadorIzquierda
    } else if (pasoDerecho==1) {
        imagenJugador=imagenJugadorDerecha
    }    
    lienzo.drawImage(
        imagenJugador,
        posicionJugador+40,
        alturaImagenFondo*4/5-40-alturaImagenMuñequito/2,
        anchoImagenMuñequito,
        alturaImagenMuñequito
    )
    
    if (pasoRival2%2!==0) {
        imagenRival2=imagenRival2Izquierda
    } else if (pasoRival2%2==0) {
        imagenRival2=imagenRival2Derecha
    }
    lienzo.drawImage(
        imagenRival2,
        posicionRival2,
        alturaImagenFondo*4/5-alturaImagenMuñequito/2,
        anchoImagenMuñequito,
        alturaImagenMuñequito
    )

    if (posicionJugador>=anchoImagenFondo-anchoImagenMuñequito||
        posicionRival1>=anchoImagenFondo-anchoImagenMuñequito-40||
        posicionRival2>=anchoImagenFondo-anchoImagenMuñequito-80) {
        victoria()
    }
}

let cuenta
function cuentaRegresiva() {
    cuenta=setInterval(contar,800)
    dibujar()
    contar()
}

let i =0
function contar() {
    seccionMensaje.style.display='none'
    seccionLargada.style.display='flex'
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
}

let validadcionInicio
let velocidadRival1
let velocidadRival2

let dificultad = 150
function iniciarCarrera() {
    intervalo =setInterval(dibujar,50)
    velocidadRival1 =setInterval(moverRival1,dificultad)
    velocidadRival2 =setInterval(moverRival2,dificultad+10)
    validadcionInicio=true

    

    spanNivel.innerHTML= ` ${nivel}`

    
}

let pasoIzquierdo=0
let pasoDerecho=0
function correr(algo) {
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
        posicionJugador+=5
        pasoIzquierdo=1
        pasoDerecho=0
    }
}

function darPasoDerecho() {
    if (pasoDerecho==0) {
        posicionJugador+=5
        pasoDerecho=1
        pasoIzquierdo=0
    }
}

let pasoRival1=0
let pasoRival2=0
function moverRival1() {
    posicionRival1 += 5
    pasoRival1++
}

function moverRival2() {
    posicionRival2 += 5
    pasoRival2++
}

function victoria() {
    clearInterval(intervalo)
    clearInterval(velocidadRival1)
    clearInterval(velocidadRival2)
    
    
    
    if (posicionJugador>posicionRival1&&posicionJugador>posicionRival2) {
        spanMensaje.innerHTML='Ganaste !! Si oprimes el boton pasaras al siguiente nivel'
        nivel++
        dificultad=dificultad-10
    }if (posicionRival1>=posicionJugador||posicionRival2>=posicionJugador) {
        spanMensaje.innerHTML='Perdiste.. Si oprimes el boton podras intentarlo de nuevo'

    }

    posicionRival1=90
    posicionJugador=50
    posicionRival2=10

    seccionMensaje.style.display='flex'
    seccionLargada.style.display='none'


}

