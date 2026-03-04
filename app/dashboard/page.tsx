"use client";

import { useEffect, useState } from "react";
import { getSession } from "@/lib/supabase";

export default function DashboardPage() {
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

          {/* SECTION 1 - Natal Overview */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Natal Overview</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="border border-[#222] p-4 text-center">
                <div className="text-xs text-gray-500">SUN</div>
                <div className="text-lg">{data?.natal?.sun || "Aquarius"}</div>
              </div>
              <div className="border border-[#222] p-4 text-center">
                <div className="text-xs text-gray-500">MOON</div>
                <div className="text-lg">{data?.natal?.moon || "Scorpio"}</div>
              </div>
              <div className="border border-[#222] p-4 text-center">
                <div className="text-xs text-gray-500">RISING</div>
                <div className="text-lg">{data?.natal?.rising || "Gemini"}</div>
              </div>
            </div>
          </section>

          {/* SECTION 2 - Relational Dynamics Table */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Relational Dynamics</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 border-b border-[#333]">
                  <tr>
                    <th className="py-3 px-4">Planet</th>
                    <th className="py-3 px-4">House</th>
                    <th className="py-3 px-4">Aspect</th>
                    <th className="py-3 px-4">Relational Meaning</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.dynamics?.length ? data.dynamics.map((row: any, i: number) => (
                    <tr key={i} className="border-b border-[#222]">
                      <td className="py-3 px-4">{row.planet}</td>
                      <td className="py-3 px-4">{row.house}</td>
                      <td className="py-3 px-4">{row.aspect}</td>
                      <td className="py-3 px-4">{row.meaning}</td>
                    </tr>
                  )) : (
                    <tr className="border-b border-[#222]">
                      <td className="py-3 px-4">Saturn</td>
                      <td className="py-3 px-4">4th House</td>
                      <td className="py-3 px-4">Family Responsibility</td>
                      <td className="py-3 px-4">Pressure from family expectations</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* SECTION 3 - Live Astrology Metrics */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Live Metrics</h2>
            <ul className="space-y-2 text-sm">
              <li className="flex justify-between border-b border-[#222] pb-2">
                <span className="text-gray-300">Communication Pressure</span>
                <span className="text-white">Medium</span>
              </li>
              <li className="flex justify-between border-b border-[#222] pb-2">
                <span className="text-gray-300">Authority Dynamics</span>
                <span className="text-white">High</span>
              </li>
              <li className="flex justify-between border-b border-[#222] pb-2">
                <span className="text-gray-300">Boundary Tension</span>
                <span className="text-white">Low</span>
              </li>
            </ul>
          </section>

          {/* SECTION 4 - Daily Audio Overview */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a] flex items-center justify-between">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-2">Daily Audio Brief</h2>
              <p className="text-xs text-gray-500">Family dynamics, transit pressures, communication patterns.</p>
            </div>
            <audio controls className="h-8 max-w-[200px]" src="/api/audio/daily" />
          </section>

          {/* SECTION 5 - Relationship Chat */}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Relationship Chat</h2>
            <form className="flex space-x-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="text"
                placeholder="Why does my dad push me so hard?"
                className="flex-1 bg-black border border-[#333] px-4 py-2 text-sm focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors"
              >
                SEND
              </button>
            </form>
          </section>
        </div>
      )}
    </div>
  );
}
