import { useQuery } from 'react-query';
import { api } from '../apiClient';

type User = {
  name: string;
  email: string;
};

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get(`user/${id}`);

  return data;
}

export function useUser(id: string, options: any) {
  return useQuery(['user', id], () => getUser(id), {
    // staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    ...options
  });
}
