'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard', label: 'People' },
  { href: '/chat', label: 'Chat' },
  { href: '/settings', label: 'Settings' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-white/10">
      <div className="mx-auto max-w-[1100px] px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white">
          DEFRAG
        </Link>
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={`text-[13px] tracking-normal transition-colors duration-200 ${
                pathname === item.href
                  ? 'text-white'
                  : 'text-white/60 hover:text-white'
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
