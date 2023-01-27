const escenario = document.getElementById('canvas')
const lienzo = escenario.getContext('2d')

const imagenFondo = new Image()
imagenFondo.src = './imagenes/fondo3.png'
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

const botonInicio = document.getElementById('inicio')

window.addEventListener('load',iniciarJuego)
function iniciarJuego() {
    dibujar()
    intervalo =setInterval(dibujar,50)
    
    document.addEventListener('keyup',correr)
    botonInicio.addEventListener('click',iniciarCarrera)
}

function dibujar() {
    lienzo.drawImage(
        imagenFondo,
        0,
        0,
        escenario.width,
        escenario.height
    )
    
    let imagenRival1
    if (validadcionInicio==false) {
        imagenRival1=muñecoAzul
    } else if (pasoRival1%2==0) {
        imagenRival1=muñecoAzulIzquierda
    } else if (pasoRival1%2!==0) {
        imagenRival1=muñecoAzulDerecha
    }  
    lienzo.drawImage(
        imagenRival1,
        posicionRival1+80,
        alturaImagenFondo*4/5-80-alturaImagenMuñequito/2,
        anchoImagenMuñequito,
        alturaImagenMuñequito
    )

    let imagenJugador
    if (pasoIzquierdo==1) {
        imagenJugador=muñecoRojoIzquierda
    } else if (pasoDerecho==1) {
        imagenJugador=muñecoRojoDerecha
    } else {
        imagenJugador=muñecoRojo
    }       
    lienzo.drawImage(
        imagenJugador,
        posicionJugador+40,
        alturaImagenFondo*4/5-40-alturaImagenMuñequito/2,
        anchoImagenMuñequito,
        alturaImagenMuñequito
    )

    let imagenRival2=muñecoVerde
    if (validadcionInicio==false) {
        imagenRival1=muñecoVerde
    }else if (pasoRival2%2!==0) {
        imagenRival2=muñecoVerdeIzquierda
    } else if (pasoRival2%2==0) {
        imagenRival2=muñecoVerdeDerecha
    }
    lienzo.drawImage(
        imagenRival2,
        posicionRival2,
        alturaImagenFondo*4/5-alturaImagenMuñequito/2,
        anchoImagenMuñequito,
        alturaImagenMuñequito
    )

    if (posicionJugador>=anchoImagenFondo-anchoImagenMuñequito||
        posicionRival1>=anchoImagenFondo-anchoImagenMuñequito||
        posicionRival2>=anchoImagenFondo-anchoImagenMuñequito) {
        victoria()
    }
}

let validadcionInicio
function iniciarCarrera() {
    let velocidadRival1 =setInterval(moverRival1,150)
    let velocidadRival2 =setInterval(moverRival2,160)
    validadcionInicio=true
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
    
    console.log('corre')
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

    if (posicionJugador>=anchoImagenFondo-anchoImagenMuñequito) {
        alert('Ganaste')
    }if (posicionRival1>=anchoImagenFondo-anchoImagenMuñequito) {
        alert('Perdiste')
    }

}

