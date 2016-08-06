export declare type Action = () => any;
export default class Timer {
    private msec;
    static delay(msecOrAction?: number | Action, action?: Action): Promise<void>;
    static Seconds(sec: number): Timer;
    static Minutes(min: number): Timer;
    static Promise: PromiseConstructor;
    timerId: number;
    resolve: Action;
    constructor(msec: number);
    cancel(): void;
    start(action?: Action): Promise<void>;
    pause(): void;
    hold(action?: Action): Promise<void>;
    rewind(msec?: number): void;
}
