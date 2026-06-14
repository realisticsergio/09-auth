'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { keepPreviousData } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import { useDebouncedCallback } from 'use-debounce';
import NoteList from '@/components/NoteList/NoteList';
import Pagination from '@/components/Pagination/Pagination';
import SearchBox from '@/components/SearchBox/SearchBox';
import Link from 'next/link';
import css from '../../Notes.module.css';

interface NotesClientProps {
  initialTag?: string;
  isFilterPage?: boolean;
}

export default function NotesClient({ initialTag = '', isFilterPage = false }: NotesClientProps) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');

  const debouncedSetSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
    setPage(1);
  }, 300);

  const { data } = useQuery({
    queryKey: ['notes', search, page, initialTag],
    queryFn: () => fetchNotes(search, page, initialTag || undefined),
    placeholderData: keepPreviousData,
  });

  return (
    <div className={`${css.app} ${isFilterPage ? css.filterApp : ''}`}>
      <header className={css.toolbar}>
        <SearchBox value={search} onChange={(value) => debouncedSetSearch(value)} />

        {data && data.totalPages > 1 && (
          <Pagination
            totalPages={data.totalPages}
            currentPage={page - 1}
            onPageChange={(selectedPage) => setPage(selectedPage + 1)}
          />
        )}

        <Link href="/notes/action/create" className={css.button}>
          Create note +
        </Link>
      </header>

      <main>{data && <NoteList notes={data.notes} />}</main>
    </div>
  );
}
