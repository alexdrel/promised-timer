export declare type Action = () => any;
export default class Timer {
    private msec;
    static delay(msecOrAction?: number | Action, action?: Action): Promise<void>;
    static Seconds(sec: number): Timer;
    static Minutes(min: number): Timer;
    static Promise: any;
    static Cancelled: {
        cancelled: boolean;
    };
    startedAt: number | null;
    elapsed: number | null;
    private timerId?;
    private resolve?;
    private reject?;
    constructor(msec?: number);
    getSeconds(): number;
    cancel(): void;
    reset(msec: number): this;
    Seconds(sec: number): this;
    Minutes(min: number): this;
    tee(me: (t: Timer) => void): this;
    start(action?: Action): Promise<void>;
    pause(): void;
    resume(): void;
    hold(action?: Action): Promise<void>;
    repeat(action?: Action): any;
    rewind(msec?: number): void;
    trigger(): void;
}
