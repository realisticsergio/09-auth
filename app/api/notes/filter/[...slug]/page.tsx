import { dehydrate, HydrationBoundary, QueryClient } from '@tanstack/react-query';
import { fetchNotes } from '@/lib/api';
import NotesClient from './Notes.client';
import { Metadata } from 'next';

interface Props {
  params: Promise<{ slug?: string[] }>;
}

const OG_IMAGE = 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const currentTag = slug?.[0] || 'all';
  const displayTag = currentTag === 'all' ? 'All' : currentTag;

  return {
    title: `${displayTag} Notes | NoteHub`,
    description: `View and manage your notes filtered by tag: ${displayTag}.`,
    openGraph: {
      title: `${displayTag} Notes | NoteHub`,
      description: `View and manage your notes filtered by tag: ${displayTag}.`,
      url: `https://notehub.com/notes/filter/${currentTag}`,
      images: [{ url: OG_IMAGE }],
    },
  };
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
