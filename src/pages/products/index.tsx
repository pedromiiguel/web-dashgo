import {
  Box,
  Button,
  Checkbox,
  Flex,
  Heading,
  Icon,
  Link,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useBreakpointValue
} from '@chakra-ui/react';
import React, { useState } from 'react';
import NextLink from 'next/link';
import { RiAddLine, RiPencilLine } from 'react-icons/ri';
import { Pagination } from '@/components';
import { useGetProducts } from '@/services/hooks/useGetProducts';
import HomeTemplate from '@/templates/Home';

export default function Products() {
  const [page, setPage] = useState(1);
  const { data, isLoading, error, isFetching } = useGetProducts(page);

  const isWideVersion = useBreakpointValue({
    base: false,
    lg: true
  });

  return (
    <HomeTemplate title="Produtos">
      <Box flex="1" borderRadius="8" bg="gray.800" p="8">
        <Flex mb="8" justify="space-between" align="center">
          <Heading size="lg" fontWeight="normal">
            Produtos
            {!isLoading && isFetching && (
              <Spinner size="sm" color="gray.500" ml="4" />
            )}
          </Heading>
          <NextLink href="/products/create" passHref>
            <Button
              as="a"
              size="sm"
              fontSize="sm"
              colorScheme="pink"
              leftIcon={<Icon as={RiAddLine} fontSize="20" />}
            >
              Criar novo
            </Button>
          </NextLink>
        </Flex>

        {isLoading ? (
          <Flex align="center" justify="center">
            <Spinner />
          </Flex>
        ) : error ? (
          <Flex align="center" justify="center">
            <Text color="red.500">Falha ao obter dados dos usuários</Text>
          </Flex>
        ) : (
          <>
            <Table colorScheme="whiteAlpha">
              <Thead>
                <Tr>
                  <Th px={['4', '4', '6']} color="gray.300" width="8">
                    <Checkbox colorScheme="pink" />
                  </Th>
                  <Th>Nome</Th>
                  {isWideVersion && <Th>Data de cadastro</Th>}
                  {isWideVersion && <Th>Valor</Th>}
                  {isWideVersion && <Th>Criado por</Th>}
                  {isWideVersion && <Th w="8"></Th>}
                </Tr>
              </Thead>
              <Tbody>
                {data?.products?.map((product) => {
                  return (
                    <Tr key={product.id}>
                      <Td px={['4', '4', '6']}>
                        <Checkbox colorScheme="pink" />
                      </Td>
                      <Td>
                        <Box>
                          <Link>
                            <Text fontWeight="bold">{product.name}</Text>
                          </Link>
                        </Box>
                      </Td>
                      {isWideVersion && <Td>{product.createdAt}</Td>}
                      {isWideVersion && <Td>{product.price}</Td>}
                      {isWideVersion && <Td>{product.user.name}</Td>}

                      {isWideVersion && (
                        <Td>
                          <NextLink
                            href={`/products/edit/${product.id}`}
                            passHref
                          >
                            <Button
                              as="a"
                              size="sm"
                              fontSize="sm"
                              colorScheme="purple"
                              leftIcon={
                                <Icon as={RiPencilLine} fontSize="16" />
                              }
                            >
                              Editar
                            </Button>
                          </NextLink>
                        </Td>
                      )}
                    </Tr>
                  );
                })}
              </Tbody>
            </Table>

            <Pagination
              totalCountOfRegisters={data?.totalCount}
              currentPage={page}
              onPageChange={setPage}
            />
          </>
        )}
      </Box>
    </HomeTemplate>
  );
}
