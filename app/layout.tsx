import './globals.css';
import { Providers } from './providers';
import Header from '../components/Header';

export const metadata = {
  title: 'AI Startup Ideas',
  description: 'Share and explore daily AI-generated startup ideas',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <Providers>
          <Header />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}