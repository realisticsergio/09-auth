import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Provider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';
import { Roboto } from 'next/font/google';
import React from 'react';
import AuthProvider from '@/components/AuthProvider/AuthProvider';

const roboto = Roboto({
  weight: ['400', '500', '700'],
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-roboto',
});

const OG_IMAGE = 'https://ac.goit.global/fullstack/react/notehub-og-meta.jpg';

export const metadata: Metadata = {
  title: 'NoteHub - Best Note Management App',
  description: 'Organize your thoughts, tasks, and daily meetings with NoteHub.',
  openGraph: {
    title: 'NoteHub - Best Note Management App',
    description: 'Organize your thoughts, tasks, and daily meetings with NoteHub.',
    url: 'https://08-zustand-weld-one.vercel.app/',
    images: [{ url: OG_IMAGE }],
    type: 'website',
  },
};

interface RootLayoutProps {
  children: React.ReactNode;
  modal: React.ReactNode;
}

export default function RootLayout({ children, modal }: RootLayoutProps) {
  return (
    <html lang="en" className={roboto.variable}>
      <body style={{ fontFamily: 'var(--font-roboto), sans-serif' }}>
        <Provider>
          <AuthProvider>
            <Header />
            <main>{children}</main>
            {modal}
            <Footer />
          </AuthProvider>
        </Provider>
      </body>
    </html>
  );
}
