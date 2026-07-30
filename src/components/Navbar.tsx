'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Download, Shield, Menu, X, ArrowUpRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'HOME', href: '/' },
    { name: 'PANELS', href: '/assets' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full glass-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        
        {/* Brand Logo matching brokencheats.store */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="flex items-center gap-2">
            <span className="font-black text-xl md:text-2xl tracking-tighter text-white uppercase italic">
              BROKEN<span className="text-blue-500">CHEATS</span>
            </span>
            <span className="text-[9px] font-mono font-bold tracking-widest text-slate-500 border border-slate-800 px-2 py-0.5 rounded-full uppercase">
              FREE STORE
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs font-bold tracking-widest transition-colors ${
                  isActive
                    ? 'text-blue-500'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Live Operational Status CTA */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/assets"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-lg shadow-blue-600/25"
          >
            <span>ACCESS FREE STORE</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#050507]/98 border-b border-slate-800 px-6 py-6 space-y-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-sm font-bold tracking-widest text-slate-300 hover:text-blue-400"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
