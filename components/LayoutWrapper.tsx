'use client';

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';
import Footer from './Footer';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith('/dashboard');
  const isAuth = pathname?.startsWith('/login') || pathname?.startsWith('/signup');

  return (
    <>
      {!isDashboard && !isAuth && <Navbar />}
      <main className={!isDashboard && !isAuth ? 'min-h-screen' : ''}>
        {children}
      </main>
      {!isDashboard && !isAuth && <Footer />}
    </>
  );
}
