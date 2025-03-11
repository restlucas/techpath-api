"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.startOfWeek = startOfWeek;
// Função auxiliar para calcular o início da semana com base no "weekStartsOn"
function startOfWeek(date, weekStartsOn = 1) {
    const result = new Date(date); // Cria uma nova data para evitar mutações
    const day = result.getDay(); // Retorna o dia da semana (0=Domingo, 1=Segunda, ..., 6=Sábado)
    // Calcula a diferença entre o dia atual e o dia de início da semana
    const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
    // Ajusta a data para o início da semana (ajusta o dia conforme a diferença calculada)
    result.setDate(result.getDate() - diff);
    result.setHours(0, 0, 0, 0); // Reseta para meia-noite
    return result;
}
