"use strict";
/**
 * @info schema for user
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        required: true
    }
});
exports.default = (0, mongoose_1.model)("users", schema);
//# sourceMappingURL=users.js.map