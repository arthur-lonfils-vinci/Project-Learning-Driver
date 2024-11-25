export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  profileType?: string;
  socialId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserCreate {
  email: string;
  password: string;
  name: string;
  role: 'STUDENT' | 'INSTRUCTOR';
  profileType?: string;
}