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

Static ```Timer.delay``` methods serves well for simpler cases.

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
