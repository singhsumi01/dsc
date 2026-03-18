'use client';

import Link from 'next/link';
import { useAuthStore } from '@/lib/store';
import { Shield, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                DSC SaaS
              </span>
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="/#pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="/#categories" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Categories</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link href="/dashboard" className="text-sm font-medium text-gray-900 flex items-center bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
                  <User className="h-4 w-4 mr-1.5 text-indigo-600" />
                  Dashboard
                </Link>
                <button 
                  onClick={logout}
                  className="text-sm font-medium text-gray-600 hover:text-red-600 transition-colors flex items-center"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">Login</Link>
                <Link href="/signup" className="bg-indigo-600 text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-indigo-700 transition-all hover:shadow-lg hover:shadow-indigo-200">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-100 py-4 px-4 space-y-4">
          <Link href="/#features" className="block text-base font-medium text-gray-600">Features</Link>
          <Link href="/#pricing" className="block text-base font-medium text-gray-600">Pricing</Link>
          <Link href="/login" className="block text-base font-medium text-gray-600">Login</Link>
          <Link href="/signup" className="block w-full text-center bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium">Get Started</Link>
        </div>
      )}
    </nav>
  );
}
