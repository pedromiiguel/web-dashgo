import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps
} from '@chakra-ui/react';
import React from 'react';
import { FieldError } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;

  error?: FieldError;
}

export const Input = ({ name, label, error, ...rest }: InputProps) => {
  const { register } = useFormContext();

  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor="password">{label}</FormLabel>}
      <ChakraInput
        id={name}
        focusBorderColor={error ? 'red.500' : 'pink.500'}
        bgColor="gray.900"
        variant="filled"
        _hover={{
          bgColor: 'gray.900'
        }}
        size="lg"
        {...register(name)}
        {...rest}
      />
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
