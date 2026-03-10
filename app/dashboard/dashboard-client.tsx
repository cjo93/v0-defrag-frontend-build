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

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [briefRes, stateRes, mapRes] = await Promise.all([
        fetch('/api/daily-briefing', { credentials: 'include' }),
        fetch('/api/live-state', { credentials: 'include' }),
        fetch('/api/system-map', { credentials: 'include' }),
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
    <div className="min-h-screen bg-black text-white font-mono p-6 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-5xl flex justify-between items-center border-b border-white/10 pb-4 mb-8">
        <h1 className="text-xl font-bold tracking-widest">DEFRAG</h1>
        <div className="text-[11px] uppercase tracking-[0.12em] text-white/40">System Intelligence</div>
      </header>

      {loading ? (
        <div className="animate-pulse flex flex-col space-y-4 w-full max-w-5xl" aria-label="Loading dashboard">
          <div className="h-40 bg-white/[0.03] border border-white/10 rounded-xl" />
          <div className="h-72 bg-white/[0.03] border border-white/10 rounded-xl" />
          <div className="h-52 bg-white/[0.03] border border-white/10 rounded-xl" />
        </div>
      ) : (
        <div className="w-full max-w-5xl space-y-8">
          <section className="border border-white/10 rounded-xl p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
            <h2 className="text-sm uppercase tracking-widest text-white/45 mb-4">Daily Listen</h2>
            {!briefing ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/15 rounded-lg">
                <p className="text-sm text-white/45 mb-4">No daily brief generated yet.</p>
                <button
                  onClick={handleGenerateBrief}
                  disabled={generating}
                  className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  {generating ? 'Generating...' : "Generate today's brief"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-white/45">{briefingDate}</p>
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

          <section className="border border-white/10 rounded-xl p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
            <h2 className="text-sm uppercase tracking-widest text-white/45 mb-4">Live Family Map</h2>
            {!systemMap?.ok || (systemMap.nodes?.length ?? 0) <= 1 ? (
              <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/15 rounded-lg">
                <p className="text-sm text-white/45 mb-4">No connections analyzed yet.</p>
                <Link href="/relationships" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest rounded-lg hover:bg-gray-200 transition-colors">
                  Add someone
                </Link>
              </div>
            ) : (
              <div className="border border-white/10 rounded-lg p-3">
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

          <section className="border border-white/10 rounded-xl p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
            <h2 className="text-sm uppercase tracking-widest text-white/45 mb-4">System State</h2>
            {!liveState?.ok ? (
              <p className="text-sm text-white/45">No live relationship state available.</p>
            ) : (
              <ul className="space-y-2 text-sm">
                <li className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-white/70">Total People</span>
                  <span className="text-white">{liveState.total_people}</span>
                </li>
                {Object.entries(liveState.states).map(([key, value]) => (
                  <li key={key} className="flex justify-between border-b border-white/10 pb-2">
                    <span className="text-white/70 capitalize">{key}</span>
                    <span className="text-white">{value}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-white/10 rounded-xl p-6 bg-gradient-to-b from-white/[0.03] to-white/[0.01]">
            <h2 className="text-sm uppercase tracking-widest text-white/45 mb-4">AI Guidance</h2>
            <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/15 rounded-lg">
              <p className="text-sm text-white/45 mb-4">Analyze dynamics with the intelligence console.</p>
              <Link href="/chat" className="bg-white text-black px-6 py-2 text-sm font-bold tracking-widest rounded-lg hover:bg-gray-200 transition-colors">
                Ask about a relationship
              </Link>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
