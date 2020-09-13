"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanup = exports.act = exports.renderHook = void 0;
var renderHook_1 = require("./renderHook");
Object.defineProperty(exports, "renderHook", { enumerable: true, get: function () { return renderHook_1.renderHook; } });
var preact_1 = require("@testing-library/preact");
Object.defineProperty(exports, "act", { enumerable: true, get: function () { return preact_1.act; } });
var cleanup_1 = require("./cleanup");
Object.defineProperty(exports, "cleanup", { enumerable: true, get: function () { return cleanup_1.cleanup; } });
