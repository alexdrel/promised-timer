import Timer from '../src/promised-timer';


export declare type Rejecter = ((r: any) => void | null);
export declare type Resolver<T> = (value?: T | PromiseLike<T>) => void;
export declare type PromiseExecutor<T> = (resolve: Resolver<T>, reject: Rejecter) => void;

export default class KPromise<T> implements PromiseLike<T> {
  promise: Promise<T>;
  completed = false;
  rejected = false;
  resolved = false;
  resolver?: Resolver<T>;
  rejecter?: Rejecter;

  static done = false;

  constructor(executor: PromiseExecutor<T>) {
    this.promise = executor && new Promise<T>(executor);
  }

  static resolve<T>(v: T | PromiseLike<T>) {
    const p = Promise.resolve(v) as any as KPromise<T>;
    KPromise.done = p.resolved = p.completed = true;
    return p;
  }

  static reject<T>(r: any) {
    const p = Promise.reject(r) as any as KPromise<T>;
    KPromise.done = p.rejected = p.completed = true;
    return p;
  }

  then<TR1 = T, TR2 = never>(
    onfulfilled?: ((value: T) => TR1 | PromiseLike<TR1>) | undefined | null,
    onrejected?: ((reason: any) => TR2 | PromiseLike<TR2>) | undefined | null): PromiseLike<TR1 | TR2> {
    return this.promise
      .then(
        v => {
          KPromise.done = this.completed = this.resolved = true;
          if (onfulfilled) {
            return onfulfilled(v);
          }
          return v as any as TR1;
        },
        r => {
          KPromise.done = this.completed = this.rejected = true;
          if (onrejected) {
            return onrejected(r);
          }
          throw r;
        },
      );
  }
}

describe("timer Promise impementation", () => {
  let savedPromise: typeof Timer.Promise;
  beforeAll(() => {
    savedPromise = Timer.Promise;
    Timer.Promise = KPromise;
  });

  afterAll(() => {
    Timer.Promise = savedPromise;
  });

  it("works at all", done => {
    const timer = new Timer(1);
    const p = timer.start();
    p.then(() => { expect(KPromise.done).toBe(true); done(); });
  });
});
