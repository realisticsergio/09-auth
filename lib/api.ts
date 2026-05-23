import axios from 'axios';
import type { Note } from '../types/note';

interface NOTEHUBResponse {
  notes: Note[];
  totalPages: number;
}

const instance = axios.create({
  baseURL: 'https://notehub-public.goit.study/api',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
    accept: 'application/json',
  },
});

export const fetchNotes = async (query: string, page?: number): Promise<NOTEHUBResponse> => {
  const response = await instance.get<NOTEHUBResponse>('/notes', {
    params: { search: query, page },
  });
  return response.data;
};

export const createNote = async (newPost: Omit<Note, 'id'>): Promise<Note> => {
  const response = await instance.post<Note>('/notes', newPost);
  return response.data;
};

export const deleteNote = async (id: string): Promise<Note> => {
  const response = await instance.delete<Note>(`/notes/${id}`);
  return response.data;
};
