import Timer from '../src/promised-timer';

describe("timer", () => {

  it("works at all", (done) => {
    let timer = new Timer(1);
    timer.start().then(done);
  });

  it("shortcut works", (done) => {
    let timer = new Timer(1);
    timer.start(done);
  });

  it("late init works", (done) => {
    let timer = new Timer();
    timer.Seconds(0.1).start(done);
  });

  it("is reusable", (done) => {
    let timer = new Timer(1);
    timer.start()
      .then(() => timer.start())
      .then(() => timer.start())
      .then(() => timer.start())
      .then(done);
  });

  it("callback hell is in near reach", (done) => {
    let timer = new Timer(1);
    timer.start(() => timer.start(() => timer.start(done)));
  });

  it("helps catch exception", (done) => {
    let timer = new Timer(1);
    timer.start(() => { throw 1 })
      .catch(done);
  });

  it("is cancellable", (done) => {
    let timer = new Timer(1);
    timer.start(fail);
    timer.cancel();
    Timer.delay(1, done);
  });

  it("catches cancel", (done) => {
    let timer = new Timer(1);
    timer.start(fail).catch((r: any) => {
      expect(r).toBe(Timer.Cancelled);
      done();
    });
    timer.cancel();
  });

  it("is pausable", (done) => {
    let timer = new Timer(1);
    let waited = false;
    timer.start(() => { expect(waited).toBe(true); done(); });
    timer.pause();
    Timer.delay(4, () => { waited = true; timer.rewind(); });
  });


  // disabled for Travis as timing is not reliable
  xit("is pausable with elapsed time", (done) => {
    let timer = Timer.Seconds(0.2);
    let waited = 0;
    let started = Date.now();
    timer.start(() => {
      expect(waited).toBe(4);
      expect((Date.now() - started) / 1000).toBeCloseTo(0.3, 1);
      done();
    });
    Timer.delay(50)
      .then(() => (waited++ , timer.pause(), Timer.delay(50)))
      .then(() => (waited++ , timer.resume(), Timer.delay(50)))
      .then(() => (waited++ , timer.pause(), Timer.delay(50)))
      .then(() => (waited++ , timer.resume(), Timer.delay(50)));
  });

  it("unpaused resume", (done) => {
    let timer = Timer.Seconds(0.3);
    timer.start(done);
    Timer.delay(50)
      .then(() => timer.resume());
  });

  it("immediate triggered", (done) => {
    let timer = Timer.Seconds(1000);
    timer.start(done);
    timer.trigger();
    timer.cancel();
  });

  it("immediate", (done) => {
    Timer.delay().then(done);
  });

  it("hold 1", (done) => {
    let timer = Timer.Seconds(0.1);
    timer.hold(done);
    timer.trigger();
  });

  it("hold 2", (done) => {
    let timer = Timer.Seconds(0.1);
    timer.hold().then(done);
    timer.rewind();
  });

  it("repeat", (done) => {
    let timer = Timer.Seconds(0.01);
    let c = 0;
    timer.repeat(() => {
      if (++c > 5) throw 1;
      else Timer.delay(() => timer.rewind());
    }).catch(done);
    timer.trigger();
  });

  it("nearly immediate catch", (done) => {
    Timer.delay(1).then(() => { throw 1 }).catch(done);
  });

  it("immediate 2", (done) => {
    Timer.delay(done);
  });

  it("immediate catch", (done) => {
    Timer.delay(() => { throw 1 }).catch(done);
  });

  it("Tee mode", (done) => {
    let t: Timer;
    Timer.Seconds(5).tee(tt => t = tt).start(fail).catch(done);
    t.cancel();
  });
});

describe("elapsed", () => {

  it("finished", (done) => {
    let timer = Timer.Seconds(0.1);
    timer.start().then(()=>{
      expect(timer.elapsed).toBeGreaterThan(100);
      expect(timer.elapsed).toBeLessThan(500);
    }).then(done);
    expect(timer.elapsed).toBe(0);
  });

  it("canceled", (done) => {
    let timer = Timer.Seconds(0.2);
    timer.start().catch(()=>{
      expect(timer.elapsed).toBeGreaterThan(0);
      expect(timer.elapsed).toBeLessThan(100);
    }).then(done);
    expect(timer.elapsed).toBe(0);
    Timer.delay(()=>timer.cancel());
  });

  it("triggered onHold", (done) => {
    let timer = Timer.Seconds(0.2);
    timer.hold().then(()=>{
      expect(timer.elapsed).toBeNull();
    }).then(done);
    expect(timer.elapsed).toBeNull();
    Timer.delay(()=>timer.trigger());
  });

  it("triggered running", (done) => {
    let timer = Timer.Seconds(0.2);
    timer.start().then(()=>{
      expect(timer.elapsed).toBeGreaterThan(0);
      expect(timer.elapsed).toBeLessThan(100);
    }).then(done);
    expect(timer.elapsed).toBe(0);
    Timer.delay(10, ()=>timer.trigger());
  });
});
