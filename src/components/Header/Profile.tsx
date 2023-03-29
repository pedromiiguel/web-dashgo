import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';
import { useSelector } from 'react-redux';
import { authenticatedUser } from '../../store/User/User.selectors';

interface ProfileProps {
  showProfileData?: boolean;
}

export default function Profile({ showProfileData = true }: ProfileProps) {
  const user = useSelector(authenticatedUser);

  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4">
          <Text>{user.name}</Text>
          <Text color="gray.300" fontSize="small">
            {user.email}
          </Text>
        </Box>
      )}
      <Avatar size="md" name={user.name} />
    </Flex>
  );
}
