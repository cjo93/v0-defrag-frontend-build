import React from 'react';

const chips = [
  'Private by default',
  'Delete anytime',
  'No social feed',
  'Free tier',
];

export default function TrustChips() {
  return (
    <div className="w-full py-3 bg-[var(--bg-1)] border-b border-[var(--border-0)]">
      <div className="mx-auto max-w-[1240px] px-4 flex gap-2 overflow-x-auto scrollbar-hide">
        {chips.map((chip) => (
          <span
            key={chip}
            className="inline-block px-4 py-2 min-w-[120px] text-[15px] rounded-full bg-[rgba(255,255,255,0.04)] text-[var(--text-1)] border border-[var(--border-0)] font-medium select-none focus-visible:outline focus-visible:outline-2"
            tabIndex={0}
          >
            {chip}
          </span>
        ))}
      </div>
    </div>
  );
}
