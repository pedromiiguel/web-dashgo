export type LoginPayload = {
  email: string;
  id: string;
  name: string;
};

export function login(payload: LoginPayload) {
  return {
    type: 'LOGIN',
    payload
  };
}

export function logout() {
  return {
    type: 'LOGOUT'
  };
}
