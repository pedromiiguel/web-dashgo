export const formatBRDate = (date: Date) => {
  if (!date) {
    return;
  }

  const formattedDate = new Date(date).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });

  return formattedDate;
};
