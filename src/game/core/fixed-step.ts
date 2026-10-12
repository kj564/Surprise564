export interface FixedStepOptions {
  readonly stepSeconds?: number;
  readonly maxFrameSeconds?: number;
  readonly maxStepsPerFrame?: number;
}

export interface FixedStepResult {
  readonly steps: number;
  /** Fractional progress toward the next simulation step, always in [0, 1). */
  readonly alpha: number;
  /** Time deliberately discarded to prevent an unbounded catch-up spiral. */
  readonly droppedSeconds: number;
}

/** Accumulates real frame time while advancing gameplay in deterministic fixed-size steps. */
export class FixedStepClock {
  readonly stepSeconds: number;
  readonly maxFrameSeconds: number;
  readonly maxStepsPerFrame: number;
  private accumulator = 0;

  constructor(options: FixedStepOptions = {}) {
    this.stepSeconds = positiveFinite(options.stepSeconds ?? 1 / 60, 'stepSeconds');
    this.maxFrameSeconds = positiveFinite(options.maxFrameSeconds ?? 0.25, 'maxFrameSeconds');
    this.maxStepsPerFrame = positiveInteger(options.maxStepsPerFrame ?? 5, 'maxStepsPerFrame');
    if (this.maxFrameSeconds < this.stepSeconds) {
      throw new RangeError('maxFrameSeconds must be at least one simulation step');
    }
  }

  advance(frameSeconds: number, step: (deltaSeconds: number) => void): FixedStepResult {
    if (!Number.isFinite(frameSeconds) || frameSeconds < 0) {
      throw new RangeError('frameSeconds must be finite and non-negative');
    }
    if (typeof step !== 'function') throw new TypeError('step must be a function');

    const acceptedFrame = Math.min(frameSeconds, this.maxFrameSeconds);
    let droppedSeconds = frameSeconds - acceptedFrame;
    this.accumulator += acceptedFrame;
    let steps = 0;

    while (this.accumulator + Number.EPSILON >= this.stepSeconds && steps < this.maxStepsPerFrame) {
      step(this.stepSeconds);
      this.accumulator -= this.stepSeconds;
      if (this.accumulator < 0 && this.accumulator > -Number.EPSILON * 4) this.accumulator = 0;
      steps += 1;
    }

    if (this.accumulator >= this.stepSeconds) {
      const wholeStepsDropped = Math.floor((this.accumulator + this.stepSeconds * 1e-10) / this.stepSeconds);
      const timeDropped = wholeStepsDropped * this.stepSeconds;
      this.accumulator = Math.max(0, this.accumulator - timeDropped);
      droppedSeconds += timeDropped;
    }

    return Object.freeze({
      steps,
      alpha: Math.min(1 - Number.EPSILON, Math.max(0, this.accumulator / this.stepSeconds)),
      droppedSeconds,
    });
  }

  reset(): void {
    this.accumulator = 0;
  }

  get interpolationAlpha(): number {
    return Math.min(1 - Number.EPSILON, Math.max(0, this.accumulator / this.stepSeconds));
  }
}

function positiveFinite(value: number, name: string): number {
  if (!Number.isFinite(value) || value <= 0) throw new RangeError(name + ' must be finite and positive');
  return value;
}

function positiveInteger(value: number, name: string): number {
  if (!Number.isSafeInteger(value) || value <= 0) throw new RangeError(name + ' must be a positive safe integer');
  return value;
}
