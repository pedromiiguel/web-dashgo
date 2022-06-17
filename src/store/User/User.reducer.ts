const initialState = {
  user: {
    isAuthenticated: false,
    email: '',
    id: '',
    name: '',
  },
};

interface InitialState {
  user: {
    isAuthenticated: boolean;
    email: string;
    id: string;
    name: string;
  };
}

export default function (state: InitialState = initialState, action: any) {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: { ...action.payload, isAuthenticated: true },
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
