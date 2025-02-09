import { User } from '../models/user.model';

export const USER: User = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
};

export const UPDATED_USER: User = {
  id: 1,
  name: 'Updated Name',
  email: 'updated@example.com',
  phone: '9876543210',
};

export const EMPTY_USER = {
  id: null,
  name: null,
  email: null,
  phone: null,
};

export const USERS_LIST: User[] = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '1234567890' },
  { id: 2, name: 'Jane Doe', email: 'jane@example.com', phone: '0987654321' },
];
