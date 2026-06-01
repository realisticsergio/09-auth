import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

export default async function FilteredNotesPage({ params }: Props) {
  const { slug } = await params;

  const currentTag = slug?.[0];

  const apiTag = currentTag === 'all' || !currentTag ? '' : currentTag;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['notes', '', 0, apiTag],
    queryFn: () => fetchNotes('', 1, apiTag),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotesClient initialTag={apiTag} />
    </HydrationBoundary>
  );
}
