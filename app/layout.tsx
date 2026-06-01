import type { Metadata } from 'next';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Provider from '@/components/TanStackProvider/TanStackProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'NoteHub',
  description: 'Manage your notes easily',
};

export default function RootLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Provider>
          <Header />
          <main>{children}</main>
          {modal}
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
