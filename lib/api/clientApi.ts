// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

// 1. Отримання нотаток з пагінацією та фільтрами
export const fetchNotes = async (params: {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
}): Promise<{ notes: Note[]; totalPages: number }> => {
  const { data } = await api.get('/notes', { params });
  return data;
};

// 2. Отримання однієї нотатки за ID
export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get(`/notes/${id}`);
  return data;
};

// 3. Створення нової нотатки
export const createNote = async (payload: {
  title: string;
  content: string;
  tags?: string[];
}): Promise<Note> => {
  const { data } = await api.post('/notes', payload);
  return data;
};

// 4. Оновлення існуючої нотатки
export const deleteNote = async (id: string): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

// 5. Реєстрація користувача
export const register = async (payload: Record<string, any>): Promise<any> => {
  const { data } = await api.post('/auth/register', payload);
  return data;
};

// 6. Логін користувача
export const login = async (payload: Record<string, any>): Promise<any> => {
  const { data } = await api.post('/auth/login', payload);
  return data;
};

// 7. Логаут
export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

// 8. Перевірка сесії (оновлення токенів)
export const checkSession = async (): Promise<any> => {
  const { data } = await api.get('/auth/session');
  return data;
};

// 9. Отримання даних поточного користувача
export const getMe = async (): Promise<User> => {
  const { data } = await api.get('/users/me');
  return data;
};

// 10. Оновлення профілю користувача
export const updateMe = async (payload: Partial<User>): Promise<User> => {
  const { data } = await api.patch('/users/me', payload);
  return data;
};
