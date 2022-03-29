"use strict";
/**
 * @info schema for orders
 */
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    orderDate: {
        type: String,
        required: true
    },
    delivered: {
        type: Boolean,
        required: true
    },
});
exports.default = (0, mongoose_1.model)("orders", schema);
//# sourceMappingURL=orders.js.map