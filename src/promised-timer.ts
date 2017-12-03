export declare type Action = () => any;

export default class Timer {

  static delay(msecOrAction: number | Action = 0, action?: Action) {
    let msec = typeof msecOrAction == 'number' ? msecOrAction : 0;
    let _action = typeof msecOrAction == 'function' ? msecOrAction : action;
    return new Timer(msec).start(_action);
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
  static Promise: any = (window as any).Promise;

  timerId: number | null;
  startedAt: number;
  elapsed: number;
  resolve: Action | null;

  constructor(private msec: number = Infinity) {
  }

  cancel() {
    this.resolve = null;
    this.pause();
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

  start(action?: Action): Promise<void> {
    this.cancel();
    let p = this.hold(action);
    this.timerId = setTimeout(this.resolve, this.msec);
    this.startedAt = Date.now();
    this.elapsed = 0;
    return p;
  }

  pause() {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
      this.elapsed += Math.max(0, Date.now() - this.startedAt);
    }
  }

  resume() {
    this.rewind(Math.max(0,  this.msec - this.elapsed));
  }

  hold(action?: Action): Promise<void> {
    let p = new (Timer.Promise as PromiseConstructor)((resolve: Action) => {
      this.resolve = resolve;
    });
    return action ? p.then(action) : p;
  }

  rewind(msec?: number) {
    this.pause();
    if (this.resolve) {
      this.timerId = setTimeout(this.resolve, msec != null ? msec : this.msec);
      this.startedAt = Date.now();
    }
  }

  trigger() {
    if (this.resolve) {
      this.resolve();
    }
    this.cancel();
  }
}
