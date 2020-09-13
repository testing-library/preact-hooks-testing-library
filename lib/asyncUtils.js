"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var TimeoutError = /** @class */ (function (_super) {
    __extends(TimeoutError, _super);
    function TimeoutError(utilName, _a) {
        var timeout = _a.timeout;
        var _this = _super.call(this, "Timed out in " + utilName + " after " + timeout + "ms.") || this;
        _this.timeout = true;
        return _this;
    }
    return TimeoutError;
}(Error));
function resolveAfter(ms) {
    return new Promise(function (resolve) {
        setTimeout(resolve, ms);
    });
}
var hasWarnedDeprecatedWait = false;
function asyncUtils(addResolver) {
    var nextUpdatePromise;
    function waitForNextUpdate(options) {
        if (options === void 0) { options = { timeout: 0 }; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!nextUpdatePromise) {
                            nextUpdatePromise = new Promise(function (resolve, reject) {
                                var timeoutId = options.timeout > 0
                                    ? setTimeout(function () {
                                        reject(new TimeoutError("waitForNextUpdate", options));
                                    }, options.timeout)
                                    : null;
                                addResolver(function () {
                                    if (timeoutId) {
                                        clearTimeout(timeoutId);
                                    }
                                    nextUpdatePromise = undefined;
                                    resolve();
                                });
                            });
                        }
                        return [4 /*yield*/, nextUpdatePromise];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function waitFor(callback, _a) {
        var _b = _a === void 0 ? {} : _a, interval = _b.interval, timeout = _b.timeout, _c = _b.suppressErrors, suppressErrors = _c === void 0 ? true : _c;
        return __awaiter(this, void 0, void 0, function () {
            var checkResult, waitForResult;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        checkResult = function () {
                            try {
                                var callbackResult = callback();
                                return callbackResult || callbackResult === undefined;
                            }
                            catch (err) {
                                if (!suppressErrors) {
                                    throw err;
                                }
                            }
                        };
                        waitForResult = function () { return __awaiter(_this, void 0, void 0, function () {
                            var initialTimeout, startTime, nextCheck, err_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        initialTimeout = timeout;
                                        _a.label = 1;
                                    case 1:
                                        if (!true) return [3 /*break*/, 6];
                                        startTime = Date.now();
                                        _a.label = 2;
                                    case 2:
                                        _a.trys.push([2, 4, , 5]);
                                        nextCheck = interval
                                            ? Promise.race([
                                                waitForNextUpdate({ timeout: timeout }),
                                                resolveAfter(interval),
                                            ])
                                            : waitForNextUpdate({ timeout: timeout });
                                        return [4 /*yield*/, nextCheck];
                                    case 3:
                                        _a.sent();
                                        if (checkResult()) {
                                            return [2 /*return*/];
                                        }
                                        return [3 /*break*/, 5];
                                    case 4:
                                        err_1 = _a.sent();
                                        if (err_1.timeout) {
                                            throw new TimeoutError("waitFor", { timeout: initialTimeout });
                                        }
                                        throw err_1;
                                    case 5:
                                        timeout -= Date.now() - startTime;
                                        return [3 /*break*/, 1];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); };
                        if (!!checkResult()) return [3 /*break*/, 2];
                        return [4 /*yield*/, waitForResult()];
                    case 1:
                        _d.sent();
                        _d.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    }
    function waitForValueToChange(selector, options) {
        if (options === void 0) { options = { timeout: 0 }; }
        return __awaiter(this, void 0, void 0, function () {
            var initialValue, err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        initialValue = selector();
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, waitFor(function () { return selector() !== initialValue; }, __assign({ suppressErrors: false }, options))];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_2 = _a.sent();
                        if (err_2.timeout) {
                            throw new TimeoutError("waitForValueToChange", options);
                        }
                        throw err_2;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function wait(callback, options) {
        if (options === void 0) { options = { timeout: 0, suppressErrors: true }; }
        return __awaiter(this, void 0, void 0, function () {
            var err_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!hasWarnedDeprecatedWait) {
                            hasWarnedDeprecatedWait = true;
                            console.warn("`wait` has been deprecated. Use `waitFor` instead: https://react-hooks-testing-library.com/reference/api#waitfor.");
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, waitFor(callback, options)];
                    case 2:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        err_3 = _a.sent();
                        if (err_3.timeout) {
                            throw new TimeoutError("wait", { timeout: options.timeout });
                        }
                        throw err_3;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    return {
        wait: wait,
        waitFor: waitFor,
        waitForNextUpdate: waitForNextUpdate,
        waitForValueToChange: waitForValueToChange,
    };
}
exports.default = asyncUtils;
