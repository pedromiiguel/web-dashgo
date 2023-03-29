import { currency } from '@/utils/mask';
import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps
} from '@chakra-ui/react';
import { FieldError, useFormContext } from 'react-hook-form';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
}

export const CurrencyInput = ({ name, label, error, ...rest }: InputProps) => {
  const { register } = useFormContext();

  return (
    <FormControl isInvalid={!!error}>
      {!!label && <FormLabel htmlFor="password">{label}</FormLabel>}
      <ChakraInput
        {...rest}
        id={name}
        type="text"
        focusBorderColor="pink.500"
        bgColor="gray.900"
        variant="filled"
        size="lg"
        _hover={{
          bgColor: 'gray.900'
        }}
        {...register(name, {
          onChange: (event) => currency(event)
        })}
      />

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};
