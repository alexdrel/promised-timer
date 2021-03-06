export declare type Action = () => any;
export declare type RejectFunc = ((r: any) => void | null);

export default class Timer {
  static delay(msecOrAction: number | Action = 0, action?: Action) {
    let msec = 0;
    if (typeof msecOrAction === 'function') {
      action = msecOrAction;
    } else {
      msec = msecOrAction;
    }
    return new Timer(msec).start(action);
  }

  static Seconds(sec: number) {
    return new Timer(sec * 1000);
  }

  static Minutes(min: number) {
    return new Timer(min * 60 * 1000);
  }

  // can be used to swap Promise/A+ implementation
  // static Promise = Promise;
  // Any due to incompatibility between TS promise type and es6-promise
  static Promise: PromiseConstructorLike = Promise;

  static Cancelled = { cancelled: true };

  startedAt: number | null = null;
  elapsed: number | null = null;
  private timerId?: ReturnType<typeof globalThis.setTimeout> | null;
  private resolve?: Action | null;
  private reject?: RejectFunc | null;

  constructor(private msec: number = Infinity) {
  }

  getSeconds() {
    return this.msec / 1000;
  }

  cancel() {
    this.resolve = null;
    this.pause();
    if (this.reject) {
      this.reject(Timer.Cancelled);
      this.reject = null;
    }
  }

  reset(msec: number) {
    this.pause();
    this.msec = msec;
    return this;
  }

  Seconds(sec: number) {
    return this.reset(sec * 1000);
  }

  Minutes(min: number) {
    return this.reset(min * 60 * 1000);
  }

  tee(me: (t: Timer) => void) {
    return me(this), this;
  }

  start(action?: Action): Promise<void> {
    this.cancel();
    const p = this.hold(action);
    this.timerId = setTimeout(this.resolve as Action, this.msec);
    this.startedAt = Date.now();
    this.elapsed = 0;
    return p;
  }

  // pauses started timer, keeps tracks of the elapsed time
  pause() {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
      if (this.startedAt != null) {
        this.elapsed = (this.elapsed || 0) + Math.max(0, Date.now() - this.startedAt);
      }
      this.startedAt = null;
    }
  }

  // resumes paused timer with the remaining time
  resume() {
    this.rewind(Math.max(0, this.msec - (this.elapsed || 0)));
  }

  // Does not start timer but prepares promise
  // rewind or trigger to be called later
  hold(action?: Action): Promise<void> {
    const p = new (Timer.Promise as PromiseConstructor)((resolve: Action, reject: RejectFunc) => {
      this.resolve = resolve;
      this.reject = reject;
    }).then(() => this.pause());
    return action ? p.then(action) : p;
  }

  // Does not start timer but prepares repeated action
  // rewind or trigger to be called later for the first and later rounds (delayed when invoked from the action itself)
  repeat(action?: Action) {
    this.cancel();
    const repeatAction: any = () => this.hold(action)
      .then(repeatAction);
    return repeatAction();
  }

  // rewind timer to defult or specified timeout
  // can be used after start, pause, hold or repeat
  rewind(msec?: number) {
    this.pause();
    if (this.resolve) {
      this.timerId = setTimeout(this.resolve, msec != null ? msec : this.msec);
      this.startedAt = Date.now();
    }
  }

  // invoke action immediatelty (async)
  // can be used after start, pause, hold or repeat
  trigger() {
    this.reject = null;
    if (this.resolve) {
      this.resolve();
    }
    this.cancel();
  }
}

export { default as Stopwatch } from "./stopwatch";
