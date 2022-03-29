"use strict";
/**
 * @info schema for seller
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
    totalRevenue: {
        type: Number,
        required: true,
    },
    netProfit: {
        type: Number,
        required: true,
    },
    totalOrders: {
        type: Number,
        required: true,
    },
});
exports.default = (0, mongoose_1.model)("sellers", schema);
//# sourceMappingURL=sellers.js.map