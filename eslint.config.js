'use strict';

const js = require('@eslint/js');
const globals = require('globals');

// Config plana (flat config): reglas que atrapan los problemas historicos
// del proyecto (p. ej. no-undef habria detectado los globals implicitos del item 3).
module.exports = [
    {
        ignores: ['node_modules/', 'dist/'],
    },

    js.configs.recommended,

    {
        files: ['**/*.js'],
        languageOptions: {
            ecmaVersion: 2022,
            // carrera.js es un script clasico, no un modulo
            sourceType: 'script',
            globals: {
                ...globals.browser,
                // provisto por nucleo.js (script cargado antes que carrera.js en index.html)
                Nucleo: 'readonly',
            },
        },
        rules: {
            // variables declaradas pero nunca usadas
            'no-unused-vars': ['error', { args: 'none', caughtErrors: 'none' }],
        },
    },

    // este archivo se ejecuta en node, no en el navegador
    {
        files: ['eslint.config.js'],
        languageOptions: {
            sourceType: 'commonjs',
            globals: {
                ...globals.node,
            },
        },
    },

    // los tests usan import/export de vitest
    {
        files: ['tests/**/*.js'],
        languageOptions: {
            sourceType: 'module',
        },
    },
];
