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
/**
 * @info perform CRUD on Orders
 */
var orders_1 = __importDefault(require("../models/orders"));
var products_1 = __importDefault(require("../models/products"));
var sellers_1 = __importDefault(require("../models/sellers"));
var users_1 = __importDefault(require("../models/users"));
var Time_1 = __importDefault(require("../utils/Time"));
var CtrlOrder = /** @class */ (function () {
    function CtrlOrder() {
    }
    /**
    * Place order
    * @param userId - User ID
    * @param productId - productId given by user
    * @param quantity - required quantity
    */
    CtrlOrder.placeOrder = function (userId, productId, quantity) {
        return __awaiter(this, void 0, void 0, function () {
            var product1, cp, sp;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, products_1.default.findOne({ "_id": productId })];
                    case 1:
                        product1 = _a.sent();
                        if (!product1) return [3 /*break*/, 8];
                        if (!((product1.availableQuantity - quantity) > -1)) return [3 /*break*/, 6];
                        cp = product1.costPrice;
                        sp = product1.sellingPrice;
                        return [4 /*yield*/, products_1.default.updateOne({ _id: productId }, { $inc: { availableQuantity: -quantity } })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, users_1.default.updateOne({ _id: userId }, { $inc: { balance: -(quantity * sp) } })];
                    case 3:
                        _a.sent();
                        return [4 /*yield*/, sellers_1.default.updateOne({ _id: userId }, { $inc: { totalRevenue: quantity * sp, netProfit: quantity * (cp - sp), totalOrders: quantity } })];
                    case 4:
                        _a.sent();
                        return [4 /*yield*/, orders_1.default.create({
                                user: userId,
                                product: productId,
                                orderDate: Time_1.default.current(),
                                delivered: false
                            })];
                    case 5:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "Order for product ".concat(product1.productName, " placed successfully") }];
                    case 6: throw new Error("Quantity required not available");
                    case 7: return [3 /*break*/, 9];
                    case 8: throw new Error("Product does not exist !!");
                    case 9: return [2 /*return*/];
                }
            });
        });
    };
    /**
     *
     * @param page
     * @param limit
     * @returns
     */
    CtrlOrder.findAll = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //skipping and limiting before showing entire category list
                return [2 /*return*/, orders_1.default
                        .aggregate([
                        {
                            $skip: page * limit,
                        },
                        {
                            $limit: limit,
                        },
                        {
                            $project: {
                                "__v": 0
                            }
                        },
                        //looking up fields from users
                        {
                            $lookup: {
                                from: "users",
                                localField: "user",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        $project: {
                                            "__v": 0,
                                            "password": 0,
                                            "balance": 0,
                                        }
                                    }
                                ],
                                as: "user"
                            }
                        },
                        //looking up from products
                        {
                            $lookup: {
                                from: "products",
                                localField: "product",
                                foreignField: "_id",
                                pipeline: [
                                    {
                                        $project: {
                                            "__v": 0,
                                            "costPrice": 0,
                                        },
                                    },
                                    {
                                        $lookup: {
                                            from: "sellers",
                                            localField: "seller",
                                            foreignField: "_id",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        "__v": 0,
                                                        "password": 0,
                                                        "totalRevenue": 0,
                                                        "netProfit": 0,
                                                        "totalOrders": 0
                                                    }
                                                }
                                            ],
                                            as: "seller"
                                        }
                                    }
                                ],
                                as: "product"
                            }
                        },
                    ])
                        .exec()];
            });
        });
    };
    return CtrlOrder;
}());
exports.default = CtrlOrder;
//# sourceMappingURL=orders.js.map