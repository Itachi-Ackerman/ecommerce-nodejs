"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @info
 */
var moment_1 = __importDefault(require("moment"));
var Time = /** @class */ (function () {
    function Time() {
    }
    Time.current = function () {
        return (0, moment_1.default)().format(this.format);
    };
    Time.format = "YYYY-MM-DD HH:mm:ss";
    return Time;
}());
exports.default = Time;
//# sourceMappingURL=Time.js.map