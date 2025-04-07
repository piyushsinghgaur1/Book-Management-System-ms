export interface UserSignUpInterface {
  userId: string;
  username: string;
  password: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UserSignInInterface {
  username: string;
  password: string;
}
