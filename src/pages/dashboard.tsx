import { Box, Flex, SimpleGrid, Text, theme } from '@chakra-ui/react';
import { ApexOptions } from 'apexcharts';
import { GetServerSideProps } from 'next';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import React, { useEffect } from 'react';
import { withSSRAuth } from '../utils/withSSRAuth';


import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { api } from '../services/apiClient';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false,
});

const options: ApexOptions = {
  chart: {
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    foreColor: theme.colors.gray[500],
  },
  grid: {
    show: false,
  },
  dataLabels: {
    enabled: false,
  },
  tooltip: {
    enabled: false,
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600],
    },
    axisTicks: {
      color: theme.colors.gray[600],
    },
    categories: [
      new Date('01 Mar 2012').getTime(),
      new Date('02 Mar 2012').getTime(),
      new Date('03 Mar 2012').getTime(),
      new Date('04 Mar 2012').getTime(),
      new Date('05 Mar 2012').getTime(),
      new Date('06 Mar 2012').getTime(),
      new Date('07 Mar 2012').getTime(),
    ],
    labels: {
      format: 'dd/MM',
    },
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3,
    },
  },
};

const series = [{ name: 'series 1', data: [31, 120, 10, 28, 61, 18, 109] }];

const Dashboard = () => {
  const router = useRouter();

  useEffect(() => {
    api
      .get('/courses')
      .then((response) => console.log(response))
      .catch(() => {
        destroyCookie(undefined, 'dashgo.token');
        destroyCookie(undefined, 'dashgo.refreshToken');

        router.push('/');
      });
  }, []);

  return (
    <Flex direction="column" h="100vh">
      <Header />
      <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
        <Sidebar />
        <SimpleGrid flex="1" gap="4" minChildWidth="320px" align="flex-start">
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Inscritos da semana
            </Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>
          <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
            <Text fontSize="lg" mb="4">
              Inscritos da semana
            </Text>
            <Chart options={options} series={series} type="area" height={160} />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
};

export default Dashboard;

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
