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
/**
 * @info perform CRUD on seller
 */
var sellers_1 = __importDefault(require("../models/sellers"));
var bcrypt_1 = __importDefault(require("../services/bcrypt"));
var mongoose_1 = __importDefault(require("mongoose"));
var orders_1 = __importDefault(require("../models/orders"));
var products_1 = __importDefault(require("../models/products"));
var CtrlSeller = /** @class */ (function () {
    function CtrlSeller() {
    }
    /**
     * creating a new seller
     * @param body
     */
    CtrlSeller.create = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt_1.default.hashing(body.password)];
                    case 1:
                        hash = _a.sent();
                        data = __assign(__assign({}, body), { password: hash });
                        return [4 /*yield*/, sellers_1.default.create(data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "seller created successfully" }];
                }
            });
        });
    };
    /**
     * authenticating a seller
     * @param email
     * @param password
     */
    CtrlSeller.auth = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var seller, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, sellers_1.default.findOne({ email: email }, { totalRevenue: 0, netProfit: 0, totalOrders: 0 }).lean()];
                    case 1:
                        seller = _a.sent();
                        if (!seller) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt_1.default.comparing(password, seller.password)];
                    case 2:
                        result = _a.sent();
                        // if password is correct or not
                        // if correct, return the seller
                        if (result)
                            return [2 /*return*/, seller];
                        // throw error
                        else
                            throw new Error("password doesn't match");
                        return [3 /*break*/, 4];
                    case 3: throw new Error("seller doesn't exists");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * displaying all sellers
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    CtrlSeller.findAll = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //skipping and limiting before showing entire sellers list
                return [2 /*return*/, sellers_1.default
                        .aggregate([
                        {
                            $skip: page * limit,
                        },
                        {
                            $limit: limit,
                        },
                        {
                            $project: {
                                "password": 0,
                                "__v": 0
                            }
                        }
                    ])
                        .exec()];
            });
        });
    };
    /**
     * find profile of seller
     * @param sellerId
     * @param fiterByStock - filtering by availibility
     */
    CtrlSeller.sellerProfile = function (sellerId, fiterByStock) {
        return __awaiter(this, void 0, void 0, function () {
            var match1;
            return __generator(this, function (_a) {
                //filtering by stock
                if (fiterByStock.toLowerCase() == "no") {
                    match1 = {
                        //matching sellerId from sellers with seller Id in products collection
                        $match: {
                            $expr: {
                                $eq: ["$seller", "$$sellerId"]
                            }
                        }
                    };
                }
                else {
                    match1 = {
                        //matching sellerId from sellers with seller Id in products collection
                        $match: {
                            $expr: {
                                $and: [
                                    {
                                        $eq: ["$seller", "$$sellerId"]
                                    },
                                    {
                                        $gt: ["availableQuantity", 0]
                                    }
                                ]
                            }
                        }
                    };
                }
                return [2 /*return*/, sellers_1.default
                        .aggregate([
                        {
                            //matching sellerID with sellerId from seller collection
                            $match: {
                                _id: new mongoose_1.default.Types.ObjectId(sellerId)
                            },
                        },
                        {
                            //ignoring password before displaying
                            $project: {
                                "password": 0,
                                "__v": 0
                            }
                        },
                        {
                            //looking up from products collection with id as reference
                            $lookup: {
                                from: "products",
                                let: { sellerId: "$_id" },
                                pipeline: [
                                    // {
                                    //     //matching sellerId from sellers with seller Id in products collection
                                    //     $match:
                                    //     {
                                    //         $expr:
                                    //         {
                                    //             $eq: ["$seller", "$$sellerId"]
                                    //         }
                                    //     }
                                    // },
                                    match1,
                                    //ignoring unnecessary fields before displaying
                                    {
                                        $project: {
                                            "seller": 0,
                                            "__v": 0
                                        }
                                    },
                                    // sorting product recent to oldest
                                    {
                                        $sort: {
                                            productDate: -1
                                        }
                                    },
                                    //looking up from category collection with id reference 
                                    {
                                        $lookup: {
                                            from: "category",
                                            localField: "category",
                                            foreignField: "_id",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        "__v": 0
                                                    }
                                                }
                                            ],
                                            as: "category"
                                        }
                                    },
                                ],
                                as: "products"
                            },
                        },
                    ])
                        .exec()];
            });
        });
    };
    /**
     * update order to delivered
     * @param sellerId
     * @param orderId
     * @param delivered
     */
    CtrlSeller.updateOrderToDelivered = function (sellerId, orderId) {
        return __awaiter(this, void 0, void 0, function () {
            var order1, prod;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, orders_1.default.findOne({ _id: orderId })];
                    case 1:
                        order1 = _a.sent();
                        if (!order1) return [3 /*break*/, 6];
                        return [4 /*yield*/, products_1.default.findOne({ _id: order1.product })];
                    case 2:
                        prod = _a.sent();
                        if (!(prod.seller == sellerId)) return [3 /*break*/, 4];
                        return [4 /*yield*/, orders_1.default.updateOne({ _id: orderId }, { $set: { delivered: true } })];
                    case 3:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "order updated to delivered successfully" }];
                    case 4: throw new Error("Seller ID does not match!");
                    case 5: return [3 /*break*/, 7];
                    case 6: throw new Error("Order not found");
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * find all orders of seller
     * @param sellerId
     * @param delivered - filtered on the basis of delivery
     */
    CtrlSeller.sellerOrders = function (sellerId, delivered) {
        return __awaiter(this, void 0, void 0, function () {
            var flag, match1;
            return __generator(this, function (_a) {
                if (delivered.toLowerCase() == "no")
                    flag = false;
                if (delivered.toLowerCase() == "yes")
                    flag = true;
                //filtering by delivery completion
                if (flag) {
                    match1 = {
                        //matching sellerID with sellerId from orders collection
                        $match: {
                            seller: new mongoose_1.default.Types.ObjectId(sellerId),
                            delivered: flag
                        },
                    };
                }
                else {
                    match1 = {
                        //matching sellerID with sellerId from orders collection
                        $match: {
                            seller: new mongoose_1.default.Types.ObjectId(sellerId),
                        },
                    };
                }
                return [2 /*return*/, orders_1.default
                        .aggregate([
                        // {
                        //     //matching sellerID with sellerId from orders collection
                        //     $match: {
                        //         seller: new mongoose.Types.ObjectId(sellerId),
                        //         delivered: flag
                        //     },
                        // },
                        match1,
                        {
                            //looking up from users collection with id as reference
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                pipeline: [
                                    //ignoring unnecessary fields before displaying
                                    {
                                        $project: {
                                            "_id": 0,
                                            "__v": 0,
                                            "password": 0,
                                            "balance": 0
                                        }
                                    },
                                ],
                                as: "user"
                            }
                        },
                        {
                            $lookup: {
                                from: "products",
                                localField: "product",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        //looking up form category collection
                                        $lookup: {
                                            from: "category",
                                            localField: "category",
                                            foreignField: "_id",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        "__v": 0
                                                    }
                                                }
                                            ],
                                            as: "category"
                                        }
                                    },
                                    //ignoring unnecessary fields before displaying
                                    {
                                        $project: {
                                            "_id": 0,
                                            "__v": 0,
                                            "costPrice": 0,
                                            "productDate": 0,
                                            "availableQuantity": 0,
                                            "seller": 0
                                        }
                                    }
                                ],
                                as: "product"
                            }
                        },
                        {
                            $project: {
                                "seller": 0,
                                "__v": 0,
                            }
                        }
                    ])
                        .exec()
                    // }
                    //     else {
                    //     return orders
                    //         .aggregate([
                    //             {
                    //                 //matching sellerID with sellerId from orders collection
                    //                 $match: {
                    //                     seller: new mongoose.Types.ObjectId(sellerId),
                    //                 },
                    //             },
                    //             {
                    //                 //looking up from users collection with id as reference
                    //                 $lookup: {
                    //                     from: "users",
                    //                     localField: "user",
                    //                     foreignField: "_id",
                    //                     pipeline: [
                    //                         //ignoring unnecessary fields before displaying
                    //                         {
                    //                             $project: {
                    //                                 "_id": 0,
                    //                                 "__v": 0,
                    //                                 "password": 0,
                    //                                 "balance": 0
                    //                             }
                    //                         },
                    //                     ],
                    //                     as: "user"
                    //                 }
                    //             },
                    //             {
                    //                 $lookup: {
                    //                     from: "products",
                    //                     localField: "product",
                    //                     foreignField: "_id",
                    //                     pipeline: [
                    //                         {
                    //                             //looking up form category collection
                    //                             $lookup: {
                    //                                 from: "category",
                    //                                 localField: "category",
                    //                                 foreignField: "_id",
                    //                                 pipeline: [
                    //                                     {
                    //                                         $project: {
                    //                                             "__v": 0
                    //                                         }
                    //                                     }
                    //                                 ],
                    //                                 as: "category"
                    //                             }
                    //                         },
                    //                         //ignoring unnecessary fields before displaying
                    //                         {
                    //                             $project: {
                    //                                 "_id": 0,
                    //                                 "__v": 0,
                    //                                 "costPrice": 0,
                    //                                 "productDate": 0,
                    //                                 "availableQuantity": 0,
                    //                                 "seller": 0
                    //                             }
                    //                         }
                    //                     ],
                    //                     as: "product"
                    //                 }
                    //             },
                    //             {
                    //                 $project: {
                    //                     "seller": 0,
                    //                     "__v": 0,
                    //                 }
                    //             }
                    //         ])
                    //         .exec()
                    // }
                ];
            });
        });
    };
    return CtrlSeller;
}());
exports.default = CtrlSeller;
//# sourceMappingURL=sellers.js.map