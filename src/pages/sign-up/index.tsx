import type { NextPage } from 'next';
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { Button, Flex, Stack, Text, useToast } from '@chakra-ui/react';
import { Input } from '@/components';
import { yupResolver } from '@hookform/resolvers/yup';
import { api } from '@/services/apiClient';
import { withSSRGuest } from '@/utils/withSSRGuest';
import { ROUTES } from '@/constants/routes';
import * as yup from 'yup';
import AuthTemplate from '@/templates/Auth';

type SignUpFormData = {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
};

export const signUpFormSchema = yup
  .object({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória'),
    confirm_password: yup
      .string()
      .required('Confimação de senha obrigatória')
      .oneOf([yup.ref('password')], 'As senhas não conferem')
  })
  .required();

const SignUp: NextPage = () => {
  const form = useForm<SignUpFormData>({
    resolver: yupResolver(signUpFormSchema)
  });

  const toast = useToast();
  const router = useRouter();

  const handleSignIn: SubmitHandler<SignUpFormData> = async (values) => {
    try {
      await api.post('/user', {
        name: values.name,
        password: values.password,
        email: values.email
      });

      toast({
        position: 'top-right',
        description: 'Usuário criado com sucesso!',
        status: 'success',
        duration: 9000,
        isClosable: true
      });

      router.push(ROUTES.SIGN_IN);
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
      <AuthTemplate title="Sign Up" description="Crie sua conta no Dashgo">
        <FormProvider {...form}>
          <Flex
            onSubmit={form.handleSubmit(handleSignIn)}
            as="form"
            flexDir="column"
            width="100%"
          >
            <Stack spacing={2}>
              <Input
                name="name"
                type="text"
                label="Nome"
                placeholder="Digite seu nome"
                error={form.formState.errors.name}
              />
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
              <Input
                name="confirm_password"
                type="password"
                error={form.formState.errors.confirm_password}
                label="Confirme sua senha"
                placeholder="Digite sua senha"
              />
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
              Já se cadastrou no Dashgo?{' '}
              <Link href="/sign-in" passHref>
                <Text as="a" color="pink.500" textDecoration="underline">
                  Cadastrar
                </Text>
              </Link>
            </Text>
          </Flex>
        </FormProvider>
      </AuthTemplate>
    </>
  );
};

export default SignUp;

export const getServerSideProps = withSSRGuest(async () => {
  return {
    props: {}
  };
});
