import { Avatar, Box, Flex, Text } from '@chakra-ui/react';
import React from 'react';

interface ProfileProps {
  showProfileData?: boolean;
}

export default function Profile({ showProfileData = true }: ProfileProps) {
  return (
    <Flex align="center">
      {showProfileData && (
        <Box mr="4">
          <Text>Pedro Miguel</Text>
          <Text color="gray.300" fontSize="small">
            pedromrap@gmail.com
          </Text>
        </Box>
      )}
      <Avatar
        size="md"
        name="Pedro Miguel"
        src="https://github.com/pedromiiguel.png"
      />
    </Flex>
  );
}
