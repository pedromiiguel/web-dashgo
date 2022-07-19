import type { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Button, Flex, Stack } from '@chakra-ui/react';
import { Input } from '../components/Form/Input';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { parseCookies, setCookie } from 'nookies';

import { api } from '../services/apiClient';
import { useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { login } from '../store/User/User.actions';
import { withSSRGuest } from '../utils/withSSRGuest';

type SignInFormData = {
  email: string;
  password: string;
};

const signInFormschema = yup
  .object({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória'),
  })
  .required();

const SignIn: NextPage = () => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(signInFormschema) });

  const toast = useToast();

  const router = useRouter();

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    try {
      const { data } = await api.post('/login', values);

      setCookie(undefined, 'dashgo.token', data.token, {
        maxAge: 60 * 60 * 24 * 30, //30 days
        path: '/',
      });
      setCookie(undefined, 'dashgo.refreshToken', data.refreshToken.id);

      //@ts-ignore
      api.defaults.headers['Authorization'] = `Bearer ${data.token}`;

      dispatch(login(data.user));

      router.push('/dashboard');
    } catch (err: any) {
      console.log(err);
      toast({
        position: 'top-right',
        description: err.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Head>
        <title>Dashgo</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex w="100vw" h="100vh" align="center" justify="center">
        <Flex
          onSubmit={handleSubmit(handleSignIn)}
          as="form"
          w="100%"
          maxWidth={360}
          bg="gray.800"
          p="8"
          borderRadius={8}
          flexDir="column"
        >
          <Stack spacing={4}>
            <Input
              name="email"
              type="email"
              label="E-mail"
              placeholder="Digite seu e-mail"
              error={errors.email}
              register={{
                ...register('email'),
              }}
            />
            <Input
              name="password"
              type="password"
              error={errors.password}
              label="Senha"
              placeholder="Digite sua senha"
              register={{
                ...register('password'),
              }}
            />
          </Stack>

          <Button
            type="submit"
            mt="6"
            colorScheme="pink"
            size="lg"
            isLoading={isSubmitting}
          >
            Entrar
          </Button>
        </Flex>
      </Flex>
    </>
  );
};

export default SignIn;

export const getServerSideProps = withSSRGuest(async (ctx) => {
  return {
    props: {},
  };
});