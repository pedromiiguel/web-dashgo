import { useQuery } from 'react-query';
import { formatBRDate } from '../../utils/formatBRDate';
import { formatCurrency } from '../../utils/formatCurrency';
import { api } from '../apiClient';

type Product = {
  id: string;
  name: string;
  price: string;
  createdAt: Date;
  userId: string;
  user: {
    name: string;
  };
};

type GetUsersResponse = {
  totalCount: number;
  products: Product[];
};

export async function getProducts(page: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get('product', {
    params: { page, limit: 5 }
  });

  const totalCount = Number(headers['x-total-count']);

  const products = data?.products.map((product: Product) => ({
    ...product,
    createdAt: formatBRDate(product.createdAt),
    price: formatCurrency(+product.price)
  }));

  return { products, totalCount };
}

export function useGetProducts(page: number) {
  return useQuery(['products', page], () => getProducts(page), {
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });
}
