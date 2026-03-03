import { calculateStability } from '../lib/engine/stability';
import { StabilityInputs } from '../lib/engine/types';

describe('calculateStability', () => {
  it('calculates correct score with full inputs', () => {
    const inputs: StabilityInputs = {
      sleepScore: 80, // 20
      stressScore: 30, // (100-30)*.25 = 17.5
      conflictDensity: 10, // (100-10)*.2 = 18
      escalationAvg: 20, // (100-20)*.2 = 16
      volatilityIndex: 15, // (100-15)*.1 = 8.5
    };
    // Expected: 20 + 17.5 + 18 + 16 + 8.5 = 80

    const result = calculateStability(inputs);

    expect(result.score).toBe(80);
    expect(result.label).toBe('strong');
    expect(result.confidence).toBe(100);
  });

  it('handles null sleep and stress scores', () => {
    const inputs: StabilityInputs = {
      sleepScore: null,
      stressScore: null,
      conflictDensity: 50,
      escalationAvg: 50,
      volatilityIndex: 50,
    };
    // sleep: 70 * 0.25 = 17.5
    // stress: (100-50) * 0.25 = 12.5
    // conflict: 50 * 0.2 = 10
    // escalation: 50 * 0.2 = 10
    // volatility: 50 * 0.1 = 5
    // Total: 55

    const result = calculateStability(inputs);

    expect(result.score).toBe(55);
    expect(result.label).toBe('moderate');
    expect(result.confidence).toBe(90); // 100 - 5 - 5
  });

  it('clamps scores above 100', () => {
    const inputs: StabilityInputs = {
      sleepScore: 100,
      stressScore: 0,
      conflictDensity: 0,
      escalationAvg: 0,
      volatilityIndex: 0,
    };

    const result = calculateStability(inputs);

    expect(result.score).toBe(100);
  });

  it('clamps scores below 0', () => {
    const inputs: StabilityInputs = {
      sleepScore: 0,
      stressScore: 100,
      conflictDensity: 100,
      escalationAvg: 100,
      volatilityIndex: 100,
    };

    const result = calculateStability(inputs);

    expect(result.score).toBe(0);
    expect(result.label).toBe('low');
  });

  it('assigns labels correctly', () => {
    // Score should be ~35 (low)
    const result1 = calculateStability({
      sleepScore: 20,
      stressScore: 80,
      conflictDensity: 80,
      escalationAvg: 80,
      volatilityIndex: 80,
    });
    expect(result1.label).toBe('low');

    // Score should be ~60 (moderate)
    const result2 = calculateStability({
      sleepScore: 60,
      stressScore: 40,
      conflictDensity: 40,
      escalationAvg: 40,
      volatilityIndex: 40,
    });
    expect(result2.label).toBe('moderate');

    // Score should be ~80 (strong)
    const result3 = calculateStability({
      sleepScore: 90,
      stressScore: 10,
      conflictDensity: 10,
      escalationAvg: 10,
      volatilityIndex: 10,
    });
    expect(result3.label).toBe('strong');
  });
});
