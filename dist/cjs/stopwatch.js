"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var promised_timer_1 = __importDefault(require("./promised-timer"));
var Stopwatch = (function () {
    function Stopwatch(tick) {
        var _this = this;
        if (tick === void 0) { tick = 100; }
        this.tick = tick;
        this.startedAt = null;
        this.elapsed = 0;
        this.stored = 0;
        this.marks = [];
        this.interval = function () {
            if (_this.startedAt == null) {
                return;
            }
            _this.elapsed = _this.stored + Math.max(0, Date.now() - _this.startedAt);
            for (var _i = 0, _a = _this.marks; _i < _a.length; _i++) {
                var mark = _a[_i];
                if (mark.resolve && _this.elapsed > mark.stamp) {
                    mark.resolve(_this.elapsed);
                    mark.resolve = mark.reject = undefined;
                }
            }
        };
    }
    Stopwatch.prototype.at = function (msec) {
        var _this = this;
        if (this.elapsed > msec) {
            return Promise.resolve(this.elapsed);
        }
        return new promised_timer_1.default.Promise(function (resolve, reject) {
            _this.marks.push({ stamp: msec, resolve: resolve, reject: reject });
        });
    };
    Stopwatch.prototype.start = function () {
        this.stored = 0;
        this.resume();
        return this.at(+Infinity);
    };
    Stopwatch.prototype.pause = function () {
        if (this.timerId != null) {
            clearInterval(this.timerId);
            this.timerId = null;
            if (this.startedAt != null) {
                this.stored += Math.max(0, Date.now() - this.startedAt);
            }
            this.startedAt = null;
            this.elapsed = this.stored;
        }
    };
    Stopwatch.prototype.resume = function () {
        if (this.timerId != null) {
            return;
        }
        this.startedAt = Date.now();
        this.timerId = setInterval(this.interval, this.tick);
    };
    Stopwatch.prototype.cancel = function () {
        this.pause();
        for (var _i = 0, _a = this.marks; _i < _a.length; _i++) {
            var mark = _a[_i];
            if (mark.reject) {
                mark.reject(promised_timer_1.default.Cancelled);
                mark.resolve = mark.reject = undefined;
            }
        }
        this.marks = [];
    };
    Stopwatch.prototype.stop = function () {
        this.pause();
        for (var _i = 0, _a = this.marks; _i < _a.length; _i++) {
            var mark = _a[_i];
            if (mark.resolve) {
                mark.resolve(this.elapsed);
                mark.resolve = mark.reject = undefined;
            }
        }
        this.marks = [];
    };
    Stopwatch.prototype.rewind = function (msec, restart) {
        var running = this.timerId != null;
        this.pause();
        this.stored = this.elapsed = msec;
        if (restart || (restart == null && running)) {
            this.resume();
        }
    };
    return Stopwatch;
}());
exports.default = Stopwatch;
