import * as yup from 'yup';

export const userFormschema = yup
  .object({
    name: yup.string().required('Nome obrigatório'),
    email: yup.string().required('E-mail obrigatório').email('E-mail inválido'),
    password: yup.string().required('Senha obrigatória'),
    password_confirmation: yup
      .string()
      .oneOf([null, yup.ref('password')], 'As senhas precisam ser iguais'),
  })
  .required();
