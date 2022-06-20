import axios, { AxiosError } from 'axios';
import Router from 'next/router';
import { AuthTokenError } from '../errors/AuthTokenError'
import { destroyCookie, parseCookies, setCookie } from 'nookies';

let failedRequestQueue = [] as any;
let isRefreshing = false;

export function setupAPIClient(ctx= null) {
  let cookies = parseCookies(ctx);


  const api = axios.create({
    baseURL: 'http://localhost:3131',
    headers: {
      Authorization: `Bearer ${cookies['dashgo.token']}`,
    },
  });

  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error: AxiosError) => {
      if (error?.response?.status === 401) {
        if (error?.response?.data?.message === 'Token invalid') {
          cookies = parseCookies(ctx);
         
          const { 'dashgo.refreshToken': refreshToken } = cookies;
          const originalConfig = error.config;

          if (!isRefreshing) {
            isRefreshing = true;
            api
              .post('/refresh-token', { refresh_token: refreshToken })
              .then((response) => {
                const { token } = response.data;

                setCookie(undefined, 'dashgo.token', token, {
                  maxAge: 60 * 60 * 24 * 30, //30 days
                  path: '/',
                });
                setCookie(
                  undefined,
                  'dashgo.refreshToken',
                  response.data.refreshToken.id
                );

                //@ts-ignore
                api.defaults.headers['Authorization'] = `Bearer ${token}`;
                //@ts-ignore
                failedRequestQueue.forEach((request) =>
                  request.onSuccess(token)
                );
                failedRequestQueue = [];
              })
              .catch((err) => {
                //@ts-ignore
                failedRequestQueue.forEach((request) => request.onFailure(err));
                failedRequestQueue = [];

                destroyCookie(ctx, 'dashgo.token');
                destroyCookie(ctx, 'dashgo.refreshToken');
                if (process.browser) {
                  Router.push('/');
                }
              })
              .finally(() => {
                isRefreshing = false;
              });
          }

          return new Promise((resolve, reject) => {
            failedRequestQueue.push({
              onSuccess: (token: string) => {
                //@ts-ignore
                originalConfig.headers['Authorization'] = `Bearer ${token}`;

                resolve(api(originalConfig));
              },
              onFailure: (err: AxiosError) => {
                reject(err);
              },
            });
          });
        } else {
          destroyCookie(ctx, 'dashgo.token');
          destroyCookie(ctx, 'dashgo.refreshToken');
          if (process.browser) {
            Router.push('/');
          }else {
            return Promise.reject(new AuthTokenError())
          }
        }
      }
      return Promise.reject(error);
    }
  );

  return api;
}
