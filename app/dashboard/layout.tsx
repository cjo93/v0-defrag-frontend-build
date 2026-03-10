"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSession } from '@/lib/supabase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndProfile() {
      try {
        const session = await getSession();
        if (!session) {
          router.push('/auth/login');
          return;
        }

        const res = await fetch('/api/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/onboarding');
          return;
        }

        const userMeta = await res.json();
        const hasProfileField = typeof userMeta.has_profile === 'boolean';
        const hasChartField = typeof userMeta.chart_generated === 'boolean';
        if (hasProfileField && hasChartField && (!userMeta.has_profile || !userMeta.chart_generated)) {
          router.push('/onboarding');
          return;
        }
      } catch (err) {
        console.error('Auth check failed', err);
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-sm tracking-widest animate-pulse">
        VERIFYING...
      </div>
    );
  }

  return children;
}
