"use strict";
/**
 * @info the main entry point of express server
 */
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
var express_1 = __importDefault(require("express"));
var body_parser_1 = __importDefault(require("body-parser"));
var expressResponse_1 = __importDefault(require("../middleware/expressResponse"));
var joi_1 = __importDefault(require("joi"));
var express_session_1 = __importDefault(require("express-session"));
var connect_mongo_1 = __importDefault(require("connect-mongo"));
var morgan_1 = __importDefault(require("morgan"));
var users_1 = __importDefault(require("../controller/users"));
var admin_1 = __importDefault(require("../controller/admin"));
var category_1 = __importDefault(require("../controller/category"));
var orders_1 = __importDefault(require("../controller/orders"));
var products_1 = __importDefault(require("../controller/products"));
var sellers_1 = __importDefault(require("../controller/sellers"));
var Time_1 = __importDefault(require("../utils/Time"));
var Server = /** @class */ (function () {
    function Server() {
        this.app = (0, express_1.default)();
    }
    Server.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                console.log("Starting express server");
                this.app.listen(process.env.PORT);
                console.log("Express server started at http://localhost:".concat(process.env.PORT));
                this.middleware();
                this.routes();
                this.defRoutes();
                return [2 /*return*/];
            });
        });
    };
    /**
     * middlewares
     */
    Server.prototype.middleware = function () {
        //using morgan to log requests
        this.app.use((0, morgan_1.default)("tiny"));
        //to take input from user for post requests
        this.app.use(body_parser_1.default.urlencoded({ extended: false }));
        //initilizing session and cookies
        this.app.use((0, express_session_1.default)({
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: false,
            store: connect_mongo_1.default.create({
                mongoUrl: process.env.SESSION_MONGO_URL,
            }),
            cookie: {
                maxAge: 7 * 24 * 60 * 60 * 1000,
            },
        }));
    };
    /**
     * app routes
     */
    Server.prototype.routes = function () {
        // USER ROUTES
        var _this = this;
        // create a user
        this.app.post("/users/create", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.admin)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            name: joi_1.default.string().required(),
                            email: joi_1.default.string().email().required(),
                            password: joi_1.default.string().required(),
                            balance: joi_1.default.number().default(0)
                        });
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        data = _a.sent();
                        // creating user
                        return [2 /*return*/, users_1.default.create(data)];
                    case 2: throw new Error("Admin not authenticated");
                }
            });
        }); }));
        // authenticate a user
        this.app.post("/users/auth", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, user;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = joi_1.default.object({
                            email: joi_1.default.string().email().required(),
                            password: joi_1.default.string().required(),
                        });
                        // validating req.body
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        // validating req.body
                        _a.sent();
                        return [4 /*yield*/, users_1.default.auth(req.body.email, req.body.password)];
                    case 2:
                        user = _a.sent();
                        // set the user session
                        // @ts-ignore
                        req.session.user = user;
                        return [2 /*return*/, { success: true, message: "user authenticated successfully" }];
                }
            });
        }); }));
        // authentication check
        this.app.get("/users/me", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // check authentication
                // @ts-ignore
                if (req.session && req.session.user) {
                    // @ts-ignore
                    return [2 /*return*/, req.session.user.email];
                }
                // throw error
                else
                    throw new Error("user not authenticated");
                return [2 /*return*/];
            });
        }); }));
        // display all users
        this.app.get("/users/findAll", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.admin)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            page: joi_1.default.number().integer().default(0),
                            limit: joi_1.default.number().integer().default(5),
                        });
                        return [4 /*yield*/, schema.validateAsync(req.query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, users_1.default.findAll(data.page, data.limit)];
                    case 2: throw new Error("admin not authenticated");
                }
            });
        }); }));
        // display user profile
        this.app.get("/users/profile", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // check user authentication
                //@ts-ignore
                if (req.session && req.session.user) {
                    //@ts-ignore
                    return [2 /*return*/, users_1.default.userProfile(req.session.user._id)];
                }
                //throw error
                else
                    throw new Error("user not authenticated");
                return [2 /*return*/];
            });
        }); }));
        // logging out user
        this.app.post("/users/logout", (0, expressResponse_1.default)(function (req) {
            // destroy session
            //@ts-ignore
            req.session.user.destroy(function () { });
            // return success to user
            return { success: true, message: "user is logged out" };
        }));
        //updating user balance/wallet
        this.app.put("/users/balanceUpdate", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, amt;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.user)) return [3 /*break*/, 2];
                        schema = joi_1.default.number().default(0);
                        return [4 /*yield*/, schema.validateAsync(req.body.amount)];
                    case 1:
                        amt = _a.sent();
                        //@ts-ignore
                        return [2 /*return*/, users_1.default.balanceUpdate(req.session.user._id, amt)];
                    case 2: throw new Error("user not authenticated");
                }
            });
        }); }));
        // ADMIN ROUTES
        // authenticate a admin
        this.app.post("/admin/auth", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, admin;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = joi_1.default.object({
                            email: joi_1.default.string().email().required(),
                            password: joi_1.default.string().required(),
                        });
                        // validating req.body
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        // validating req.body
                        _a.sent();
                        return [4 /*yield*/, admin_1.default.auth(req.body.email, req.body.password)];
                    case 2:
                        admin = _a.sent();
                        // set the admin session
                        // @ts-ignore
                        req.session.admin = admin;
                        return [2 /*return*/, { success: true, message: "Admin authenticated successfully" }];
                }
            });
        }); }));
        // logging out admin
        this.app.post("/admin/logout", (0, expressResponse_1.default)(function (req) {
            // destroy session
            //@ts-ignore
            req.session.admin.destroy(function () { });
            // return success to admin
            return { success: true, message: "admin is logged out" };
        }));
        // SELLER ROUTES
        // create a seller
        this.app.post("/sellers/create", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.admin)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            name: joi_1.default.string().required(),
                            email: joi_1.default.string().email().required(),
                            password: joi_1.default.string().required(),
                            totalRevenue: joi_1.default.number().default(0),
                            netProfit: joi_1.default.number().default(0),
                            totalOrders: joi_1.default.number().default(0)
                        });
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        data = _a.sent();
                        // creating seller
                        return [2 /*return*/, sellers_1.default.create(data)];
                    case 2: throw new Error("Admin not authenticated");
                }
            });
        }); }));
        // authenticate a seller
        this.app.post("/sellers/auth", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, seller;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = joi_1.default.object({
                            email: joi_1.default.string().email().required(),
                            password: joi_1.default.string().required(),
                        });
                        // validating req.body
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        // validating req.body
                        _a.sent();
                        return [4 /*yield*/, sellers_1.default.auth(req.body.email, req.body.password)];
                    case 2:
                        seller = _a.sent();
                        // set the seller session
                        // @ts-ignore
                        req.session.seller = seller;
                        return [2 /*return*/, { success: true, message: "seller authenticated successfully" }];
                }
            });
        }); }));
        // authentication check
        this.app.get("/sellers/me", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // check seller authentication
                // @ts-ignore
                if (req.session && req.session.seller) {
                    // @ts-ignore
                    return [2 /*return*/, req.session.seller.email];
                }
                // throw error
                else
                    throw new Error("seller not authenticated");
                return [2 /*return*/];
            });
        }); }));
        // display all sellers
        this.app.get("/sellers/findAll", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.admin)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            page: joi_1.default.number().integer().default(0),
                            limit: joi_1.default.number().integer().default(5),
                        });
                        return [4 /*yield*/, schema.validateAsync(req.query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, sellers_1.default.findAll(data.page, data.limit)];
                    case 2: throw new Error("admin not authenticated");
                }
            });
        }); }));
        // display seller profile
        this.app.get("/sellers/profile", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                // check seller authentication
                //@ts-ignore
                if (req.session && req.session.seller) {
                    //@ts-ignore
                    return [2 /*return*/, sellers_1.default.sellerProfile(req.session.seller._id)];
                }
                //throw error
                else
                    throw new Error("seller not authenticated");
                return [2 /*return*/];
            });
        }); }));
        //updating an order to deivered
        this.app.put("/sellers/updateDelivered", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, orderId;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.seller)) return [3 /*break*/, 2];
                        schema = joi_1.default.string().required();
                        return [4 /*yield*/, schema.validateAsync(req.body.orderId)];
                    case 1:
                        orderId = _a.sent();
                        //@ts-ignore
                        return [2 /*return*/, sellers_1.default.updateOrderToDelivered(req.session.seller._id, orderId)];
                    case 2: throw new Error("seller not authenticated");
                }
            });
        }); }));
        //dispaying seller orders
        this.app.put("/sellers/findOrders", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, del;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.seller)) return [3 /*break*/, 2];
                        schema = joi_1.default.string().default("none");
                        return [4 /*yield*/, schema.validateAsync(req.body.delivered)];
                    case 1:
                        del = _a.sent();
                        //@ts-ignore
                        return [2 /*return*/, sellers_1.default.sellerOrders(req.session.seller._id, del)];
                    case 2: throw new Error("seller not authenticated");
                }
            });
        }); }));
        // logging out seller
        this.app.post("/sellers/logout", (0, expressResponse_1.default)(function (req) {
            // destroy session
            //@ts-ignore
            req.session.seller.destroy(function () { });
            // return success to seller
            return { success: true, message: "seller is logged out" };
        }));
        //CATEGORY ROUTES
        //Create category
        this.app.post("/category/create", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.admin)) return [3 /*break*/, 2];
                        schema = joi_1.default.string().required();
                        return [4 /*yield*/, schema.validateAsync(req.body.name)];
                    case 1:
                        data = _a.sent();
                        // creating category
                        return [2 /*return*/, category_1.default.create(data)];
                    case 2: throw new Error("Admin not authenticated");
                }
            });
        }); }));
        //displaying all categories
        this.app.get("category/findAll", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = joi_1.default.object({
                            page: joi_1.default.number().integer().default(0),
                            limit: joi_1.default.number().integer().default(5),
                        });
                        return [4 /*yield*/, schema.validateAsync(req.query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, category_1.default.findAll(data.page, data.limit)];
                }
            });
        }); }));
        //PRODUCT ROUTES
        // Create a product
        this.app.post("/products/create", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.seller)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            productName: joi_1.default.string().required(),
                            sellingPrice: joi_1.default.number().required(),
                            costPrice: joi_1.default.number().required(),
                            productDate: Time_1.default.current(),
                            //@ts-ignore
                            seller: req.session.seller._id,
                            category: joi_1.default.string().required(),
                            availableQuantity: joi_1.default.number().required()
                        });
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        data = _a.sent();
                        // creating seller
                        return [2 /*return*/, products_1.default.create(data)];
                    case 2: throw new Error("Seller not authenticated");
                }
            });
        }); }));
        //displaying all products
        this.app.get("products/findAll", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        schema = joi_1.default.object({
                            page: joi_1.default.number().integer().default(0),
                            limit: joi_1.default.number().integer().default(5),
                            filterBy: joi_1.default.string().default("productDate"),
                            order: joi_1.default.string().default("dsc"),
                            category: joi_1.default.string().default("none")
                        });
                        return [4 /*yield*/, schema.validateAsync(req.query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, products_1.default.findAll(data.page, data.limit, data.filterBy, data.order, data.category)];
                }
            });
        }); }));
        //ORDER ROUTES
        // Placing an order
        this.app.post("/orders/placeOrder", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.user)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            productId: joi_1.default.string().required(),
                            quantity: joi_1.default.number().default(1)
                        });
                        return [4 /*yield*/, schema.validateAsync(req.body)];
                    case 1:
                        data = _a.sent();
                        // Placing order
                        //@ts-ignore
                        return [2 /*return*/, orders_1.default.placeOrder(req.session.user._id, data.productId, data.quantity)];
                    case 2: throw new Error("User not authenticated");
                }
            });
        }); }));
        //displaying all orders
        this.app.get("orders/findAll", (0, expressResponse_1.default)(function (req) { return __awaiter(_this, void 0, void 0, function () {
            var schema, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(req.session && req.session.admin)) return [3 /*break*/, 2];
                        schema = joi_1.default.object({
                            page: joi_1.default.number().integer().default(0),
                            limit: joi_1.default.number().integer().default(5),
                        });
                        return [4 /*yield*/, schema.validateAsync(req.query)];
                    case 1:
                        data = _a.sent();
                        return [2 /*return*/, orders_1.default.findAll(data.page, data.limit)];
                    case 2: throw new Error("Admin not authenticated");
                }
            });
        }); }));
    };
    /**
     * default routes
     */
    Server.prototype.defRoutes = function () {
        // check if server running
        this.app.all("/", function (req, resp) {
            resp.status(200).send({ success: true, message: "Server is working" });
        });
        this.app.all("*", function (req, resp) {
            resp.status(404).send({ success: false, message: "given route [".concat(req.method, "] ").concat(req.path, " not found") });
        });
    };
    return Server;
}());
exports.default = Server;
//# sourceMappingURL=server.js.map