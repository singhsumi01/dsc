'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { useState, useEffect } from 'react';
import { Shield, Menu, X, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100' : 'bg-transparent'
    }`}>
      <div className="container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-[--blue] flex items-center justify-center group-hover:bg-[--orange] transition-colors duration-200 shadow-md shadow-blue-200">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col leading-none">
              <span className={`font-bold text-lg tracking-tight transition-colors ${scrolled ? 'text-[--navy]' : 'text-white'}`}>
                DSC<span className="text-[--orange]">Portal</span>
              </span>
              <span className={`text-[9px] font-semibold tracking-widest uppercase transition-colors ${scrolled ? 'text-gray-400' : 'text-blue-200'}`}>
                CCA Licensed CA
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-8">
            {[
              { label: 'Services', href: '/#categories' },
              { label: 'Features', href: '/#features' },
              { label: 'Pricing', href: '/#pricing' },
              { label: 'Contact', href: '/#contact' },
            ].map(item => (
              <Link
                key={item.label}
                href={item.href}
                className={`nav-link font-medium transition-colors text-sm ${
                  scrolled ? 'text-gray-600 hover:text-[--blue]' : 'text-blue-100 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className={`text-sm font-semibold transition-colors ${scrolled ? 'text-[--blue]' : 'text-white'}`}
                >
                  My Portal
                </Link>
                <button
                  onClick={logout}
                  className="btn btn-white text-sm !py-2 !px-4"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`text-sm font-semibold transition-colors ${scrolled ? 'text-gray-700 hover:text-[--blue]' : 'text-white hover:text-blue-200'}`}
                >
                  Log In
                </Link>
                <Link href="/signup" className="btn btn-accent !py-2.5 !px-5 text-sm shadow-lg shadow-orange-200/40">
                  Get Started Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            className="lg:hidden p-2 rounded-lg"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen
              ? <X className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
              : <Menu className={`w-5 h-5 ${scrolled ? 'text-gray-700' : 'text-white'}`} />
            }
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 px-4 py-6 flex flex-col gap-4">
          {[
            { label: 'Services', href: '/#categories' },
            { label: 'Features', href: '/#features' },
            { label: 'Pricing', href: '/#pricing' },
          ].map(item => (
            <Link
              key={item.label}
              href={item.href}
              className="text-gray-700 font-medium py-2 border-b border-gray-50"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            {user ? (
              <>
                <Link href="/dashboard" className="btn btn-primary w-full text-center">My Portal</Link>
                <button onClick={logout} className="btn btn-white w-full">Sign Out</button>
              </>
            ) : (
              <>
                <Link href="/login" className="btn btn-white w-full text-center">Log In</Link>
                <Link href="/signup" className="btn btn-accent w-full text-center">Get Started Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
