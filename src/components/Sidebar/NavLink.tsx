import {
  LinkProps as ChakraLinkProps,
  Icon,
  Link as ChakraLink,
  Text
} from '@chakra-ui/react';
import React, { ElementType } from 'react';
import ActiveLink from '../ActiveLink';
interface NavLinkProps extends ChakraLinkProps {
  icon: ElementType;
  children: string;
  href: string;
}

export default function NavLink({
  icon,
  children,
  href,
  ...rest
}: NavLinkProps) {
  return (
    <ActiveLink href={href} passHref shouldMatchExactHref>
      <ChakraLink display="flex" align="center" {...rest}>
        <Icon as={icon} fontSize="20" />
        <Text ml="4" fontWeight="medium">
          {children}
        </Text>
      </ChakraLink>
    </ActiveLink>
  );
}
