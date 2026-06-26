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

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : 'http://localhost:3000';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Trợ Lý Trả Lời Khách',
  description: 'Soạn câu trả lời cho khách nhanh, đúng thông tin từng nhà. Hỗ trợ tiếng Việt và tiếng Anh.',
  openGraph: {
    title: 'Trợ Lý Trả Lời Khách',
    description: 'Soạn câu trả lời cho khách nhanh · đúng thông tin · đa ngôn ngữ',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Trợ Lý Trả Lời Khách',
    description: 'Soạn câu trả lời cho khách nhanh · đúng thông tin · đa ngôn ngữ',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi" className={`${playfair.variable} ${inter.variable}`}>
      <body style={{ margin: 0, fontFamily: 'Inter, sans-serif' }}>{children}</body>
    </html>
  );
}
