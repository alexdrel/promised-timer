"use strict";
exports.__esModule = true;
var Timer = (function () {
    function Timer(msec) {
        this.msec = msec;
    }
    Timer.delay = function (msecOrAction, action) {
        if (msecOrAction === void 0) { msecOrAction = 0; }
        var msec = typeof msecOrAction == 'number' ? msecOrAction : 0;
        var _action = typeof msecOrAction == 'function' ? msecOrAction : action;
        return new Timer(msec).start(_action);
    };
    Timer.Seconds = function (sec) {
        return new Timer(sec * 1000);
    };
    Timer.Minutes = function (min) {
        return new Timer(min * 60 * 1000);
    };
    Timer.prototype.cancel = function () {
        this.resolve = null;
        this.pause();
    };
    Timer.prototype.start = function (action) {
        this.cancel();
        var p = this.hold(action);
        this.timerId = setTimeout(this.resolve, this.msec);
        return p;
    };
    Timer.prototype.pause = function () {
        if (this.timerId != null) {
            clearTimeout(this.timerId);
            this.timerId = null;
        }
    };
    Timer.prototype.hold = function (action) {
        var _this = this;
        var p = new Timer.Promise(function (resolve) {
            _this.resolve = resolve;
        });
        return action ? p.then(action) : p;
    };
    Timer.prototype.rewind = function (msec) {
        this.pause();
        if (this.resolve) {
            this.timerId = setTimeout(this.resolve, msec != null ? msec : this.msec);
        }
    };
    Timer.prototype.trigger = function () {
        if (this.resolve) {
            this.resolve();
        }
        this.cancel();
    };
    Timer.Promise = window.Promise;
    return Timer;
}());
exports["default"] = Timer;
