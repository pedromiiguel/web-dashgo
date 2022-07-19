import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import React, { useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';

import { Input } from '../../../components/Form/Input';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import { QueryClient, useMutation } from 'react-query';
import { api } from '../../../services/apiClient';
import { queryClient } from '../../../services/queryClient';
import { useRouter } from 'next/router';
import { withSSRAuth } from '../../../utils/withSSRAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { userFormschema } from '../validaton';
import { useUser } from '../../../services/hooks/useUser';

type EditUserFormData = {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
};

export default function EditUser() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, isLoading } = useUser(id);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(userFormschema),
    defaultValues: { name: data?.name, email: data?.email },
  });

  // console.log(data);
  const createUser = useMutation(
    async (user: EditUserFormData) => {
      const data = {
        email: user.email,
        name: user.name,
        password: user.password,
      };

      const response = await api.post('users', {
        ...data,
      });

      return response.data.user;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      },
    }
  );

  const handleCreateUser: SubmitHandler<EditUserFormData> = async (values) => {
    await createUser.mutateAsync(values);

    router.push('/users');
  };

  return (
    <Box>
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={['6', '8']}
          onSubmit={handleSubmit(handleCreateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Editar usuário
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          {!isLoading && (
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="name"
                  label="Nome completo"
                  error={errors.name}
                  register={{
                    ...register('name'),
                  }}
                />
                <Input
                  name="email"
                  type="email"
                  label="E-mail"
                  error={errors.email}
                  register={{
                    ...register('email'),
                  }}
                />
              </SimpleGrid>
            </VStack>
          )}

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/users" passHref>
                <Button colorScheme="whiteAlpha">Cancelar</Button>
              </Link>
              <Button type="submit" isLoading={isSubmitting} colorScheme="pink">
                Salvar
              </Button>
            </HStack>
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
