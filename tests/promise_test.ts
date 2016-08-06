import Timer from '../src/promised-timer';

class MyPromise {
  promise: Promise<any>;
  done = false;
  constructor(resolver: any) {
    this.promise = new Promise(resolver);
  }

  then(f: any,r: any) {
    this.promise.then(() => this.done = true).then(f,r);
  }
};

describe("timer Promise impementation", () => {
  let savedPromise: typeof Promise;
  beforeAll( () => {
    savedPromise = Timer.Promise;
    Timer.Promise = MyPromise as any;
  });

  afterAll( () => {
    Timer.Promise = savedPromise;
  });

  it("works at all", (done) => {
    let timer = new Timer(1);
    let p = timer.start();
    p.then(()=> { expect((p as any).done).toBe(true); done(); });
  });

});
