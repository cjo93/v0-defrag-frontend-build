"use client";

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

type DailyBriefingResponse = {
  ok: boolean;
  summary: string | null;
  date: string;
};

type LiveStateResponse = {
  ok: boolean;
  total_people: number;
  states: Record<string, number>;
};

type SystemMapResponse = {
  ok: boolean;
  nodes: Array<{ id: string; label: string; type: string; weight?: number }>;
  edges: Array<{ source: string; target: string; weight?: number }>;
};

export default function DashboardClient() {
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [briefing, setBriefing] = useState<string | null>(null);
  const [briefingDate, setBriefingDate] = useState<string>('');
  const [liveState, setLiveState] = useState<LiveStateResponse | null>(null);
  const [systemMap, setSystemMap] = useState<SystemMapResponse | null>(null);

  const [plan, setPlan] = useState('free');
  const [subscriptionStatus, setSubscriptionStatus] = useState('none');
  const [isSoloUnlocked, setIsSoloUnlocked] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [briefRes, stateRes, mapRes, meRes] = await Promise.all([
        fetch('/api/daily-briefing', { credentials: 'include' }),
        fetch('/api/live-state', { credentials: 'include' }),
        fetch('/api/system-map', { credentials: 'include' }),
        fetch('/api/me', { cache: 'no-store' }),
      ]);

      if (briefRes.ok) {
        const briefJson: DailyBriefingResponse = await briefRes.json();
        setBriefing(briefJson.summary);
        setBriefingDate(briefJson.date);
      } else {
        setBriefing(null);
      }

      if (stateRes.ok) {
        setLiveState(await stateRes.json());
      } else {
        setLiveState(null);
      }

      if (mapRes.ok) {
        setSystemMap(await mapRes.json());
      } else {
        setSystemMap(null);
      }

      if (meRes.ok) {
        const meJson = await meRes.json();
        setPlan(meJson.plan || 'free');
        setSubscriptionStatus(meJson.subscription_status || 'none');
        setIsSoloUnlocked(!!meJson.is_solo_unlocked);
      } else {
        setPlan('free');
        setSubscriptionStatus('none');
        setIsSoloUnlocked(false);
      }
    } catch (error) {
      console.error('Error fetching dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleGenerateBrief = async () => {
    setGenerating(true);
    try {
      const res = await fetch('/api/daily-briefing', { credentials: 'include' });
      if (!res.ok) return;
      const json: DailyBriefingResponse = await res.json();
      setBriefing(json.summary);
      setBriefingDate(json.date);
    } finally {
      setGenerating(false);
    }
  };

  const positionedNodes = useMemo(() => {
    if (!systemMap?.ok || !systemMap.nodes?.length) return [];

    const centerX = 50;
    const centerY = 50;
    const ring = 36;

    const others = systemMap.nodes.filter((n) => n.id !== 'self');
    return [
      { id: 'self', label: 'You', x: centerX, y: centerY, weight: 2 },
      ...others.map((node, idx) => {
        const angle = (idx / Math.max(others.length, 1)) * Math.PI * 2;
        return {
          id: node.id,
          label: node.label,
          x: centerX + Math.cos(angle) * ring,
          y: centerY + Math.sin(angle) * ring,
          weight: node.weight ?? 1,
        };
      }),
    ];
  }, [systemMap]);

  return (
    <div className="min-h-screen bg-black text-white font-mono p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center border-b border-[#333] pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-widest">DEFRAG</h1>
        <div className="text-xs text-gray-500">Connected to internal APIs</div>
      </header>

      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-4xl" aria-label="Loading dashboard">
          <div className="h-32 bg-[#111] border border-[#333]" />
          <div className="h-64 bg-[#111] border border-[#333]" />
        </div>
      ) : (
        <div className="w-full max-w-4xl space-y-8">
          {/* Premium state banner */}
          {!isSoloUnlocked && (
            <div className="border border-yellow-500 bg-yellow-100 text-yellow-900 p-4 rounded mb-8">
              <div className="font-bold">Premium features locked</div>
              <div className="text-sm mt-2">Upgrade to DEFRAG OS to unlock daily briefings and intelligence console.</div>
              <Link href="/unlock" className="inline-block mt-2 bg-yellow-500 text-black px-4 py-2 rounded font-bold hover:bg-yellow-600 transition">Upgrade Now</Link>
            </div>
          )}
          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Today</h2>
            {!briefing ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333]">
                <p className="text-sm text-gray-500 mb-4">No daily brief generated yet.</p>
                <button
                  onClick={handleGenerateBrief}
                  disabled={generating}
                  className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {generating ? 'Generating...' : "Generate today's brief"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-gray-500">{briefingDate}</p>
                <p className="text-sm text-white/90 leading-relaxed">{briefing}</p>
                <button
                  onClick={handleGenerateBrief}
                  disabled={generating}
                  className="text-xs underline underline-offset-4 text-white/70 hover:text-white"
                >
                  Regenerate
                </button>
              </div>
            )}
          </section>

          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Live Family Map</h2>
            {!systemMap?.ok || (systemMap.nodes?.length ?? 0) <= 1 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-[#333]">
                <p className="text-sm text-gray-500 mb-4">No connections analyzed yet.</p>
                <Link href="/relationships" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest hover:bg-gray-200 transition-colors">
                  Add someone
                </Link>
              </div>
            ) : (
              <div className="border border-[#222] p-3">
                <svg viewBox="0 0 100 100" className="w-full h-[300px]" role="img" aria-label="Relationship system map">
                  {systemMap.edges.map((edge) => {
                    const source = positionedNodes.find((n) => n.id === edge.source);
                    const target = positionedNodes.find((n) => n.id === edge.target);
                    if (!source || !target) return null;
                    return (
                      <line
                        key={`${edge.source}-${edge.target}`}
                        x1={source.x}
                        y1={source.y}
                        x2={target.x}
                        y2={target.y}
                        stroke="rgba(255,255,255,0.35)"
                        strokeWidth={Math.max(0.3, (edge.weight ?? 1) * 0.25)}
                      />
                    );
                  })}
                  {positionedNodes.map((node) => (
                    <g key={node.id}>
                      <circle
                        cx={node.x}
                        cy={node.y}
                        r={node.id === 'self' ? 4 : 2 + Math.min(node.weight, 5) * 0.45}
                        fill="white"
                        fillOpacity={node.id === 'self' ? 0.95 : 0.75}
                      />
                      <text x={node.x} y={node.y + 6} fill="white" opacity="0.8" textAnchor="middle" fontSize="3">
                        {node.label}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            )}
          </section>

          <section className="border border-[#333] p-6 bg-[#0a0a0a]">
            <h2 className="text-sm uppercase tracking-widest text-gray-400 mb-4">Live State</h2>
            {!liveState?.ok ? (
              <p className="text-sm text-gray-500">No live relationship state available.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between border-b border-[#222] pb-2">
                  <span className="text-gray-300">Total People</span>
                  <span className="text-white">{liveState.total_people}</span>
                </li>
                {Object.entries(liveState.states).map(([key, value]) => (
                  <li key={key} className="flex justify-between border-b border-[#222] pb-2">
                    <span className="text-gray-300 capitalize">{key}</span>
                    <span className="text-white">{value}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

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
