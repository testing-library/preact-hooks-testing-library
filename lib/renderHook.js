"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderHook = void 0;
var preact_1 = require("preact");
var compat_1 = require("preact/compat");
var preact_2 = require("@testing-library/preact");
var resultContainer_1 = __importDefault(require("./resultContainer"));
var TestComponent_1 = __importDefault(require("./TestComponent"));
var cleanup_1 = require("./cleanup");
var asyncUtils_1 = __importDefault(require("./asyncUtils"));
var defaultWrapper = function (Component) { return function (props) { return (preact_1.h(Component, __assign({}, props))); }; };
function renderHook(callback, _a) {
    var _b = _a === void 0 ? {} : _a, initialProps = _b.initialProps, _c = _b.wrapper, wrapper = _c === void 0 ? defaultWrapper : _c;
    var _d = resultContainer_1.default(), result = _d.result, setValue = _d.setValue, setError = _d.setError, addResolver = _d.addResolver;
    var hookProps = {
        current: initialProps,
    };
    var TestHook = wrapper(function () {
        return (preact_1.h(compat_1.Suspense, { fallback: function () { return null; } },
            preact_1.h(TestComponent_1.default, { callback: callback, hookProps: hookProps.current, onError: setError }, setValue)));
    });
    var _e = preact_2.render(preact_1.h(TestHook, null)), unmount = _e.unmount, rerender = _e.rerender;
    function rerenderHook(newProps) {
        if (newProps === void 0) { newProps = hookProps.current; }
        hookProps.current = newProps;
        preact_2.act(function () {
            rerender(preact_1.h(TestHook, null));
        });
    }
    function unmountHook() {
        preact_2.act(function () {
            cleanup_1.removeCleanup(unmountHook);
            unmount();
        });
    }
    cleanup_1.addCleanup(unmountHook);
    return __assign({ result: result, rerender: rerenderHook, unmount: unmountHook }, asyncUtils_1.default(addResolver));
}
exports.renderHook = renderHook;
