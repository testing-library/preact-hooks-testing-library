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
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
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
var TestComponent_1 = __importStar(require("./TestComponent"));
var cleanup_1 = require("./cleanup");
var asyncUtils_1 = __importDefault(require("./asyncUtils"));
function renderHook(callback, _a) {
    var _b = _a === void 0 ? {} : _a, initialProps = _b.initialProps, wrapper = _b.wrapper;
    var _c = resultContainer_1.default(), result = _c.result, setValue = _c.setValue, setError = _c.setError, addResolver = _c.addResolver;
    var hookProps = {
        current: initialProps,
    };
    var wrapUiIfNeeded = function (innerElement) {
        return wrapper ? preact_1.h(wrapper, hookProps.current, innerElement) : innerElement;
    };
    var TestHook = function () {
        return wrapUiIfNeeded(preact_1.h(compat_1.Suspense, { fallback: preact_1.h(TestComponent_1.Fallback, null) },
            preact_1.h(TestComponent_1.default, { callback: callback, hookProps: hookProps.current, onError: setError }, setValue)));
    };
    var _d = preact_2.render(preact_1.h(TestHook, null)), unmount = _d.unmount, rerender = _d.rerender;
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
