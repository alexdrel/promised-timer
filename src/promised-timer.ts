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
  static Promise = Promise;

  timerId: number | null;
  resolve: Action | null;

  constructor(private msec: number) {
  }

  cancel() {
    this.resolve = null;
    this.pause();
  }

  start(action?: Action): Promise<void> {
    this.cancel();
    let p = this.hold(action);
    this.timerId = setTimeout(this.resolve, this.msec);
    return p;
  }

  pause() {
    if (this.timerId != null) {
      clearTimeout(this.timerId);
      this.timerId = null;
    }
  }

  hold(action?: Action): Promise<void> {
    let p = new Timer.Promise((resolve: Action) => {
      this.resolve = resolve;
    });
    return action ? p.then(action) : p;
  }

  rewind(msec?: number) {
    this.pause();
    if (this.resolve) {
      this.timerId = setTimeout(this.resolve, msec != null ? msec : this.msec);
    }
  }

  trigger() {
    if (this.resolve) {
      this.resolve();
    }
    this.cancel();
  }
}
