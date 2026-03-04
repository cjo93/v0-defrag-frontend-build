"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/supabase";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuthAndProfile() {
      try {
        const session = await getSession();
        if (!session) {
          router.push("/auth/login");
          return;
        }

        // Onboarding Gate: check API if user has a profile
        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app';
        const res = await fetch(`${API_URL}/api/me`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (res.ok) {
          const userMeta = await res.json();
          if (!userMeta.has_profile || !userMeta.chart_generated) {
            router.push("/onboarding");
            return; // stop execution, let redirect happen
          }
        } else {
          // If the endpoint fails, we might just proceed or we could force onboarding.
          // In a real system, you want to handle 401s here too.
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    }

    checkAuthAndProfile();
  }, [router]);

  if (loading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white font-mono text-sm tracking-widest animate-pulse">VERIFYING...</div>;
  }

  return children;
}
