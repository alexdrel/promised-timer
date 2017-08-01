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
    timer.start(() => { fail(); done(); });
    timer.cancel();
    Timer.delay(4, done);
  });

  it("is pausable", (done) => {
    let timer = new Timer(1);
    let waited = false;
    timer.start(() => { expect(waited).toBe(true); done(); });
    timer.pause();
    Timer.delay(4, () => { waited = true; timer.rewind(); });
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

  it("nearly immediate catch", (done) => {
    Timer.delay(1).then(() => { throw 1 }).catch(done);
  });

  it("immediate 2", (done) => {
    Timer.delay(done);
  });

  it("immediate catch", (done) => {
    Timer.delay(() => { throw 1 }).catch(done);
  });
});
