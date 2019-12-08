import Timer from '../src/promised-timer';
import Stopwatch from '../src/stopwatch';

describe("stopwatch", () => {

  function checkElapsed(expected: number, start: number, elapsed: number, delay = 0) {
    expect(Math.abs(expected - elapsed)).toBeLessThan(50, `ex/el: ${expected} / ${elapsed}`);

    const real = Date.now() - start - delay;
    expect(Math.abs(real - elapsed)).toBeLessThan(50, `w/el: ${real} / ${elapsed}`);
  }

  it("works at all", done => {
    const w = new Stopwatch(10);
    const t = Date.now();
    w.at(300).then(elapsed => {
      checkElapsed(300, t, elapsed);
      w.stop();
    });
    w.start().then(done);
  });

  it("multiple marks", done => {
    const w = new Stopwatch(10);
    const t = Date.now();
    w.at(200).then(elapsed => {
      checkElapsed(200, t, elapsed);
    });
    w.at(400).then(elapsed => {
      checkElapsed(400, t, elapsed);
    });
    w.at(600).then(elapsed => {
      checkElapsed(600, t, elapsed);
      w.cancel();
    });
    w.at(1000).catch((e: typeof Timer.Cancelled) => {
      expect(e.cancelled).toBeTrue();
    });
    w.start().then(() => fail, done);

  });

  it("pausible", done => {
    const w = new Stopwatch(10);
    const t = Date.now();
    w.at(600).then(elapsed => {
      checkElapsed(600, t, elapsed, 200);
      w.stop();
    });
    Timer.delay(100)
      .then(() => w.pause())
      .then(() => Timer.delay(100))
      .then(() => w.resume())
      .then(() => Timer.delay(100))
      .then(() => w.pause())
      .then(() => Timer.delay(100))
      .then(() => w.resume());
    w.start().then(done);
  });

  it("adds marks afterwards", done => {
    const w = new Stopwatch(10);
    const t = Date.now();
    w.start();

    Timer.delay(400)
      .then(() => w.at(300))
      .then(elapsed => {
        checkElapsed(400, t, elapsed);
        w.stop();
      })
      .then(() => w.at(200))
      .then(elapsed => {
        checkElapsed(400, t, elapsed);
      })
      .then(done);
  });

  it("rewinds", done => {
    const w = new Stopwatch(10);
    const t = Date.now();
    w.start().then(done);

    w.at(100).then(elapsed => {
      checkElapsed(100, t, elapsed);
    });
    w.at(400).then(elapsed => {
      checkElapsed(400, t, elapsed, -100);
      w.stop();
    });

    Timer.delay(200)
      .then(() => w.rewind(300));
  });

  it("reusable", done => {
    const w = new Stopwatch(10);
    const t = Date.now();
    w.at(100).then(elapsed => {
      checkElapsed(100, t, elapsed);
      w.stop();
    });

    w.start().then(() => {
      w.at(100).then(elapsed => {
        checkElapsed(100, t, elapsed);
        w.cancel();
      });
      w.start().then(fail, done);
    });

    Timer.delay(50, () => w.start());
  });
});
