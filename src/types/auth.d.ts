export type LoginRequest = {
  userEmail: string;
  userPassword: string;
  userProvider: 'SELF';
};

export type LoginResponse = {
  token: string;
  hakbun: number;
  generation: number;
  grade: number;
  classRoom: number;
  number: number;
  userName: string;
  userId: number;
  userEmail: string;
  userProvider: 'SELF' | 'GOOGLE';
};
