export function startOfWeek(date: Date): Date {
  const result = new Date(date); // Cria uma nova data para evitar mutações

  // Converte a data local para UTC
  const utcDate = new Date(result.toISOString());

  const day = utcDate.getUTCDay(); // Retorna o dia da semana em UTC (0=Domingo, 1=Segunda, ..., 6=Sábado)

  // Calcula a diferença entre o dia atual e o dia de início da semana
  const diff = (day < 1 ? 7 : 0) + day - 1;

  // Ajusta a data para o início da semana em UTC
  utcDate.setUTCDate(utcDate.getUTCDate() - diff);
  utcDate.setUTCHours(0, 0, 0, 0); // Reseta para meia-noite (UTC)

  // Detecta o fuso horário do servidor em relação ao UTC
  const serverOffset = new Date().getTimezoneOffset() / 60; // Retorna o offset em horas (-180 para UTC-3, por exemplo)

  // Se o fuso horário do servidor não for UTC-3 (Brasil), ajusta para UTC-3
  if (serverOffset !== -3) {
    utcDate.setHours(utcDate.getHours() + 3); // Ajuste do fuso horário para UTC-3
  }

  return utcDate; // Retorna a data ajustada para o fuso horário desejado
}
