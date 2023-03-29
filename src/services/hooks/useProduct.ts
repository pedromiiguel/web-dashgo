import { useQuery } from 'react-query';
import { formatCurrency } from '@/utils/formatCurrency';
import { api } from '../apiClient';

type Product = {
  name: string;
  price: string;
};

export async function getProduct(id: string): Promise<Product> {
  const { data } = await api.get<Product>(`/product/${id}`);

  const product = {
    name: data.name,
    price: formatCurrency(Number(data.price))
  };

  return product;
}

export function useProduct(id: string, options: any) {
  return useQuery(['product', id], () => getProduct(id), {
    ...options,
    refetchOnWindowFocus: false
  });
}
