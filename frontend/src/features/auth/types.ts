export type LoginInput = {
  email: string;
  password: string;
};

export type AuthResponse = {
  access: string;
};

export type Me = {
  id: number;
  email: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};
