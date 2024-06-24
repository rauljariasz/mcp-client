export enum ROLES {
  ADMIN = 'ADMIN',
  PREMIUM = 'PREMIUM',
  FREE = 'FREE',
}

export interface User {
  email: string;
  lastName: string;
  name: string;
  role: ROLES;
  username: string;
  viewedClasses: number[];
}
