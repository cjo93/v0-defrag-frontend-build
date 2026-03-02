'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface NavigationProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

export function Navigation({ isAuthenticated = false, onSignOut }: NavigationProps) {
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 safe-top">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Wordmark */}
        <Link 
          href="/" 
          className="text-lg font-semibold tracking-tight text-foreground hover:opacity-70 transition-opacity"
        >
          DEFRAG
        </Link>

        {/* Right: Account menu (when authenticated) */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-foreground">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem asChild>
                <Link href="/readout/self" className="cursor-pointer">
                  Manual
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/grid" className="cursor-pointer">
                  Grid
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/chat" className="cursor-pointer">
                  Crisis Mode
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={onSignOut}
                className="cursor-pointer"
              >
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
}
