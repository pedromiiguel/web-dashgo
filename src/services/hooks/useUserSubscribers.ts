import { useQuery } from 'react-query';
import { api } from '../apiClient';
import dayjs from 'dayjs';

export interface Count {
  [key: string]: number;
}

export async function getUserSubscribers(): Promise<number[]> {
  const { data } = await api.get('/user/count');

  const weekDays = [...Array(8)].map((_, index) =>
    dayjs().subtract(index, 'day').toDate().getTime()
  );

  const subscribersWeek = weekDays.reduce((acc, item) => {
    const formattedDate = dayjs(item).format('DD/MM/YYYY');

    const existingDate = data?.subscribersWeek.find(
      (obj: { [key: string]: number }) => {
        const date = Object.keys(obj)[0];

        return date === formattedDate;
      }
    );

    if (existingDate) {
      const date = Object.keys(existingDate)[0];
      const count = Object.values(existingDate)[0];

      acc.push({ [String(date)]: Number(count) });
    } else {
      acc.push({ [String(formattedDate)]: 0 });
    }

    return acc;
  }, [] as Count[]);

  const values = subscribersWeek.map((obj) => {
    const [value] = Object.values(obj);

    return value;
  });

  return values;
}

export function useUserSubscribers(options?: any) {
  return useQuery(['userSubscribers'], () => getUserSubscribers(), {
    staleTime: 1000 * 60 * 10,
    refetchOnWindowFocus: false,
    ...options
  });
}
