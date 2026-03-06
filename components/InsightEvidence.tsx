import React from 'react';
import { ChevronDown } from 'lucide-react';

export interface InsightEvidenceProps {
  evidence?: {
    framework: string;
    label: string;
    data: any;
    why_it_matters: string;
  }[];
  confidence?: 'low' | 'medium' | 'high';
}

export function InsightEvidence({ evidence, confidence }: InsightEvidenceProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  if (!evidence || evidence.length === 0) return null;

  return (
    <div className="mt-4 border border-white/10 rounded-sm overflow-hidden bg-black/20">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
            Signals Used
          </span>
          {confidence && (
            <span className={`text-[10px] px-2 py-0.5 rounded-sm border ${
              confidence === 'high' ? 'border-green-500/20 text-green-400/80 bg-green-500/10' :
              confidence === 'medium' ? 'border-yellow-500/20 text-yellow-400/80 bg-yellow-500/10' :
              'border-white/10 text-white/40'
            }`}>
              {confidence.toUpperCase()} CONFIDENCE
            </span>
          )}
        </div>
        <ChevronDown
          size={14}
          className={`text-white/40 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="px-4 pb-4 pt-1 space-y-4 border-t border-white/5">
          {evidence.map((item, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[12px] font-medium text-white/80">{item.label}</span>
                <span className="text-[10px] text-white/40 px-1.5 py-0.5 bg-white/5 rounded-sm">
                  {item.framework}
                </span>
              </div>
              <p className="text-[13px] text-white/60 leading-relaxed">
                {item.why_it_matters}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
