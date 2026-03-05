import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog } from '@headlessui/react';

// Accent color
const ACCENT = '#FFD700'; // warm gold
const BG = '#000';
const LINE = 'rgba(255,255,255,0.12)';

// Step data
const steps = [
  {
    title: 'Patterns repeat for a reason.',
    body: 'Different response styles collide. The same argument shows up again with new words.',
    visual: 'pattern',
    micro: '',
  },
  {
    title: 'Start with birth data.',
    body: 'DEFRAG uses your birth date, time, and location to generate a personal pattern map.',
    visual: 'birth',
    micro: 'If time is missing, DEFRAG uses stable planetary positions to generate a partial map.',
    tooltip: 'Date, time, and location. Time is optional.'
  },
  {
    title: 'Multiple lenses. One clear model.',
    body: 'DEFRAG combines several established pattern frameworks into one integrated view.',
    visual: 'frameworks',
    micro: '',
    expandable: [
      { label: 'Astrology', desc: 'Natal pattern structure' },
      { label: 'Human Design', desc: 'Energy + interaction mechanics' },
      { label: 'Gene Keys', desc: 'Themes + growth patterns' },
    ],
  },
  {
    title: 'Maps the interaction — not just the individual.',
    body: 'It shows where tension starts, how it escalates, and how to shift the moment.',
    visual: 'relationship',
    micro: '',
    cta: 'Show a sample loop',
  },
  {
    title: 'Many patterns are inherited.',
    body: 'Families pass down ways of coping — silence, control, avoidance, emotional shutdown. DEFRAG can highlight themes that repeat across generations.',
    visual: 'generational',
    micro: '',
  },
];

// Output card mock
const resultCard = {
  headline: 'Complex patterns. Simple guidance.',
  bullets: [
    "What's happening",
    'Why this pattern repeats',
    'What may help',
  ],
  action: 'Do this now',
  sentence: 'One line to say',
};

function SchematicSVG({ step, accent }: { step: number; accent?: boolean }) {
  // ...SVGs for each step...
  // For brevity, use placeholder rectangles. Replace with real SVGs per spec.
  return (
    <svg width="240" height="240" style={{ background: BG }}>
      <rect x="20" y="20" width="200" height="200" rx="24" fill={BG} stroke={accent ? ACCENT : LINE} strokeWidth="2" />
      <text x="120" y="130" textAnchor="middle" fill={accent ? ACCENT : '#fff'} fontSize="20">{steps[step].visual}</text>
    </svg>
  );
}

export default function HowDefragWorksExplainer() {
  const ref = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showFrameworks, setShowFrameworks] = useState(false);

  // IntersectionObserver for scrollytelling
  useEffect(() => {
    const panels = ref.current?.querySelectorAll('.defrag-step-panel');
    if (!panels) return;
    const obs = new window.IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const idx = Number(entry.target.getAttribute('data-step'));
            setActiveStep(idx);
          }
        });
      },
      { threshold: 0.5 }
    );
    panels.forEach(panel => obs.observe(panel));
    return () => obs.disconnect();
  }, []);

  // Mobile detection
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <section className="w-full bg-black py-20 px-4" style={{ background: BG }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-12">
        {/* Left: Steps */}
        <div className="flex-1" ref={ref}>
          <h2 className="text-3xl font-semibold text-white mb-2">How DEFRAG Works</h2>
          <p className="text-lg text-gray-300 mb-4">DEFRAG turns personal patterns, relationship dynamics, and family history into clear guidance you can use in real moments.</p>
          <p className="text-xs text-gray-500 mb-8">Built from birth data and established pattern frameworks. Explained in plain language.</p>
          {steps.map((step, i) => (
            <motion.div
              key={i}
              className="defrag-step-panel mb-12"
              data-step={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: activeStep === i ? 1 : 0.5, y: activeStep === i ? 0 : 40 }}
              transition={{ duration: 0.7 }}
              style={{ cursor: step.expandable ? 'pointer' : 'default' }}
            >
              <h3 className="text-xl font-bold text-white mb-2">{step.title}</h3>
              <p className="text-base text-gray-300 mb-2">{step.body}</p>
              {step.micro && <p className="text-xs text-gray-500 mb-2">{step.micro}</p>}
              {step.tooltip && (
                <span className="ml-2 text-xs text-gray-400 border border-gray-600 rounded-full px-2 py-1 cursor-help" title={step.tooltip}>?</span>
              )}
              {step.expandable && (
                <button
                  className="text-xs text-gray-400 underline mt-2"
                  onClick={() => setShowFrameworks(v => !v)}
                >What frameworks?</button>
              )}
              {showFrameworks && step.expandable && (
                <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 mt-2">
                  {step.expandable.map((fw, idx) => (
                    <div key={fw.label} className="mb-1">
                      <span className="font-semibold text-white">{fw.label}</span>: <span className="text-gray-300">{fw.desc}</span>
                    </div>
                  ))}
                </div>
              )}
              {step.cta && (
                <button
                  className="mt-3 px-4 py-2 bg-gray-800 text-white rounded border border-gray-700 hover:bg-gray-700"
                  onClick={() => setShowModal(true)}
                >{step.cta}</button>
              )}
            </motion.div>
          ))}
        </div>
        {/* Right: Sticky Visual */}
        <div className="hidden md:block w-[320px] sticky top-32 h-[480px] flex items-center justify-center">
          <AnimatePresence>
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7 }}
            >
              <SchematicSVG step={activeStep} accent={true} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {/* Final Result Panel */}
      <div className="max-w-2xl mx-auto mt-20 bg-gray-950 border border-gray-800 rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">{resultCard.headline}</h3>
        <ul className="text-left text-gray-300 mb-4">
          {resultCard.bullets.map((b, i) => (
            <li key={i} className="mb-1">• {b}</li>
          ))}
        </ul>
        <div className="mb-2 text-lg text-yellow-300 font-semibold">{resultCard.action}</div>
        <div className="mb-4 text-gray-400 italic">{resultCard.sentence}</div>
        <div className="flex gap-4 justify-center mt-4">
          <button className="px-6 py-2 bg-yellow-600 text-black rounded font-bold">Enter DEFRAG</button>
          <button className="px-6 py-2 bg-gray-800 text-white rounded border border-gray-700 hover:bg-gray-700" onClick={() => setShowModal(true)}>See a Sample</button>
        </div>
      </div>
      {/* Modal for sample loop / sample output */}
      <Dialog open={showModal} onClose={() => setShowModal(false)} className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black/80" />
        <div className="bg-gray-950 border border-gray-800 rounded-2xl p-8 max-w-lg mx-auto z-10">
          <h4 className="text-xl font-bold text-white mb-2">Sample Output</h4>
          <p className="text-gray-300 mb-4">This is a sample DEFRAG response card. (Replace with real sample data.)</p>
          <ul className="text-left text-gray-300 mb-4">
            <li>What’s happening: ...</li>
            <li>Why this pattern repeats: ...</li>
            <li>What may help: ...</li>
          </ul>
          <div className="mb-2 text-lg text-yellow-300 font-semibold">Do this now: ...</div>
          <div className="mb-4 text-gray-400 italic">One line to say: ...</div>
          <button className="mt-4 px-6 py-2 bg-yellow-600 text-black rounded font-bold" onClick={() => setShowModal(false)}>Close</button>
        </div>
      </Dialog>
    </section>
  );
}
