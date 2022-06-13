"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.missingErrorType = exports.wrongFirmId = exports.noFromDate = exports.noMatches = void 0;
exports.noMatches = 'No existen gestorías con estos parámetros.';
exports.noFromDate = 'No se ha especificado parametro "from" para pagination.';
const wrongFirmId = (id) => `No se ha encontrado ninguna firma con id: ${id}.`;
exports.wrongFirmId = wrongFirmId;
exports.missingErrorType = 'No se ha especificado el campo "type" en el body. El campo "type" ayuda a describir el tipo de plan de precios.';
