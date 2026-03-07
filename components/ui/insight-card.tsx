'use client';

import React, { useState } from 'react';
import type { DefragInsightCard } from '@/lib/types';
import { MicroLabel, Body, Spacer } from '@/components/editorial';

interface InsightCardProps {
  card: DefragInsightCard;
  onExplore?: () => void;
  onGroundMe?: () => void;
  onSave?: () => void;
  isSaved?: boolean;
}

const SHADOW_COLORS: Record<string, string> = {
  fear: '#607D8B', // muted blue
  shame: '#9575CD', // soft violet
  anger: '#E57373', // ember red
  grief: '#B0BEC5', // silver gray
  confusion: '#7986CB', // pale indigo
  guilt: '#FFB74D', // warm amber
  default: '#78909C' // default shadow color
};

const GIFT_COLORS: Record<string, string> = {
  discernment: '#FFD54F', // gold
  boundaries: '#3949AB', // deep indigo
  voice: '#1E88E5', // cobalt
  compassion: '#F06292', // rose
  clarity: '#EEEEEE', // pearl
  default: '#E0E0E0' // default gift color
};

export function InsightCard({ card, onExplore, onGroundMe, onSave, isSaved }: InsightCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const shadowTone = card.tone && card.tone.length > 0 ? card.tone[0].toLowerCase() : 'default';
  const shadowColor = SHADOW_COLORS[shadowTone] || SHADOW_COLORS.default;

  const giftKey = card.gift ? card.gift.toLowerCase() : 'default';
  const giftColor = GIFT_COLORS[giftKey] || GIFT_COLORS.default;

  return (
    <div className="w-full max-w-md mx-auto my-8 perspective-1000 df-reveal is-on" style={{ perspective: '1000px' }}>
      <div
        className={`relative w-full transition-transform duration-700 preserve-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
        style={{ transformStyle: 'preserve-3d', transitionDuration: '700ms' }}
        onClick={() => setIsFlipped(!isFlipped)}
      >
        {/* Front */}
        <div
          className="w-full bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden backface-hidden"
          style={{
            backfaceVisibility: 'hidden',
            boxShadow: `0 20px 40px -20px ${shadowColor}30`,
          }}
        >
          {/* Subtle background gradient based on shadow emotion */}
          <div
            className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at top right, ${shadowColor}, transparent 50%)`
            }}
          />

          <div className="relative z-10">
            <MicroLabel>{card.title || "What DEFRAG notices"}</MicroLabel>
            <Spacer size="m" />

            <p className="font-serif text-[22px] leading-[1.4] text-white/90 mb-8 font-light">
              {card.insight}
            </p>

            <div className="flex flex-col gap-4 border-t border-white/10 pt-6 mt-6">
              <div>
                <MicroLabel>Pattern</MicroLabel>
                <div className="text-[14px] text-white/70 mt-1">{card.pattern}</div>
              </div>
              <div>
                <MicroLabel>Atmosphere</MicroLabel>
                <div className="text-[14px] text-white/50 mt-1 capitalize">{card.tone.join(' / ')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Back */}
        <div
          className="absolute top-0 left-0 w-full h-full bg-[#111] border border-white/10 rounded-2xl p-6 shadow-2xl overflow-hidden backface-hidden rotate-y-180"
          style={{
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            boxShadow: `0 20px 40px -20px ${giftColor}30`,
          }}
        >
          {/* Subtle background gradient based on emerging gift */}
          <div
            className="absolute bottom-0 left-0 w-full h-full opacity-10 pointer-events-none"
            style={{
              background: `radial-gradient(circle at bottom left, ${giftColor}, transparent 70%)`
            }}
          />

          <div className="relative z-10 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <MicroLabel>Emerging Gift</MicroLabel>
                <div className="h-[1px] flex-1 bg-white/10" />
                <span className="text-[14px] font-medium" style={{ color: giftColor }}>
                  {card.gift}
                </span>
              </div>

              <MicroLabel>Quiet Reframe</MicroLabel>
              <p className="font-serif text-[18px] leading-[1.5] text-white/80 mt-2 mb-6 italic">
                {card.reframe}
              </p>

              <MicroLabel>Small Alignment</MicroLabel>
              <p className="text-[15px] leading-[1.6] text-white/70 mt-2">
                {card.next_step}
              </p>

              {card.why_now && (
                <div className="mt-6 pt-6 border-t border-white/10">
                  <MicroLabel>Why this may be appearing now</MicroLabel>
                  <p className="text-[13px] leading-[1.5] text-white/40 mt-2">
                    {card.why_now}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Controls below card */}
      <div className="mt-6 flex flex-wrap gap-3 justify-center">
        <button
          onClick={(e) => { e.stopPropagation(); setIsFlipped(!isFlipped); }}
          className="text-[12px] uppercase tracking-wider font-mono px-4 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
        >
          Flip
        </button>
        {onSave && (
          <button
            onClick={(e) => { e.stopPropagation(); onSave(); }}
            className={`text-[12px] uppercase tracking-wider font-mono px-4 py-2 border rounded-full transition-colors ${isSaved ? 'border-white text-white' : 'border-white/20 text-white/60 hover:bg-white/5 hover:text-white'}`}
          >
            {isSaved ? 'Saved' : 'Save'}
          </button>
        )}
        {onExplore && (
          <button
            onClick={(e) => { e.stopPropagation(); onExplore(); }}
            className="text-[12px] uppercase tracking-wider font-mono px-4 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            Explore Pattern
          </button>
        )}
        {onGroundMe && (
          <button
            onClick={(e) => { e.stopPropagation(); onGroundMe(); }}
            className="text-[12px] uppercase tracking-wider font-mono px-4 py-2 border border-white/20 rounded-full hover:bg-white/5 transition-colors text-white/60 hover:text-white"
          >
            Ground Me
          </button>
        )}
      </div>
    </div>
  );
}
