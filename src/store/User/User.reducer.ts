import { LoginPayload } from './User.actions';

export const initialState = {
  isAuthenticated: false,
  email: '',
  id: '',
  name: ''
};

export type UserState = {
  isAuthenticated: boolean;
  email: string;
  id: string;
  name: string;
};

export default function (
  state: UserState = initialState,
  action: {
    type: string;
    payload?: LoginPayload;
  }
) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...action.payload,
        isAuthenticated: true
      };

    case 'LOGOUT':
      return {
        ...initialState
      };
    default:
      return state;
  }
}
