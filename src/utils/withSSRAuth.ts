import {
  GetServerSideProps,
  GetServerSidePropsContext,
  GetServerSidePropsResult
} from 'next';
import { destroyCookie, parseCookies } from 'nookies';
import { AuthTokenError } from '../errors/AuthTokenError';

export function withSSRAuth<P extends { [key: string]: any }>(
  fn: GetServerSideProps<P>
) {
  return async (
    ctx: GetServerSidePropsContext
  ): Promise<GetServerSidePropsResult<P>> => {
    const cookies = parseCookies(ctx);

    if (!cookies['dashgo.token']) {
      return {
        redirect: {
          destination: '/sign-in',
          permanent: false
        }
      };
    }

    try {
      return await fn(ctx);
    } catch (err) {
      if (err instanceof AuthTokenError) {
        destroyCookie(ctx, 'dashgo.token');
        destroyCookie(ctx, 'dashgo.refreshToken');

        return {
          redirect: {
            destination: '/',
            permanent: false
          }
        };
      }

      // declaração de retorno padrão
      return {
        notFound: true
      };
    }
  };
}
