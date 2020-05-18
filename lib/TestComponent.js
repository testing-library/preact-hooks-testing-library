"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Fallback = void 0;
var TestComponent = function (_a) {
    var callback = _a.callback, hookProps = _a.hookProps, children = _a.children, onError = _a.onError;
    try {
        var val = callback(hookProps);
        children(val);
    }
    catch (err) {
        if (err.then) {
            throw err;
        }
        else {
            onError(err);
        }
    }
    return null;
};
exports.Fallback = function () { return null; };
exports.default = TestComponent;
