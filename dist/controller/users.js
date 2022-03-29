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
 * @info perform CRUD on user
 */
var users_1 = __importDefault(require("../models/users"));
var bcrypt_1 = __importDefault(require("../services/bcrypt"));
var mongoose_1 = __importDefault(require("mongoose"));
var CtrlUser = /** @class */ (function () {
    function CtrlUser() {
    }
    /**
     * creating a new user
     * @param body
     */
    CtrlUser.create = function (body) {
        return __awaiter(this, void 0, void 0, function () {
            var hash, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, bcrypt_1.default.hashing(body.password)];
                    case 1:
                        hash = _a.sent();
                        data = __assign(__assign({}, body), { password: hash });
                        return [4 /*yield*/, users_1.default.create(data)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "user created successfully" }];
                }
            });
        });
    };
    /**
     * authenticating a user
     * @param email
     * @param password
     */
    CtrlUser.auth = function (email, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, users_1.default.findOne({ email: email }, { balance: 0 }).lean()];
                    case 1:
                        user = _a.sent();
                        if (!user) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt_1.default.comparing(password, user.password)];
                    case 2:
                        result = _a.sent();
                        // if password is correct or not
                        // if correct, return the user
                        if (result)
                            return [2 /*return*/, user];
                        // throw error
                        else
                            throw new Error("password doesn't match");
                        return [3 /*break*/, 4];
                    case 3: throw new Error("user doesn't exists");
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * displaying all users
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    CtrlUser.findAll = function (page, limit) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                //skipping and limiting before showing entire users list
                return [2 /*return*/, users_1.default
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
     * find profile of user
     * @param userId
     */
    CtrlUser.userProfile = function (userId) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, users_1.default
                        .aggregate([
                        {
                            //matching userID with userId from users collection
                            $match: {
                                _id: new mongoose_1.default.Types.ObjectId(userId)
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
                            //looking up from orders collection with id as reference
                            $lookup: {
                                from: "orders",
                                let: { userId: "$_id" },
                                pipeline: [
                                    {
                                        //matching userId from users with user Id in orders collection
                                        $match: {
                                            $expr: {
                                                $eq: ["$user", "$$userId"]
                                            }
                                        }
                                    },
                                    //ignoring unnecessary fields before displaying
                                    {
                                        $project: {
                                            "user": 0,
                                            "__v": 0
                                        }
                                    },
                                    // sorting order recent to oldest
                                    {
                                        $sort: {
                                            orderDate: -1
                                        }
                                    },
                                    {
                                        $lookup: {
                                            from: "products",
                                            localField: "product",
                                            foreignField: "_id",
                                            pipeline: [
                                                {
                                                    $project: {
                                                        "__v": 0
                                                    }
                                                }
                                            ],
                                            as: "product"
                                        }
                                    },
                                ],
                                as: "orders"
                            },
                        },
                    ])
                        .exec()];
            });
        });
    };
    /**
     * find profile of user
     * @param userId
     * @param amount
     */
    CtrlUser.balanceUpdate = function (userId, amount) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, users_1.default.updateOne({ _id: userId }, { $inc: { balance: amount } })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, { success: true, message: "balance updated successfully" }];
                }
            });
        });
    };
    return CtrlUser;
}());
exports.default = CtrlUser;
//# sourceMappingURL=users.js.map