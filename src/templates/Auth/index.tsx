import { Logo } from '@/components';
import { Flex } from '@chakra-ui/react';

import Head from 'next/head';
import { useRouter } from 'next/router';

interface AuthTemplateProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export const AuthTemplate = ({
  title,
  description,
  children
}: AuthTemplateProps) => {
  const router = useRouter();
  return (
    <>
      <Head>
        <title>Dashgo | {title}</title>
        <meta name="description" content={description} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex
        w="100vw"
        h="100vh"
        align="center"
        justify="center"
        flexDirection="column"
        gap={4}
      >
        <Logo
          onClick={() => {
            router.push('/');
          }}
        />

        <Flex w="100%" maxWidth={360} bg="gray.800" p="8" borderRadius={8}>
          {children}
        </Flex>
      </Flex>
    </>
  );
};

export default AuthTemplate;
