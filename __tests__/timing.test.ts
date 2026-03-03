import { calculateTiming } from '../lib/engine/timing';

describe('calculateTiming', () => {
  it('calculates correct state (push)', () => {
    // Stability: 90 (*.4=36), conflict: 10 (*.2=18), escalation: 10 (*.2=18), volatility: 10 (*.1=9), sleepDeviation: 10 (*.1=9)
    // 36 + 18 + 18 + 9 + 9 = 90
    const result = calculateTiming(90, 10, 10, 10, 10);

    expect(result.score).toBe(90);
    expect(result.state).toBe('push');
  });

  it('calculates correct state (neutral)', () => {
    // Stability: 60 (*.4=24), conflict: 40 (*.2=12), escalation: 40 (*.2=12), volatility: 40 (*.1=6), sleepDeviation: 40 (*.1=6)
    // 24 + 12 + 12 + 6 + 6 = 60
    const result = calculateTiming(60, 40, 40, 40, 40);

    expect(result.score).toBe(60);
    expect(result.state).toBe('neutral');
  });

  it('calculates correct state (protect)', () => {
    // Stability: 30 (*.4=12), conflict: 80 (*.2=4), escalation: 80 (*.2=4), volatility: 80 (*.1=2), sleepDeviation: 80 (*.1=2)
    // 12 + 4 + 4 + 2 + 2 = 24
    const result = calculateTiming(30, 80, 80, 80, 80);

    expect(result.score).toBe(24);
    expect(result.state).toBe('protect');
  });

  it('clamps scores above 100', () => {
    const result = calculateTiming(100, 0, 0, 0, 0);
    expect(result.score).toBe(100);
  });

  it('clamps scores below 0', () => {
    const result = calculateTiming(0, 100, 100, 100, 100);
    expect(result.score).toBe(0);
  });
});
