import { ChangeEvent } from 'react';
import { formatCurrency } from './formatCurrency';

export const currency = (event: ChangeEvent<HTMLInputElement>) => {
  return (event.target.value = formatCurrency(
    +event.target.value.replace(/\D/g, '') / 100
  ));
};

export const removeCurrencyMask = (currency: string) => {
  const value = Number(currency.replace(/\D/g, '')) / 100;

  return value;
};
