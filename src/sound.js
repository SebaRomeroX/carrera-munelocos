/**
 * SONIDO (WebAudio, sin archivos de audio)
 *
 * Autocontenido: crea su contexto en el primer gesto del usuario (politica de autoplay)
 * y adjunta sus propios listeners. Exporta las functions que usan game.js.
 */

import { botonSonido } from './dom.js';

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
export function sonarPaso(izquierda) {
    tono({ frecuencia: izquierda ? 880 : 988, duracion: 0.05, tipo: 'square', volumen: 0.25 });
}

//CUENTA REGRESIVA: beeps 3-2-1 (Do5) y tono mas agudo y largo en "¡YA!" (Do6)
export function sonarCuenta(indice) {
    if (indice <= 2) {
        tono({ frecuencia: 523, duracion: 0.12, tipo: 'square', volumen: 0.7 });
    } else {
        tono({ frecuencia: 1047, duracion: 0.25, tipo: 'square', volumen: 0.7 });
    }
}

//VICTORIA: fanfarria en arpegio Do5-Mi5-Sol5-Do6
export function fanfarria() {
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
export function sonarDerrota() {
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
