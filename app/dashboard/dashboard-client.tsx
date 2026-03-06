"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/supabase";
import Link from 'next/link';

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);

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
        } else {
          setData({});
        }
      } catch (e) {
        console.error("Error fetching dashboard", e);
        setData({});
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

          {/* PANEL 1 - Today */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Today</h2>
            {!data?.today ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333]">
                <p className="text-sm text-gray-500 mb-4">No data generated for today.</p>
                <button className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors">
                  Generate today's brief
                </button>
              </div>
            ) : (
              <ul className="space-y-2 text-sm">
                {Object.entries(data.today).map(([key, val]: any) => (
                  <li key={key} className="flex justify-between border-b border-[#222] pb-2">
                    <span className="text-gray-300">{key}</span>
                    <span className="text-white">{val}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* PANEL 2 - Relationships */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Relationships</h2>
            {!data?.relationships?.length ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333]">
                <p className="text-sm text-gray-500 mb-4">No connections analyzed yet.</p>
                <Link href="/relationships/new" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors">
                  Add someone
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.relationships.map((rel: any, i: number) => (
                  <div key={i} className="border border-[#222] p-4 text-center">
                    <div className="text-lg">{rel.name}</div>
                    <div className="text-xs text-gray-500 mt-2">{rel.status || 'Active'}</div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* PANEL 3 - Daily Audio */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Daily Audio</h2>
            {!data?.daily_audio ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333]">
                <p className="text-sm text-gray-500 mb-4">No audio brief available.</p>
                <button className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors">
                  Generate today's brief
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Family dynamics, transit pressures, communication patterns.</p>
                </div>
                <audio controls className="h-8 max-w-[200px]" src={data.daily_audio} />
              </div>
            )}
          </section>

          {/* PANEL 4 - Ask About a Relationship */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Ask About a Relationship</h2>
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333]">
              <p className="text-sm text-gray-500 mb-4">Analyze dynamics with the Intelligence Console.</p>
              <Link href="/chat" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors">
                Ask about a relationship
              </Link>
            </div>
          </section>

        </div>
      )}
    </div>
  );
}
