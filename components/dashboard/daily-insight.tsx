import type { DailyInsight as DailyInsightType } from "@/lib/daily-insight"

export default function DailyInsight({ insight }: { insight: DailyInsightType | null }) {

  if (!insight) return null

  return (
    <div className="border border-white/10 bg-white/[0.02] p-6 mb-10">

      <div className="text-[11px] tracking-[0.28em] uppercase font-mono text-white/40 mb-3">
        DAILY INSIGHT
      </div>

      <div className="text-[18px] text-white/90 leading-relaxed mb-2">
        {insight.title}
      </div>

      {insight.detail && (
        <div className="text-[14px] text-white/60 leading-relaxed">
          {insight.detail}
        </div>
      )}

    </div>
  )
}
