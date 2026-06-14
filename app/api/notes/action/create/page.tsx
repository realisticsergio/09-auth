import type { Metadata } from 'next';
import NoteForm from '@/components/NoteForm/NoteForm';
import css from '../../../page.module.css';

const OG_IMAGE = 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';

export const metadata: Metadata = {
  title: 'Create New Note | NoteHub',
  description: 'Create and draft a new note to keep track of your goals.',
  openGraph: {
    title: 'Create New Note | NoteHub',
    description: 'Create and draft a new note to keep track of your goals.',
    url: 'https://notehub.com/notes/action/create',
    images: [{ url: OG_IMAGE }],
  },
};

export default function CreateNote() {
  return (
    <main className={css.main}>
      <div className={css.container}>
        <h1 className={css.title}>Create note</h1>
        <NoteForm />
      </div>
    </main>
  );
}
