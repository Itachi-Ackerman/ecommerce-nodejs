"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @info schema for category
 */
var mongoose_1 = require("mongoose");
var schema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    }
});
exports.default = (0, mongoose_1.model)("category", schema);
//# sourceMappingURL=category.js.map