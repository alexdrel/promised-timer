export declare type TAction = (elapsed: number) => any;
export default class Stopwatch {
    private tick;
    startedAt: number | null;
    elapsed: number;
    stored: number;
    private timerId?;
    marks: Array<{
        stamp: number;
        resolve?: (e: number) => void;
        reject?: (r: any) => void | null;
    }>;
    constructor(tick?: number);
    at(msec: number): Promise<number>;
    start(): Promise<number>;
    pause(): void;
    resume(): void;
    cancel(): void;
    stop(): void;
    rewind(msec: number, restart?: boolean): void;
    interval: () => void;
}
