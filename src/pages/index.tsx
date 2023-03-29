import { Box, SimpleGrid, Text, theme } from '@chakra-ui/react';
import React from 'react';
import dayjs from 'dayjs';
import { ApexOptions } from 'apexcharts';
import dynamic from 'next/dynamic';
import { withSSRAuth } from '../utils/withSSRAuth';
import { useUserSubscribers } from '@/services/hooks/useUserSubscribers';
import { useProductSubscribers } from '@/services/hooks/useProductsSubscribers';
import HomeTemplate from '@/templates/Home';

const Chart = dynamic(() => import('react-apexcharts'), {
  ssr: false
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as React.FunctionComponent<any>;

const weekDays = [...Array(8)].map((_, index) =>
  dayjs().subtract(index, 'day').toDate().getTime()
);

const options: ApexOptions = {
  chart: {
    toolbar: {
      show: false
    },
    zoom: {
      enabled: false
    },
    foreColor: theme.colors.gray[500]
  },
  grid: {
    show: false
  },
  dataLabels: {
    enabled: false
  },
  tooltip: {
    enabled: false
  },
  xaxis: {
    type: 'datetime',
    axisBorder: {
      color: theme.colors.gray[600]
    },
    axisTicks: {
      color: theme.colors.gray[600]
    },
    categories: weekDays,
    labels: {
      format: 'dd/MM'
    }
  },
  fill: {
    opacity: 0.3,
    type: 'gradient',
    gradient: {
      shade: 'dark',
      opacityFrom: 0.7,
      opacityTo: 0.3
    }
  }
};

type Series = {
  name: string;
  data: number[];
}[];

export default function Dashboard() {
  const { data: user } = useUserSubscribers();
  const { data: product } = useProductSubscribers();

  const series: Series = [{ name: 'series 1', data: user }] as Series;
  const products = [{ name: 'series 2', data: product }] as Series;

  return (
    <HomeTemplate title="Home" description="Dashgo">
      <SimpleGrid flex="1" gap="4" minChildWidth="320px">
        <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
          <Text fontSize="lg" mb="4">
            Usuários inscritos essa semana
          </Text>
          <Chart options={options} series={series} type="area" height={160} />
        </Box>
        <Box p={['6', '8']} bg="gray.800" borderRadius={8} pb="4">
          <Text fontSize="lg" mb="4">
            Produtos inscritos essa semana
          </Text>
          <Chart options={options} series={products} type="area" height={160} />
        </Box>
      </SimpleGrid>
    </HomeTemplate>
  );
}

export const getServerSideProps = withSSRAuth(async () => {
  return {
    props: {}
  };
});
