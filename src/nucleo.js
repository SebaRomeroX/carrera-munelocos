/**
 * NUCLEO PURO DEL JUEGO
 *
 * Logica sin DOM ni canvas: velocidades, ganador, eleccion de rivales y rachas de los bots.
 * ES module sin dependencias: lo importan game.js y state.js.
 */

/* -- TUNING DE DIFICULTAD (ms de intervalo por rival; menor = mas rapido) -- */

//techo de velocidad: nunca mas rapido que esto (el nivel siempre es ganable)
export const INTERVALO_MIN = 55;

//ms por paso en nivel 1
export const BASE_RIVAL1 = 125;
export const BASE_RIVAL2 = 150;

//ms mas rapido por nivel (rival2 es un poco mas agresivo)
export const DELTA_RIVAL1 = 1.2;
export const DELTA_RIVAL2 = 2.5;

//fraccion de la unidad de la calle que avanza un corredor por paso
export const PASO = 0.05;

/* -- FISICA DE LOS CORREDORES -- */

//MOVER UN CORREDOR: un paso de la fraccion PASO de la unidad
export function moverCorredor(posicion, unidad) {
    return posicion + unidad * PASO;
}

//VELOCIDAD DE UN BOT EN UN NIVEL DADO (nunca baja de INTERVALO_MIN)
export function calcularVelocidadBot(nivel, base, delta, jitter = 0) {
    return Math.max(INTERVALO_MIN, base - (nivel - 1) * delta + jitter);
}

//GANADOR: gana quien esta estrictamente primero; cualquier empate -> 'empate'
//la meta es la misma para los tres: comparar posiciones alcanza
export function determinarGanador(posicionJugador, posicionRival1, posicionRival2) {
    if (posicionJugador > posicionRival1 && posicionJugador > posicionRival2) {
        return 'jugador';
    }
    if (posicionRival1 > posicionJugador && posicionRival1 > posicionRival2) {
        return 'rival1';
    }
    if (posicionRival2 > posicionJugador && posicionRival2 > posicionRival1) {
        return 'rival2';
    }
    return 'empate';
}

/* -- SORTEO DE MUÑECOS -- */

//ALEATORIO ENTERO ENTRE [min, max] (rand inyectable para tests)
export function aleatorio(min, max, rand = Math.random) {
    return Math.floor(rand() * (max - min + 1) + min);
}

//FISHER-YATES: copia del arreglo en orden aleatorio
export function mezclar(colores, rand = Math.random) {
    const resultado = colores.slice();
    for (let i = resultado.length - 1; i > 0; i--) {
        const j = Math.floor(rand() * (i + 1));
        [resultado[i], resultado[j]] = [resultado[j], resultado[i]];
    }
    return resultado;
}

//LOS 5 COLORES DE MUÑECOS POSIBLES
const TODOS_LOS_COLORES = [1, 2, 3, 4, 5];

//RIVALES DEL MODO 1 JUGADOR: 3 muñecos distintos (shuffle, sin recursion aleatoria)
export function elegirColoresRivales(jugador, rand = Math.random) {
    const libres = mezclar(TODOS_LOS_COLORES, rand).filter((c) => c !== jugador);
    return { rival1: libres[0], rival2: libres[1] };
}

//BOT DEL MODO 2 JUGADORES: un muñeco distinto de los humanos ya tomados
export function elegirBot(tomados, rand = Math.random) {
    return mezclar(TODOS_LOS_COLORES, rand).find((c) => !tomados.includes(c));
}

/* -- RACHAS DE LOS BOTS -- */

//sprint / pausa / normal, conservando la velocidad media
export function elegirModoRival(rand = Math.random) {
    const r = rand();
    if (r < 0.15) {
        return { escala: 0.7, dur: aleatorio(400, 900, rand) }; //SPRINT
    }
    if (r < 0.3) {
        return { escala: 3.0, dur: aleatorio(250, 550, rand) }; //PAUSA (duda)
    }
    return { escala: 1.0, dur: aleatorio(700, 1500, rand) }; //NORMAL
}
