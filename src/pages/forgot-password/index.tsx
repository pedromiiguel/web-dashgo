import { Button, Flex, Heading, Stack, Text } from '@chakra-ui/react';
import { NextPage } from 'next';

import { useForm, FormProvider } from 'react-hook-form';
import React from 'react';
import { Input } from '@/components';
import AuthTemplate from '@/templates/Auth';
import { useMutation } from 'react-query';
import { api } from '@/services/apiClient';
import { useRouter } from 'next/router';
import { ROUTES } from '@/constants/routes';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

interface ForgotPasswordFormData {
  email: string;
}

export const forgotPasswordSchema = yup
  .object({
    email: yup
      .string()
      .required('E-mail obrigatório')
      .email('Digite um e-mail válido')
  })
  .required();

const ForgotPassword: NextPage = () => {
  const form = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(forgotPasswordSchema)
  });
  const router = useRouter();

  const { mutateAsync } = useMutation((data: ForgotPasswordFormData) =>
    api.post('/forgot-password', data)
  );

  const handleForgotPassword = async (values: ForgotPasswordFormData) => {
    console.log(values);
    await mutateAsync(values);

    router.push(ROUTES.LOGIN);
  };

  console.log(form.formState.errors);
  return (
    <AuthTemplate
      title="Forgot Password"
      description="Recupere sua senha do Dashgo"
    >
      <FormProvider {...form}>
        <Flex
          onSubmit={form.handleSubmit(handleForgotPassword)}
          as="form"
          flexDir="column"
          width="100%"
        >
          <Stack spacing={6}>
            <Flex flexDir="column" gap={4}>
              <Heading fontSize="2xl">Esqueceu sua senha ?</Heading>
              <Text fontSize="md">
                Digite seu e-mail de recuperação, para gerar uma nova senha para
                sua conta.
              </Text>
            </Flex>

            <Input
              name="email"
              placeholder="Digite seu e-mail"
              type="email"
              error={form.formState.errors.email}
            />
            <Button
              type="submit"
              mt="6"
              colorScheme="pink"
              size="lg"
              isLoading={form.formState.isSubmitting}
            >
              Enviar
            </Button>
          </Stack>
        </Flex>
      </FormProvider>
    </AuthTemplate>
  );
};

export default ForgotPassword;
