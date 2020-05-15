"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resultContainer(initialValue) {
    var value = initialValue;
    var error;
    var resolvers = [];
    var result = {
        get current() {
            if (error) {
                throw error;
            }
            return value;
        },
        get error() {
            return error;
        },
    };
    function updateResult(val, err) {
        value = val ? val : value;
        error = err ? err : error;
        resolvers.splice(0, resolvers.length).forEach(function (resolve) { return resolve(); });
    }
    return {
        result: result,
        setValue: function (val) { return updateResult(val); },
        setError: function (err) { return updateResult(undefined, err); },
        addResolver: function (resolver) {
            resolvers.push(resolver);
        },
    };
}
exports.default = resultContainer;
