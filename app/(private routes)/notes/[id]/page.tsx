import { HydrationBoundary, dehydrate, QueryClient } from '@tanstack/react-query';

import type { Metadata } from 'next';

import { fetchNoteById } from '@/lib/api/serverApi';
import NotePreview from '@/app/@modal/(.)notes/[id]/NotePreview.client';

interface NoteDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: NoteDetailsPageProps): Promise<Metadata> {
  const { id } = await params;

  const note = await fetchNoteById(id);

  const title = `${note.title} | NoteHub`;

  const description = note.content ? `${note.content.slice(0, 120)}…` : 'Деталі вибраної нотатки.';

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://08-zustand-weld-one.vercel.app/${id}`,
      images: [
        {
          url: 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg',
          width: 1200,
          height: 630,
          alt: `NoteHub — ${note.title}`,
        },
      ],
    },
  };
}

export default async function NoteDetailsPage({ params }: NoteDetailsPageProps) {
  const { id } = await params;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['note', id],
    queryFn: () => fetchNoteById(id),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <NotePreview id={id} />
    </HydrationBoundary>
  );
}
