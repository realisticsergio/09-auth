import { cookies } from 'next/headers';
import { api } from '../../app/api/api';

import { Note } from '@/types/note';
import { User } from '@/types/user';

interface NotesResponse {
  notes: Note[];
  totalPages: number;
}

async function getCookieHeader() {
  const cookieStore = await cookies();

  return cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join('; ');
}

export async function fetchNotes(
  query: string,
  page: number,
  tag?: string
): Promise<NotesResponse> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get('/notes', {
    headers: {
      Cookie: cookieHeader,
    },
    params: {
      search: query,
      page,
      perPage: 12,
      ...(tag && { tag }),
    },
  });

  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get(`/notes/${id}`, {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}

export async function checkSession() {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get('/auth/session', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data || null;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();

  const { data } = await api.get('/users/me', {
    headers: {
      Cookie: cookieHeader,
    },
  });

  return data;
}
