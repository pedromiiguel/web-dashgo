export const formatCurrency = (price: number) =>
  new Intl.NumberFormat('pt-Br', { style: 'currency', currency: 'BRL' }).format(
    price
  );
