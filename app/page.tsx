'use client';
import dynamic from 'next/dynamic';

// Dynamically import to avoid SSR (uses localStorage + timers)
const App = dynamic(() => import('@/components/App'), { ssr: false });

export default function Home() {
  return <App />;
}
