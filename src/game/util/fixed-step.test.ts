import { describe, expect, test } from 'bun:test';
import { FixedStepClock } from './fixed-step';

describe('FixedStepClock', () => {
  test('advances only in fixed-size steps and retains interpolation remainder', () => {
    const clock = new FixedStepClock({ stepSeconds: 0.02, maxFrameSeconds: 0.2, maxStepsPerFrame: 10 });
    const deltas: number[] = [];
    const first = clock.advance(0.05, dt => deltas.push(dt));
    expect(first.steps).toBe(2);
    expect(deltas).toEqual([0.02, 0.02]);
    expect(first.alpha).toBeCloseTo(0.5);
    const second = clock.advance(0.01, dt => deltas.push(dt));
    expect(second.steps).toBe(1);
    expect(deltas).toHaveLength(3);
    expect(second.alpha).toBeCloseTo(0);
  });

  test('caps catch-up work and drops whole overdue steps', () => {
    const clock = new FixedStepClock({ stepSeconds: 0.02, maxFrameSeconds: 0.2, maxStepsPerFrame: 2 });
    let calls = 0;
    const result = clock.advance(0.12, () => { calls += 1; });
    expect(calls).toBe(2);
    expect(result.steps).toBe(2);
    expect(result.droppedSeconds).toBeCloseTo(0.08);
    expect(result.alpha).toBeCloseTo(0);
  });

  test('caps long frame deltas to prevent a catch-up spiral', () => {
    const clock = new FixedStepClock({ stepSeconds: 0.02, maxFrameSeconds: 0.1, maxStepsPerFrame: 2 });
    const result = clock.advance(1, () => {});
    expect(result.steps).toBe(2);
    expect(result.droppedSeconds).toBeCloseTo(0.96);
  });

  test('reset clears fractional accumulated time', () => {
    const clock = new FixedStepClock({ stepSeconds: 0.02 });
    clock.advance(0.01, () => {});
    expect(clock.interpolationAlpha).toBeCloseTo(0.5);
    clock.reset();
    expect(clock.interpolationAlpha).toBe(0);
    expect(clock.advance(0.01, () => {}).steps).toBe(0);
  });

  test('rejects invalid deltas and options', () => {
    expect(() => new FixedStepClock({ stepSeconds: 0 })).toThrow(RangeError);
    expect(() => new FixedStepClock({ stepSeconds: 0.2, maxFrameSeconds: 0.1 })).toThrow(RangeError);
    const clock = new FixedStepClock();
    expect(() => clock.advance(-1, () => {})).toThrow(RangeError);
    expect(() => clock.advance(0, null as unknown as () => void)).toThrow(TypeError);
  });
});
