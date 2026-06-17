// export interface User {
//   id: string;
//   name: string;
//   email: string;
// }

import { api } from './api';
import type { Note } from '@/types/note';
import type { User } from '@/types/user';

/* =========================
   📌 NOTES
========================= */

export type FetchNotesParams = {
  page: number;
  perPage: number;
  search?: string;
  tag?: string;
};

export type FetchNotesResponse = {
  notes: Note[];
  totalPages: number;
};

export const fetchNotes = async (params: FetchNotesParams): Promise<FetchNotesResponse> => {
  const { data } = await api.get<FetchNotesResponse>('/notes', { params });
  return data;
};

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await api.get<Note>(`/notes/${id}`);
  return data;
};

export type CreateNoteDto = {
  title: string;
  content: string;
  tag: string; // 👈 fixed (НЕ tags[])
};

export const createNote = async (payload: CreateNoteDto): Promise<Note> => {
  const { data } = await api.post<Note>('/notes', payload);
  return data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const { data } = await api.delete<Note>(`/notes/${id}`);
  return data;
};

/* =========================
   🔐 AUTH
========================= */

export type AuthCredentials = {
  email: string;
  password: string;
};

export const register = async (payload: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>('/auth/register', payload);
  return data;
};

export const login = async (payload: AuthCredentials): Promise<User> => {
  const { data } = await api.post<User>('/auth/login', payload);
  return data;
};

export const logout = async (): Promise<void> => {
  await api.post('/auth/logout');
};

export const checkSession = async (): Promise<User> => {
  const { data } = await api.get<User>('/auth/session');
  return data;
};

/* =========================
   👤 USER
========================= */

export const getMe = async (): Promise<User> => {
  const { data } = await api.get<User>('/users/me');
  return data;
};

export type UpdateMeDto = {
  username: string;
};

export const updateMe = async (payload: UpdateMeDto): Promise<User> => {
  const { data } = await api.patch<User>('/users/me', payload);
  return data;
};
