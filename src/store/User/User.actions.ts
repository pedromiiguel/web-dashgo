export function login(data: any) {
  return {
    type: 'LOGIN',
    payload: data,
  };
}

export function logout() {
  return {
    type: 'LOGOUT',
  };
}
