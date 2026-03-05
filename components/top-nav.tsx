'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/relationships', label: 'People' },
  { href: '/chat', label: 'Chat' },
  { href: '/settings', label: 'Settings' },
];

export function TopNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full border-b border-white/10" role="navigation" aria-label="Main navigation">
      <div className="mx-auto max-w-[1100px] px-6 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="font-mono text-[13px] font-semibold tracking-[0.2em] text-white hover:opacity-80 transition-opacity duration-200">
          DEFRAG
        </Link>
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.label}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[13px] tracking-normal transition-all duration-200 px-3 py-2 rounded-sm ${
                  isActive
                    ? 'text-white bg-white/[0.06]'
                    : 'text-white/60 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
