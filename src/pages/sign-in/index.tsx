import type { NextPage } from 'next';
import React from 'react';
import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { setCookie } from 'nookies';
import { Input } from '@/components';
import { api } from '@/services/apiClient';
import { login } from '@/store/User/User.actions';
import { withSSRGuest } from '@/utils/withSSRGuest';
import { ROUTES } from '@/constants/routes';
import * as yup from 'yup';

import AuthTemplate from '@/templates/Auth';
import { ONE_DAY } from '@/constants/day';

type SignInFormData = {
  email: string;
  password: string;
};

export const signInFormschema = yup
  .object({
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória')
  })
  .required();

const SignIn: NextPage = () => {
  const dispatch = useDispatch();

  const form = useForm<SignInFormData>({
    resolver: yupResolver(signInFormschema)
  });

  const toast = useToast();
  const router = useRouter();

  const handleSignIn: SubmitHandler<SignInFormData> = async (values) => {
    try {
      const { data } = await api.post('/login', values);

      setCookie(undefined, 'dashgo.token', data.token, {
        maxAge: ONE_DAY,
        path: ROUTES.DASHBOARD
      });

      setCookie(undefined, 'dashgo.refreshToken', data.refreshToken);

      api.defaults.headers['Authorization'] = `Bearer ${data.token}`;

      dispatch(login(data.user));

      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      toast({
        position: 'top-right',
        description: error.response.data.message,
        status: 'error',
        duration: 9000,
        isClosable: true
      });
    }
  };

  return (
    <>
      <AuthTemplate title="Login" description="Dashgo um dashboard para todos">
        <FormProvider {...form}>
          <Flex
            as="form"
            onSubmit={form.handleSubmit(handleSignIn)}
            flexDir="column"
            width="100%"
          >
            <Stack spacing={2}>
              <Input
                name="email"
                type="email"
                label="E-mail"
                placeholder="Digite seu e-mail"
                error={form.formState.errors.email}
              />
              <Input
                name="password"
                type="password"
                error={form.formState.errors.password}
                label="Senha"
                placeholder="Digite sua senha"
              />

              <Link href={ROUTES.FORGOT_PASSWORD} passHref>
                <Text
                  as="a"
                  textAlign="right"
                  cursor="pointer"
                  _hover={{
                    color: 'pink.500'
                  }}
                >
                  Esqueceu sua senha?
                </Text>
              </Link>
            </Stack>

            <Button
              type="submit"
              mt="6"
              colorScheme="pink"
              size="lg"
              isLoading={form.formState.isSubmitting}
            >
              Entrar
            </Button>
            <Text textAlign="center" mt={4}>
              Ainda não fez cadastro?{' '}
              <Link href={ROUTES.SIGN_UP} passHref>
                <Text as="a" color="pink.500" textDecoration="underline">
                  Cadastre-se
                </Text>
              </Link>
            </Text>
          </Flex>
        </FormProvider>
      </AuthTemplate>
    </>
  );
};

export default SignIn;

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {}
  };
});
