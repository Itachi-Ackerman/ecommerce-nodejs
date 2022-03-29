"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var products_1 = __importDefault(require("../models/products"));
var category_1 = __importDefault(require("../models/category"));
var CtrlProduct = /** @class */ (function () {
    function CtrlProduct() {
    }
    /**
     * create new product
     */
    CtrlProduct.create = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var category1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, category_1.default.findOne({ "_id": body.category })
                        //if category exists success, else category not in database
                    ];
                    case 1:
                        category1 = _a.sent();
                        if (!category1) return [3 /*break*/, 3];
                        return [4 /*yield*/, products_1.default.create(body)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "Product listed successfully" }];
                    case 3: throw new Error("Category does not exist in the database");
                }
            });
        });
    };
    /**
     * find all products
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     * @param filterBy - field can be filtered by
     * @param order - execute in order
     *
     */
    CtrlProduct.findAll = function (page, limit, filterBy, order, category) {
        return __awaiter(this, void 0, void 0, function () {
            var ord, sort1, match1;
            return __generator(this, function (_a) {
                ord = (order.toLowerCase() == "asc") ? 1 : -1;
                if (filterBy.toLowerCase() == "price")
                    filterBy = "sellingPrice";
                else
                    filterBy = "productDate";
                sort1 = { $sort: {} };
                sort1["$sort"][filterBy] = ord;
                if (category == "none") {
                    match1 = {
                        //matching to check if products stock is empty
                        $match: {
                            $expr: {
                                $gt: ["$availableQuantity", 0]
                            }
                        }
                    };
                }
                else {
                    match1 = {
                        //matching to check if products stock is empty
                        $match: {
                            $expr: {
                                $and: {
                                    $gt: ["$availableQuantity", 0],
                                    $eq: ["$category", category],
                                },
                            }
                        }
                    };
                }
                return [2 /*return*/, products_1.default
                        .aggregate([
                        match1,
                        {
                            $skip: page * limit,
                        },
                        {
                            $limit: limit,
                        },
                        {
                            $project: {
                                "__v": 0,
                                "costPrice": 0
                            }
                        },
                        {
                            $lookup: {
                                from: "sellers",
                                localField: "seller",
                                foreignField: "_id",
                                pipeline: [{
                                        $project: {
                                            "__v": 0,
                                            "password": 0,
                                            "totalRevenue": 0,
                                            "netProfit": 0,
                                            "totalOrders": 0
                                        }
                                    }],
                                as: "seller"
                            },
                        },
                        {
                            $lookup: {
                                from: "category",
                                localField: "category",
                                foreignField: "_id",
                                pipeline: [{
                                        $project: {
                                            "__v": 0
                                        }
                                    }],
                                as: "category"
                            },
                        },
                        sort1,
                    ])
                        .exec()];
            });
        });
    };
    return CtrlProduct;
}());
exports.default = CtrlProduct;
//# sourceMappingURL=products.js.map