import css from './page.module.css';
import type { Metadata } from 'next';

const OG_IMAGE = 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';

export const metadata: Metadata = {
  title: '404 - Page Not Found | NoteHub',
  description: 'Sorry, the page you are looking for does not exist on NoteHub.',
  openGraph: {
    title: '404 - Page Not Found | NoteHub',
    description: 'Sorry, the page you are looking for does not exist on NoteHub.',
    url: 'https://notehub.com/not-found', // базовий URL проєкту
    images: [{ url: OG_IMAGE }],
  },
};

export default function NotFound() {
  return (
    <main className={css.container}>
      <h1 className={css.title}>404 - Page not found</h1>
      <p className={css.description}>Sorry, the page you are looking for does not exist.</p>
    </main>
  );
}
