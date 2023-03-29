import Head from 'next/head';
import { Flex } from '@chakra-ui/react';
import { Header, Sidebar } from '@/components';

interface AuthTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const HomeTemplate = ({
  title,
  description,
  children
}: AuthTemplateProps) => {
  return (
    <>
      <Head>
        <title>Dashgo | {title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex direction="column" h="100vh">
        <Header />
        <Flex w="100%" my="6" maxWidth={1480} mx="auto" px="6">
          <Sidebar />
          {children}
        </Flex>
      </Flex>
    </>
  );
};

export default HomeTemplate;
