import React from 'react';
import { Text } from '@chakra-ui/react';

export function Logo({ ...rest }) {
  return (
    <Text
      as="a"
      fontSize={['2xl', '3xl']}
      fontWeight="bold"
      letterSpacing="tight"
      cursor="pointer"
      {...rest}
    >
      dashgo
      <Text as="span" ml="1" color="pink.500">
        .
      </Text>
    </Text>
  );
}
