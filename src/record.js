/**
 * RECORD PERSISTENTE (localStorage)
 *
 * Nivel maximo alcanzado y mejor tiempo, con validacion defensiva:
 * JSON corrupto, storage bloqueado o datos invalidos -> se trata como "sin record".
 */

import { elementoRecord } from './dom.js';

const CLAVE_RECORD = 'record';

//LEE Y VALIDA: JSON corrupto, storage bloqueado o datos invalidos -> null (sin record)
export function leerRecord() {
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
export function guardarNivelAlcanzado(nivelAlcanzado) {
    const r = leerRecord() || {};
    if (!Number.isFinite(r.nivelMax) || nivelAlcanzado > r.nivelMax) {
        r.nivelMax = nivelAlcanzado;
        guardarRecord(r);
    }
}

//MEJOR TIEMPO: se guarda en CADA fin de carrera (victoria o derrota), conservando el minimo
export function guardarTiempo(duracion) {
    const r = leerRecord() || {};
    if (!Number.isFinite(r.mejorTiempo) || duracion < r.mejorTiempo) {
        r.mejorTiempo = Math.round(duracion);
        guardarRecord(r);
    }
}

//TEXTO DEL RECORD PARA LA INTRO
export function pintarRecord() {
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
