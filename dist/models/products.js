"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    productName: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    productDate: {
        type: String,
        required: true
    },
    seller: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "sellers",
        required: true
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
});
exports.default = (0, mongoose_1.model)("products", schema);
//# sourceMappingURL=products.js.map