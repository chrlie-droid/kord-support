import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Kord Support',
  description: 'Операционная система сервисной компании для iiko-интегратора',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
