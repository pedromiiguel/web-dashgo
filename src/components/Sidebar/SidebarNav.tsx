import { Button, Flex, Icon, Stack } from '@chakra-ui/react';
import React from 'react';
import {
  RiDashboardLine,
  RiUserLine,
  RiLogoutBoxRLine,
  RiBarChartFill
} from 'react-icons/ri';
import NavLink from './NavLink';
import NavSection from './NavSection';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/User/User.actions';
import { destroyCookie } from 'nookies';
import { useRouter } from 'next/router';

export default function SidebarNav() {
  const dispatch = useDispatch();
  const router = useRouter();

  return (
    <Flex direction="column" justify="space-between">
      <Stack spacing="12" align="flex-start">
        <NavSection title="GERAL">
          <NavLink icon={RiBarChartFill} href="/">
            Home
          </NavLink>
          <NavLink icon={RiUserLine} href="/users">
            Usuários
          </NavLink>
          <NavLink icon={RiDashboardLine} href="/products">
            Produtos
          </NavLink>
        </NavSection>
      </Stack>

      <Button
        mt="16"
        bg="pink.500"
        cursor="pointer"
        _hover={{
          bg: 'pink.600'
        }}
        leftIcon={<Icon as={RiLogoutBoxRLine} fontSize="20" />}
        onClick={() => {
          dispatch(logout());
          destroyCookie(undefined, 'dashgo.token');
          destroyCookie(undefined, 'dashgo.refreshToken');

          router.push('/sign-in');
        }}
      >
        Sair
      </Button>
    </Flex>
  );
}
