"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Thin client: fetch compiled data from API
    async function fetchDashboard() {
      try {
        const session = await getSession();
        if (!session) return;

        const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.defrag.app';
        const res = await fetch(`${API_URL}/api/dashboard`, {
          headers: { 'Authorization': `Bearer ${session.access_token}` }
        });

        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.error("Error fetching dashboard", e);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center border-b border-[#333] pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-widest">DEFRAG</h1>
        <div className="text-xs text-gray-500">Connected to api.defrag.app</div>
      </header>

      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-4xl">
          <div className="h-32 bg-[#111] border border-[#333]" />
          <div className="h-64 bg-[#111] border border-[#333]" />
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-8">

          {/* SECTION 1 - TODAY */}
          <section className="card">
            <h2 className="text-h2 mb-4 tracking-widest text-gray-400">TODAY</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border border-[#333] p-6 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Pressure</div>
                <div className="text-h3">{data?.today?.pressure || "Medium"}</div>
              </div>
              <div className="border border-[#333] p-6 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Best communication window</div>
                <div className="text-h3">{data?.today?.best_window || "2PM - 4PM"}</div>
              </div>
              <div className="border border-[#333] p-6 text-center">
                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Recommended move</div>
                <div className="text-h3">{data?.today?.recommended_move || "Listen actively"}</div>
              </div>
            </div>
          </section>

          {/* SECTION 2 - RELATIONSHIPS */}
          <section className="card">
            <h2 className="text-h2 mb-4 tracking-widest text-gray-400">RELATIONSHIPS</h2>
            <div className="space-y-4">
               {data?.relationships?.length ? data.relationships.map((rel: any, i: number) => (
                  <div key={i} className="flex justify-between items-center border-b border-[#333] pb-4">
                    <div>
                      <h3 className="text-lg font-bold">{rel.name}</h3>
                      <p className="text-xs text-gray-500">{rel.type}</p>
                    </div>
                    <button onClick={() => router.push('/chat')} className="btn-secondary text-xs">Analyze</button>
                  </div>
               )) : (
                  <div className="flex justify-between items-center border-b border-[#333] pb-4">
                    <div>
                      <h3 className="text-lg font-bold">Mom</h3>
                      <p className="text-xs text-gray-500">Parent</p>
                    </div>
                    <button onClick={() => router.push('/chat')} className="btn-secondary text-xs">Analyze</button>
                  </div>
               )}
            </div>
          </section>

          {/* SECTION 3 - DAILY AUDIO */}
          <section className="card flex items-center justify-between">
            <div>
              <h2 className="text-h2 mb-2 tracking-widest text-gray-400">DAILY AUDIO</h2>
              <p className="text-xs text-gray-500">Family dynamics, transit pressures, communication patterns.</p>
            </div>
            <audio controls className="h-8 max-w-[200px]" src="/api/audio/daily" />
          </section>

          {/* SECTION 4 - ASK ABOUT A RELATIONSHIP */}
          <section className="card">
            <h2 className="text-h2 mb-4 tracking-widest text-gray-400">ASK ABOUT A RELATIONSHIP</h2>
            <div className="flex justify-between items-center">
                <p className="text-sm text-gray-300">Start a secure analytical thread regarding a relational dynamic.</p>
                <button onClick={() => router.push('/chat')} className="btn-primary">
                    OPEN CHAT
                </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
