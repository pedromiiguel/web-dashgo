import { Button, Flex, Heading, Stack } from '@chakra-ui/react';
import { useForm, FormProvider } from 'react-hook-form';
import React from 'react';
import { Input } from '@/components';
import AuthTemplate from '@/templates/Auth';
import { useMutation } from 'react-query';
import { api } from '@/services/apiClient';
import { useRouter } from 'next/router';
import { ROUTES } from '@/constants/routes';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ResetPasswordFormData {
  password: string;
  confirm_password: string;
}

export const resetPasswordSchema = yup
  .object({
    password: yup
      .string()
      .required('Senha obrigatória')
      .min(6, 'Digite uma senha com no mínimo 6 caracteres'),
    confirm_password: yup
      .string()
      .required('Confirmação de senha obrigatória')
      .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
  })
  .required();

export default function ResetPassword() {
  const form = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema)
  });
  const { query, push } = useRouter();

  const { mutateAsync } = useMutation(
    (data: Pick<ResetPasswordFormData, 'password'>) =>
      api.post('/reset-password', {
        password: data.password,
        token: query.token
      })
  );

  const handleForgotPassword = async (values: ResetPasswordFormData) => {
    await mutateAsync({ password: values.password });

    push(ROUTES.LOGIN);
  };

  return (
    <AuthTemplate
      title="Reset Password"
      description="Crie sua nova senha do Dashgo"
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
              <Heading fontSize="2xl">Redefinir senha</Heading>
            </Flex>

            <Input
              name="password"
              placeholder="Digite sua senha"
              type="password"
              error={form.formState.errors.password}
            />

            <Input
              name="confirm_password"
              placeholder="Confirme sua senha"
              type="password"
              error={form.formState.errors.confirm_password}
            />
            <Button
              type="submit"
              mt="6"
              colorScheme="pink"
              size="lg"
              isLoading={form.formState.isSubmitting}
            >
              Redefinir senha
            </Button>
          </Stack>
        </Flex>
      </FormProvider>
    </AuthTemplate>
  );
}
