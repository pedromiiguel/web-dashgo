import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMutation } from 'react-query';
import { Input } from '@/components';
import { withSSRAuth } from '@/utils/withSSRAuth';
import { queryClient } from '@/services/queryClient';
import { api } from '@/services/apiClient';
import * as yup from 'yup';
import HomeTemplate from '@/templates/Home';

type CreateUserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export const createUserFormschema = yup
  .object({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup
      .string()
      .required('Senha obrigatória')
      .min(6, 'Digite uma senha com no mínimo 6 caracteres'),
    password_confirmation: yup
      .string()
      .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais')
  })
  .required();

export default function CreateUser() {
  const form = useForm<CreateUserFormData>({
    resolver: yupResolver(createUserFormschema)
  });
  const router = useRouter();

  const createUser = useMutation(
    async (user: CreateUserFormData) => {
      const data = {
        email: user.email,
        name: user.name,
        password: user.password
      };

      const response = await api.post('users', {
        ...data
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      }
    }
  );

  const handleCreateUser: SubmitHandler<CreateUserFormData> = async (
    values
  ) => {
    await createUser.mutateAsync(values);

    router.push('/users');
  };

  return (
    <HomeTemplate title="Criar novo usuário">
      <FormProvider {...form}>
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={['6', '8']}
          onSubmit={form.handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Criar usuário
          </Heading>
          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="name"
                label="Nome completo"
                error={form.formState.errors.name}
              />
              <Input
                name="email"
                type="email"
                label="E-mail"
                error={form.formState.errors.email}
              />
            </SimpleGrid>

            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="password"
                label="Senha"
                type="password"
                error={form.formState.errors.password}
              />
              <Input
                name="password_confirmation"
                type="password"
                error={form.formState.errors.password_confirmation}
                label="Confirmação de senha"
              />
            </SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button
                type="submit"
                isLoading={form.formState.isSubmitting}
                colorScheme="pink"
              >
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </FormProvider>
    </HomeTemplate>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {}
  };
});
