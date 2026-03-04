'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'Chat' },
  { href: '/settings', label: 'Settings' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-white/10">
      <div className="mx-auto max-w-[920px] px-6 py-4 flex items-center justify-between">
        <Link href="/dashboard" className="font-mono text-[14px] font-bold tracking-[0.2em] text-white">
          DEFRAG
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`font-mono text-[11px] uppercase tracking-[0.1em] transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-white/40 hover:text-white/80'
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
