'use client';

import { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  label: string;
  radius: number;
  opacity: number;
  pulseSpeed: number;
  pulsePhase: number;
}

interface Edge {
  from: number;
  to: number;
  opacity: number;
}

const NODES: Node[] = [
  { x: 0.5, y: 0.45, label: 'You', radius: 8, opacity: 1, pulseSpeed: 0, pulsePhase: 0 },
  { x: 0.22, y: 0.25, label: 'Mom', radius: 5, opacity: 0.9, pulseSpeed: 2.5, pulsePhase: 0 },
  { x: 0.78, y: 0.2, label: 'Partner', radius: 5.5, opacity: 0.95, pulseSpeed: 3, pulsePhase: 1 },
  { x: 0.15, y: 0.6, label: 'Sister', radius: 4.5, opacity: 0.75, pulseSpeed: 2, pulsePhase: 2 },
  { x: 0.82, y: 0.58, label: 'Best friend', radius: 4, opacity: 0.7, pulseSpeed: 2.8, pulsePhase: 0.5 },
  { x: 0.35, y: 0.72, label: 'Dad', radius: 4, opacity: 0.55, pulseSpeed: 2.2, pulsePhase: 1.5 },
  { x: 0.68, y: 0.78, label: 'Boss', radius: 3.5, opacity: 0.45, pulseSpeed: 1.8, pulsePhase: 3 },
  { x: 0.38, y: 0.15, label: 'Ex', radius: 3, opacity: 0.35, pulseSpeed: 3.5, pulsePhase: 2.5 },
];

const EDGES: Edge[] = [
  { from: 0, to: 1, opacity: 0.6 },
  { from: 0, to: 2, opacity: 0.7 },
  { from: 0, to: 3, opacity: 0.5 },
  { from: 0, to: 4, opacity: 0.45 },
  { from: 0, to: 5, opacity: 0.35 },
  { from: 0, to: 6, opacity: 0.3 },
  { from: 0, to: 7, opacity: 0.2 },
  { from: 1, to: 3, opacity: 0.15 },
  { from: 1, to: 5, opacity: 0.2 },
  { from: 2, to: 4, opacity: 0.12 },
];

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const progressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx!.scale(dpr, dpr);
    }
    resize();
    window.addEventListener('resize', resize);

    const startTime = performance.now();

    function draw(now: number) {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;

      ctx.clearRect(0, 0, w, h);

      const elapsed = (now - startTime) / 1000;
      const introProgress = reduceMotion ? 1 : Math.min(elapsed / 1.8, 1);
      progressRef.current = introProgress;
      const ease = 1 - Math.pow(1 - introProgress, 3); // ease-out cubic

      // Draw edges
      for (const edge of EDGES) {
        const from = NODES[edge.from];
        const to = NODES[edge.to];
        const x1 = from.x * w;
        const y1 = from.y * h;
        const x2 = to.x * w;
        const y2 = to.y * h;

        const lineProgress = ease;
        const curX = x1 + (x2 - x1) * lineProgress;
        const curY = y1 + (y2 - y1) * lineProgress;

        const gradient = ctx.createLinearGradient(x1, y1, curX, curY);
        gradient.addColorStop(0, `rgba(139, 92, 246, ${edge.opacity * 0.25 * ease})`);
        gradient.addColorStop(1, `rgba(99, 102, 241, ${edge.opacity * 0.1 * ease})`);

        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(curX, curY);
        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // Draw nodes
      for (let i = 0; i < NODES.length; i++) {
        const node = NODES[i];
        const x = node.x * w;
        const y = node.y * h;

        const nodeDelay = i * 0.08;
        const nodeProgress = reduceMotion ? 1 : Math.max(0, Math.min((elapsed - nodeDelay) / 0.8, 1));
        const nodeEase = 1 - Math.pow(1 - nodeProgress, 3);

        // Pulse
        const pulse = reduceMotion ? 1 :
          1 + Math.sin(elapsed * node.pulseSpeed + node.pulsePhase) * 0.15;

        const currentRadius = node.radius * nodeEase * pulse;
        const currentOpacity = node.opacity * nodeEase;

        // Glow
        if (i === 0) {
          // Center "You" node — stronger glow
          const glow = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 6);
          glow.addColorStop(0, `rgba(139, 92, 246, ${0.25 * currentOpacity})`);
          glow.addColorStop(0.5, `rgba(99, 102, 241, ${0.08 * currentOpacity})`);
          glow.addColorStop(1, 'rgba(99, 102, 241, 0)');
          ctx.beginPath();
          ctx.arc(x, y, currentRadius * 6, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        } else {
          // Outer nodes — subtle glow
          const glow = ctx.createRadialGradient(x, y, 0, x, y, currentRadius * 4);
          glow.addColorStop(0, `rgba(139, 92, 246, ${0.12 * currentOpacity})`);
          glow.addColorStop(1, 'rgba(139, 92, 246, 0)');
          ctx.beginPath();
          ctx.arc(x, y, currentRadius * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
        }

        // Node circle
        const nodeGrad = ctx.createRadialGradient(x, y, 0, x, y, currentRadius);
        if (i === 0) {
          nodeGrad.addColorStop(0, `rgba(255, 255, 255, ${0.95 * currentOpacity})`);
          nodeGrad.addColorStop(1, `rgba(139, 92, 246, ${0.6 * currentOpacity})`);
        } else {
          nodeGrad.addColorStop(0, `rgba(199, 175, 255, ${0.7 * currentOpacity})`);
          nodeGrad.addColorStop(1, `rgba(139, 92, 246, ${0.3 * currentOpacity})`);
        }
        ctx.beginPath();
        ctx.arc(x, y, currentRadius, 0, Math.PI * 2);
        ctx.fillStyle = nodeGrad;
        ctx.fill();

        // Label
        if (nodeEase > 0.5) {
          const labelOpacity = (nodeEase - 0.5) * 2 * node.opacity;
          ctx.font = `${i === 0 ? 12 : 11}px ui-monospace, SFMono-Regular, Menlo, monospace`;
          ctx.textAlign = 'center';
          ctx.fillStyle = `rgba(255, 255, 255, ${labelOpacity * 0.6})`;
          ctx.fillText(node.label, x, y - currentRadius - 8);
        }
      }

      // Floating particles
      if (!reduceMotion) {
        for (let p = 0; p < 6; p++) {
          const px = (Math.sin(elapsed * 0.3 + p * 1.7) * 0.3 + 0.5) * w;
          const py = (Math.cos(elapsed * 0.2 + p * 2.1) * 0.3 + 0.5) * h;
          const pOpacity = (Math.sin(elapsed * 0.8 + p * 1.3) * 0.5 + 0.5) * 0.08 * ease;
          ctx.beginPath();
          ctx.arc(px, py, 1.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(139, 92, 246, ${pOpacity})`;
          ctx.fill();
        }
      }

      animRef.current = requestAnimationFrame(draw);
    }

    animRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-[560px] mx-auto">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        aria-label="Animated relationship constellation showing connected people"
        role="img"
      />
    </div>
  );
}
