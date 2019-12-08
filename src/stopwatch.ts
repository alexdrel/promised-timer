import Timer, { RejectFunc } from "./promised-timer";
export declare type TAction = (elapsed: number) => any;
export default class Stopwatch {
  startedAt: number | null = null;
  elapsed = 0;
  stored = 0;

  private timerId?: ReturnType<typeof globalThis.setInterval> | null;

  marks: Array<{
    stamp: number;
    resolve?: (e: number) => void;
    reject?: (r: any) => void | null;
  }> = [];

  constructor(private tick: number = 100) {
  }

  // Create promise to be resolved at the specific time
  at(msec: number): Promise<number> {
    if (this.elapsed > msec) {
      return Promise.resolve(this.elapsed);
    }
    return new (Timer.Promise as PromiseConstructor)((resolve: TAction, reject: RejectFunc) => {
      this.marks.push({ stamp: msec, resolve, reject });
    });
  }

  // starts stopwatch
  start(): Promise<number> {
    this.stored = 0;
    this.resume();
    return this.at(+Infinity);
  }

  // pauses started timer, keeps tracks of the elapsed time
  pause() {
    if (this.timerId != null) {
      clearInterval(this.timerId);
      this.timerId = null;
      if (this.startedAt != null) {
        this.stored += Math.max(0, Date.now() - this.startedAt);
      }
      this.startedAt = null;
      this.elapsed = this.stored;
    }
  }

  // resumes paused timer with the remaining time
  resume() {
    if (this.timerId != null) {
      return;
    }
    this.startedAt = Date.now();
    this.timerId = setInterval(this.interval, this.tick);
  }

  cancel() {
    this.pause();

    for (const mark of this.marks) {
      if (mark.reject) {
        mark.reject(Timer.Cancelled);
        mark.resolve = mark.reject = undefined;
      }
    }
    this.marks = [];
  }

  stop() {
    this.pause();

    for (const mark of this.marks) {
      if (mark.resolve) {
        mark.resolve(this.elapsed);
        mark.resolve = mark.reject = undefined;
      }
    }
    this.marks = [];
  }

  rewind(msec: number, restart?: boolean) {
    const running = this.timerId != null;
    this.pause();
    this.stored = this.elapsed = msec;
    if (restart || (restart == null && running)) {
      this.resume();
    }
  }

  interval = () => {
    if (this.startedAt == null) {
      return;
    }
    this.elapsed = this.stored + Math.max(0, Date.now() - this.startedAt);
    for (const mark of this.marks) {
      if (mark.resolve && this.elapsed > mark.stamp) {
        mark.resolve(this.elapsed);
        mark.resolve = mark.reject = undefined;
      }
    }
  }
}
