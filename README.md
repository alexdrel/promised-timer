[![Build Status](https://travis-ci.org/alexdrel/promised-timer.svg?branch=master)](https://travis-ci.org/alexdrel/promised-timer)

promised-timer
===

Promisified Javascript Timer

```js
import Timer from 'promised-timer';

let aTimer = Timer.Seconds(5);

startButton.onClick(() => {
  aTimer.start()
    .then(() => doSomething())
    .catch((e) => log('Exception in doSomething', e))
});

cancelButton.onClick(() => aTimer.cancel());
rightNowButton.onClick(() => aTimer.trigger());

```

A timer can be started multiple times, canceled, paused and rewound.
Paused timer can be resumed to continue up to initial time.

Static ```Timer.delay``` method serves well for simpler cases.

### Stopwatch

Attach multiple promises to timeline

```typescript
import { Stopwatch } from 'promised-timer';

const w = new Stopwatch();
w.at(300).then(elapsed => {
      elapsed == 300
  });

w.at(1000).then(elapsed => {
      elapsed == 1000
  });

w.start().then(() => "stopwatch stopped", () => "stopwatch cancelled");

Timer.delay(3000, w.stop());
```

The stopwatch can be paused and resumed.

##### Swapping Promise implementation
By default Timer assumes native Promise or polyfill but any Promise implementation can be used by setting ```Timer.Promise``` property.

********

## Development Requirements
Typescipt 2.0+

#### Commands
* *npm run build* - build a version
* *npm run clean* - removes dist and build folder
* *npm start* - starts local dev server at http://localhost:8006/
* *npm run lint* - lint
* *npm test* - runs karma tests
* *npm run test:watch* - watch tests
