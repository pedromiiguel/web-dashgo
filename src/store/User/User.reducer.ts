const initialState = {
  user: {
    isAuthenticated: false,
    email: '',
    id: '',
    name: '',
  },
};

export type User = {
  isAuthenticated: boolean;
  email: string;
  id: string;
  name: string;
};

export interface InitialState {
  user: User;
}

export default function (state: InitialState = initialState, action: any) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
      };

    case 'LOGOUT':
      return {
        ...state,
        user: { ...action.payload, isAuthenticated: false },
      };
    default:
      return state;
  }
}
