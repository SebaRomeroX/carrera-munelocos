// Tests del nucleo puro (sin DOM): fisica, ganador, sorteo de muñecos y rachas de los bots
import { describe, it, expect } from 'vitest';
import '../nucleo.js';

const N = globalThis.Nucleo;

// PRNG con semilla para asserts deterministas
function mulberry32(semilla) {
    return function () {
        semilla |= 0;
        semilla = (semilla + 0x6d2b79f5) | 0;
        let t = Math.imul(semilla ^ (semilla >>> 15), 1 | semilla);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

describe('determinarGanador', () => {
    it('gana el que esta estrictamente primero', () => {
        expect(N.determinarGanador(300, 100, 200)).toBe('jugador');
        expect(N.determinarGanador(100, 300, 200)).toBe('rival1');
        expect(N.determinarGanador(100, 200, 300)).toBe('rival2');
    });

    it('cualquier empate -> "empate" (nadie gana con igualdad)', () => {
        expect(N.determinarGanador(200, 200, 200)).toBe('empate'); //los tres igual
        expect(N.determinarGanador(200, 200, 100)).toBe('empate'); //empate parcial arriba
        expect(N.determinarGanador(100, 200, 200)).toBe('empate'); //empate parcial abajo
    });

    it('1000 casos aleatorios coinciden con un argmax de referencia', () => {
        for (let i = 0; i < 1000; i++) {
            const j = Math.random() * 1000;
            const r1 = Math.random() * 1000;
            const r2 = Math.random() * 1000;
            const max = Math.max(j, r1, r2);
            const arriba = [j, r1, r2].filter((p) => p === max).length;
            const esperado = arriba > 1 ? 'empate' : j === max ? 'jugador' : r1 === max ? 'rival1' : 'rival2';
            expect(N.determinarGanador(j, r1, r2)).toBe(esperado);
        }
    });
});

describe('calcularVelocidadBot', () => {
    it('nivel 1 sin jitter = velocidad base', () => {
        expect(N.calcularVelocidadBot(1, N.BASE_RIVAL1, N.DELTA_RIVAL1)).toBe(125);
        expect(N.calcularVelocidadBot(1, N.BASE_RIVAL2, N.DELTA_RIVAL2)).toBe(150);
    });

    it('cada nivel es un poco mas rapido (resta delta)', () => {
        //nivel 5: 125 - 4 * 1.2 = 120.2
        expect(N.calcularVelocidadBot(5, N.BASE_RIVAL1, N.DELTA_RIVAL1)).toBeCloseTo(120.2, 5);
    });

    it('nunca baja de INTERVALO_MIN: el nivel siempre es ganable', () => {
        for (const nivel of [1, 10, 20, 100, 1000]) {
            for (let jitter = -4; jitter <= 4; jitter++) {
                const ms1 = N.calcularVelocidadBot(nivel, N.BASE_RIVAL1, N.DELTA_RIVAL1, jitter);
                const ms2 = N.calcularVelocidadBot(nivel, N.BASE_RIVAL2, N.DELTA_RIVAL2, jitter);
                expect(ms1).toBeGreaterThanOrEqual(N.INTERVALO_MIN);
                expect(ms2).toBeGreaterThanOrEqual(N.INTERVALO_MIN);
            }
        }
        //el techo exacto con un nivel absurdamente alto
        expect(N.calcularVelocidadBot(100000, N.BASE_RIVAL2, N.DELTA_RIVAL2, -4)).toBe(N.INTERVALO_MIN);
    });
});

describe('elegirColoresRivales', () => {
    it('1000 sorteos: siempre 3 muñecos distintos (1..5) y rivales != jugador', () => {
        for (let jugador = 1; jugador <= 5; jugador++) {
            for (let i = 0; i < 200; i++) {
                const { rival1, rival2 } = N.elegirColoresRivales(jugador);
                expect([rival1, rival2]).not.toContain(jugador);
                expect(rival1).not.toBe(rival2);
                for (const c of [rival1, rival2]) {
                    expect(c).toBeGreaterThanOrEqual(1);
                    expect(c).toBeLessThanOrEqual(5);
                }
            }
        }
    });

    it('con rand inyectado es determinista', () => {
        const a = N.elegirColoresRivales(3, mulberry32(42));
        const b = N.elegirColoresRivales(3, mulberry32(42));
        expect(a).toEqual(b);
        expect([a.rival1, a.rival2]).not.toContain(3);
    });
});

describe('elegirBot (modo 2 jugadores)', () => {
    it('nunca repite un muñeco humano', () => {
        for (let i = 0; i < 200; i++) {
            const bot = N.elegirBot([1, 4]);
            expect([1, 4]).not.toContain(bot);
            expect(bot).toBeGreaterThanOrEqual(1);
            expect(bot).toBeLessThanOrEqual(5);
        }
    });

    it('con 4 muñecos tomados solo queda el quinto', () => {
        expect(N.elegirBot([1, 2, 3, 4], mulberry32(7))).toBe(5);
    });
});

describe('elegirModoRival (rachas de los bots)', () => {
    const rangos = {
        0.7: [400, 900], //SPRINT
        3.0: [250, 550], //PAUSA (duda)
        1.0: [700, 1500], //NORMAL
    };

    it('elige sprint / pausa / normal segun el azar', () => {
        expect(N.elegirModoRival(() => 0.1).escala).toBe(0.7);
        expect(N.elegirModoRival(() => 0.29).escala).toBe(3.0);
        expect(N.elegirModoRival(() => 0.5).escala).toBe(1.0);
        expect(N.elegirModoRival(() => 0.99).escala).toBe(1.0);
    });

    it('la duracion siempre queda en el rango de su modo (1000 sorteos)', () => {
        for (let i = 0; i < 1000; i++) {
            const modo = N.elegirModoRival();
            const [min, max] = rangos[modo.escala];
            expect(modo.dur).toBeGreaterThanOrEqual(min);
            expect(modo.dur).toBeLessThanOrEqual(max);
        }
    });
});

describe('moverCorredor y aleatorio', () => {
    it('avanza la fraccion PASO de la unidad de la calle', () => {
        expect(N.PASO).toBe(0.05);
        expect(N.moverCorredor(100, 120)).toBe(106);
        expect(N.moverCorredor(0, 1000)).toBe(50);
    });

    it('aleatorio con rand inyectado respeta los limites', () => {
        expect(N.aleatorio(400, 900, () => 0)).toBe(400);
        expect(N.aleatorio(400, 900, () => 0.999999)).toBe(900);
        for (let i = 0; i < 100; i++) {
            const v = N.aleatorio(-4, 4);
            expect(v).toBeGreaterThanOrEqual(-4);
            expect(v).toBeLessThanOrEqual(4);
        }
    });
});
