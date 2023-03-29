import { ROUTES } from '@/constants/routes';
import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';
import { parseCookies } from 'nookies';

export function withSSRGuest<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (cookies['dashgo.token']) {
      return {
        redirect: {
          destination: ROUTES.DASHBOARD,
          permanent: false
        }
      };
    }

    return await fn(ctx);
  };
}
