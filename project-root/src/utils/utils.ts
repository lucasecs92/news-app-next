export function timeSince(date: string | Date): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `Há ${interval} anos`;

  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `Há ${interval} meses`;

  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `Há ${interval} dias`;

  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `Há ${interval} horas`;

  interval = Math.floor(seconds / 60);
  if (interval > 1) return `Há ${interval} minutos`;

  return `Há ${Math.floor(seconds)} segundos`;
}

export function displayError(message: string): string {
  console.error(message);
  return message;
}
