import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  VStack,
  Spinner
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { Input } from '@/components';
import { api } from '@/services/apiClient';
import { queryClient } from '@/services/queryClient';
import { withSSRAuth } from '@/utils/withSSRAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useUser } from '@/services/hooks/useUser';
import { ROUTES } from '@/constants/routes';
import * as yup from 'yup';
import HomeTemplate from '@/templates/Home';

type EditUserFormData = {
  name: string;
  email: string;
};

export const userFormschema = yup
  .object({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido')
  })
  .required();
export default function EditUser() {
  const router = useRouter();
  const id = router.query.id as string;

  const form = useForm<EditUserFormData>({
    resolver: yupResolver(userFormschema)
  });

  const { isLoading } = useUser(id, {
    onSuccess: (data: EditUserFormData) => {
      form.reset(data);
    },
    enabled: !!id
  });

  const { mutateAsync } = useMutation(
    async (user: EditUserFormData) => {
      await api.patch(`/user/edit/${id}`, user);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('users');
      }
    }
  );

  const handleUpdateUser: SubmitHandler<EditUserFormData> = async (values) => {
    try {
      await mutateAsync(values);

      router.push(ROUTES.USERS);
    } catch (error) {
      form.setError('email', {
        type: 'custom',
        message: error.response.data.message
      });
    }
  };

  return (
    <HomeTemplate title="Editar usuário">
      <FormProvider {...form}>
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={['6', '8']}
          onSubmit={form.handleSubmit(handleUpdateUser)}
        >
          <Heading size="lg" fontWeight="normal">
            Editar usuário
          </Heading>
          <Divider my="6" borderColor="gray.700" />
          {isLoading ? (
            <Flex align="center" justify="center">
              <Spinner />
            </Flex>
          ) : (
            <VStack spacing="8">
              <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
                <Input
                  name="name"
                  label="Nome completo"
                  error={form.formState.errors?.name}
                />

                <Input
                  name="email"
                  type="email"
                  label="E-mail"
                  error={form.formState.errors?.email}
                />
              </SimpleGrid>
            </VStack>
          )}

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
