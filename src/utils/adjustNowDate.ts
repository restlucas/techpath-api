export function adjustNowDate(): Date {
  const date = new Date();
  // Obtém o fuso horário do servidor em minutos
  const serverOffset = date.getTimezoneOffset() / 60; // Ex: -180 para UTC-3

  // Cria uma nova data para evitar mutações
  const result = new Date(date);

  // Se o fuso horário não for UTC-3 (Brasil), ajusta para UTC-3
  if (serverOffset !== -3) {
    result.setHours(result.getHours() + 3); // Ajuste do fuso horário para UTC-3
  }

  return result; // Retorna a data ajustada
}
