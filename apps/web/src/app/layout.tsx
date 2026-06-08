import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Plumber',
  description: 'File processing pipeline',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
