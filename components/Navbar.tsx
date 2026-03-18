'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Shield, Menu, X } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const bg = scrolled
    ? 'bg-white/95 backdrop-blur-lg shadow-sm border-b border-gray-100'
    : 'bg-transparent';

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${bg}`}>
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-md">
            <Shield className="w-4.5 h-4.5 w-[18px] h-[18px] text-white" />
          </div>
          <span className={`font-bold text-lg tracking-tight ${scrolled ? 'text-gray-900' : 'text-white'}`}>
            DSC<span className={scrolled ? 'text-orange-500' : 'text-orange-400'}>Portal</span>
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {['/#categories', '/#features', '/#pricing'].map((href, i) => {
            const label = ['Services','Features','Pricing'][i];
            return (
              <Link key={label} href={href}
                className={`text-sm font-medium transition-colors ${scrolled ? 'text-gray-600 hover:text-blue-600' : 'text-blue-100 hover:text-white'}`}>
                {label}
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link href="/dashboard" className={`text-sm font-semibold ${scrolled ? 'text-blue-600' : 'text-white'}`}>
                Portal
              </Link>
              <button onClick={logout} className="text-sm font-semibold text-red-500 hover:text-red-600 transition-colors">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login"
                className={`text-sm font-semibold transition-colors ${scrolled ? 'text-gray-700 hover:text-blue-600' : 'text-white hover:text-blue-200'}`}>
                Log In
              </Link>
              <Link href="/signup"
                className="bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20">
                Get Started Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden p-2 rounded-lg" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen
            ? <X className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            : <Menu className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 pb-6 pt-4 flex flex-col gap-1">
          {[{ label: 'Services', href: '/#categories' }, { label: 'Features', href: '/#features' }, { label: 'Pricing', href: '/#pricing' }].map(({ label, href }) => (
            <Link key={label} href={href}
              onClick={() => setMobileOpen(false)}
              className="text-gray-700 font-medium py-2.5 px-2 rounded-lg hover:bg-gray-50 transition-colors text-sm">
              {label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-gray-100 mt-2">
            {user ? (
              <>
                <Link href="/dashboard" className="bg-blue-600 text-white text-sm font-semibold py-3 px-4 rounded-xl text-center">Go to Portal</Link>
                <button onClick={logout} className="text-red-500 font-medium py-2 text-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="border border-gray-200 text-gray-700 text-sm font-semibold py-3 px-4 rounded-xl text-center">Log In</Link>
                <Link href="/signup" className="bg-orange-500 text-white text-sm font-semibold py-3 px-4 rounded-xl text-center">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
