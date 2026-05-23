import Header from '../components/Header/Header';
import { Children } from 'react';
import Footer from '../components/Footer/Footer';
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Manage your notes easily',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="us">
      <body>
        <TanstackProvider>
          <Header />
          {children}
          <Footer />
        </TanstackProvider>
      </body>
    </html>
  );
}
