import { useQuery } from 'react-query';
import { api } from '../apiClient';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export async function getUser(id: string): Promise<User> {
  const { data } = await api.get(`user/${id}`);

  return data;
}

export function useUser(id: string) {
  return useQuery(['users', id], () => getUser(id), {
    // staleTime: 1000 * 60 * 10,
  });
}
