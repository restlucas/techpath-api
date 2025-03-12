"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfWeek = startOfWeek;
function startOfWeek(date, weekStartsOn = 1) {
    const result = new Date(date); // Cria uma nova data para evitar mutações
    // Converte a data local para UTC
    const utcDate = new Date(result.toISOString());
    const day = utcDate.getUTCDay(); // Retorna o dia da semana em UTC (0=Domingo, 1=Segunda, ..., 6=Sábado)
    // Calcula a diferença entre o dia atual e o dia de início da semana
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    // Ajusta a data para o início da semana em UTC
    utcDate.setUTCDate(utcDate.getUTCDate() - diff);
    utcDate.setUTCHours(0, 0, 0, 0); // Reseta para meia-noite (UTC)
    return utcDate; // Retorna a data em UTC
}
