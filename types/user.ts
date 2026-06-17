// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string;
//   createdAt: string;
// }

export interface User {
  username: string;
  email: string;
  avatar?: string;
}

export type AuthCredentials = {
  email: string;
  password: string;
};

export type RegisterDto = AuthCredentials & {
  username: string;
};
