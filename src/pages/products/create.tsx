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
import React from 'react';
import Link from 'next/link';
import { SubmitHandler, useForm, FormProvider } from 'react-hook-form';
import { useRouter } from 'next/router';
import { useMutation } from 'react-query';
import { yupResolver } from '@hookform/resolvers/yup';
import { Input, CurrencyInput } from '@/components';
import { api } from '@/services/apiClient';
import { queryClient } from '@/services/queryClient';
import { withSSRAuth } from '@/utils/withSSRAuth';
import { ROUTES } from '@/constants/routes';
import HomeTemplate from '@/templates/Home';
import { createProductSchema } from './edit/[id]';

type CreateProductFormData = {
  name: string;
  price: number;
};

export default function CreateProduct() {
  const form = useForm<CreateProductFormData>({
    resolver: yupResolver(createProductSchema)
  });
  const router = useRouter();

  const { mutateAsync } = useMutation(
    async (data: { name: string; price: number }) => {
      return await api.post('product', data);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      }
    }
  );

  const handleCreateProduct: SubmitHandler<CreateProductFormData> = async (
    values
  ) => {
    await mutateAsync({ name: values.name, price: Number(values.price) });

    router.push(ROUTES.PRODUCTS);
  };

  return (
    <HomeTemplate title="Criar novo produto">
      <FormProvider {...form}>
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={['6', '8']}
          onSubmit={form.handleSubmit(handleCreateProduct)}
        >
          <Heading size="lg" fontWeight="normal">
            Novo produto
          </Heading>
          <Divider my="6" borderColor="gray.700" />

          <VStack spacing="8">
            <SimpleGrid minChildWidth="240px" spacing={['6', '8']} w="100%">
              <Input
                name="name"
                label="Nome"
                error={form.formState.errors.name}
              />
              <CurrencyInput
                name="price"
                label="Preço"
                error={form.formState.errors.price}
              />
            </SimpleGrid>

            <SimpleGrid
              minChildWidth="240px"
              spacing={['6', '8']}
              w="100%"
            ></SimpleGrid>
          </VStack>

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href={ROUTES.PRODUCTS} passHref>
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
