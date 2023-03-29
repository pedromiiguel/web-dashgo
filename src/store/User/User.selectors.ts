import { UserState } from './User.reducer';

export const authenticatedUser = (state: { user: UserState }) => state.user;
