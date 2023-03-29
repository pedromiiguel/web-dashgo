import {
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  HStack,
  SimpleGrid,
  Spinner,
  VStack
} from '@chakra-ui/react';
import Link from 'next/link';
import React from 'react';
import { SubmitHandler, FormProvider, useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { Input, CurrencyInput } from '@/components';
import { api } from '@/services/apiClient';
import { queryClient } from '@/services/queryClient';
import { useRouter } from 'next/router';
import { withSSRAuth } from '@/utils/withSSRAuth';
import { yupResolver } from '@hookform/resolvers/yup';
import { useProduct } from '@/services/hooks/useProduct';
import * as yup from 'yup';
import { removeCurrencyMask } from '@/utils/mask';

import HomeTemplate from '@/templates/Home';

type EditProductFormData = {
  name: string;
  price: number;
};

export const createProductSchema = yup
  .object({
    name: yup.string().required('Nome obrigatório'),
    price: yup
      .string()
      .transform((value: string) => {
        const formattedValue = removeCurrencyMask(value);

        return String(formattedValue);
      })
      .required('Preço obrigatório')
  })
  .required();

export default function EditUser() {
  const router = useRouter();
  const id = router.query.id as string;

  const form = useForm<EditProductFormData>({
    resolver: yupResolver(createProductSchema)
  });

  const { isLoading } = useProduct(id, {
    onSuccess: (data: EditProductFormData) => {
      form.reset(data);
    }
  });

  const { mutateAsync } = useMutation(
    async (product: EditProductFormData) => {
      await api.patch(`/product/edit/${id}`, product);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('products');
      }
    }
  );

  const handleUpdateProduct: SubmitHandler<EditProductFormData> = async (
    values
  ) => {
    try {
      await mutateAsync({ name: values.name, price: Number(values.price) });

      router.push('/products');
    } catch (error) {
      form.setError('name', {
        type: 'custom',
        message: error.response.data.message
      });
    }
  };

  return (
    <HomeTemplate title="Editar produto">
      <FormProvider {...form}>
        <Box
          as="form"
          flex="1"
          borderRadius="8"
          bg="gray.800"
          p={['6', '8']}
          onSubmit={form.handleSubmit(handleUpdateProduct)}
        >
          <Heading size="lg" fontWeight="normal">
            Editar produto
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
                  label="Nome"
                  error={form.formState.errors.name}
                />
                <CurrencyInput
                  name="price"
                  label="Preço"
                  error={form.formState.errors.price}
                />
              </SimpleGrid>
            </VStack>
          )}

          <Flex mt="8" justify="flex-end">
            <HStack spacing="4">
              <Link href="/products" passHref>
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
