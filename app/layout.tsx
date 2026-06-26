import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Trợ Lý Trả Lời Khách',
  description: 'Người trợ lý đắc lực giúp bạn trả lời khách nhanh và đúng thông tin từng nhà.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>{children}</body>
    </html>
  );
}
