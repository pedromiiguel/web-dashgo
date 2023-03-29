import { useQuery } from 'react-query';
import { formatBRDate } from '../../utils/formatBRDate';
import { api } from '../apiClient';

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

type GetUsersResponse = {
  totalCount: number;
  users: User[];
};

export async function getUsers(page: number): Promise<GetUsersResponse> {
  const { data, headers } = await api.get('user', {
    params: { page, limit: 5 }
  });

  const totalCount = Number(headers['x-total-count']);

  const users = data?.users.map((user: User) => {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: formatBRDate(user.createdAt)
    };
  });

  return { users, totalCount };
}

export function useUsers(page: number) {
  return useQuery(['users', page], () => getUsers(page), {
    // staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false
  });
}
