"use strict";
exports.__esModule = true;
var Timer = (function () {
    function Timer(msec) {
        if (msec === void 0) { msec = Infinity; }
        this.msec = msec;
        this.startedAt = null;
        this.elapsed = null;
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
    Timer.prototype.getSeconds = function () {
        return this.msec / 1000;
    };
    Timer.prototype.cancel = function () {
        this.resolve = null;
        this.pause();
        if (this.reject) {
            this.reject(Timer.Cancelled);
            this.reject = null;
        }
    };
    Timer.prototype.reset = function (msec) {
        this.pause();
        this.msec = msec;
        return this;
    };
    Timer.prototype.Seconds = function (sec) {
        return this.reset(sec * 1000);
    };
    Timer.prototype.Minutes = function (min) {
        return this.reset(min * 60 * 1000);
    };
    Timer.prototype.tee = function (me) {
        return me(this), this;
    };
    Timer.prototype.start = function (action) {
        this.cancel();
        var p = this.hold(action);
        this.timerId = setTimeout(this.resolve, this.msec);
        this.startedAt = Date.now();
        this.elapsed = 0;
        return p;
    };
    Timer.prototype.pause = function () {
        if (this.timerId != null) {
            clearTimeout(this.timerId);
            this.timerId = null;
            if (this.startedAt != null) {
                this.elapsed = (this.elapsed || 0) + Math.max(0, Date.now() - this.startedAt);
            }
            this.startedAt = null;
        }
    };
    Timer.prototype.resume = function () {
        this.rewind(Math.max(0, this.msec - (this.elapsed || 0)));
    };
    Timer.prototype.hold = function (action) {
        var _this = this;
        var p = new Timer.Promise(function (resolve, reject) {
            _this.resolve = resolve;
            _this.reject = reject;
        }).then(function () { return _this.pause(); });
        return action ? p.then(action) : p;
    };
    Timer.prototype.repeat = function (action) {
        var _this = this;
        this.cancel();
        var repeatAction = function () { return _this.hold(action)
            .then(repeatAction); };
        return repeatAction();
    };
    Timer.prototype.rewind = function (msec) {
        this.pause();
        if (this.resolve) {
            this.timerId = setTimeout(this.resolve, msec != null ? msec : this.msec);
            this.startedAt = Date.now();
        }
    };
    Timer.prototype.trigger = function () {
        this.reject = null;
        if (this.resolve) {
            this.resolve();
        }
        this.cancel();
    };
    Timer.Promise = window.Promise;
    Timer.Cancelled = { cancelled: true };
    return Timer;
}());
exports["default"] = Timer;
