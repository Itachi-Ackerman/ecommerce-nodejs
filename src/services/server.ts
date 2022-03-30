/**
 * @info the main entry point of express server
 */

import express, { Request } from "express";
import bodyParser from "body-parser";
import expressResponse from "../middleware/expressResponse";
import Joi from "joi";
import session from "express-session";
import MongoStore from "connect-mongo";
import morgan from "morgan";
import CtrlUser from "../controller/users";
import CtrlAdmin from "../controller/admin";
import CtrlCategory from "../controller/category";
import CtrlOrder from "../controller/orders";
import CtrlProduct from "../controller/products";
import CtrlSeller from "../controller/sellers";
import Time from "../utils/Time";

export default class Server {
    app = express();

    async start() {
        console.log("Starting express server");
        this.app.listen(process.env.PORT);
        console.log(`Express server started at http://localhost:${process.env.PORT}`);

        this.middleware();
        this.routes();
        this.defRoutes();
    }

    /**
     * middlewares
     */
    middleware() {
        //using morgan to log requests
        this.app.use(morgan("tiny"));
        //to take input from user for post requests
        this.app.use(bodyParser.urlencoded({ extended: false }));
        //initilizing session and cookies
        this.app.use(
            session({
                secret: process.env.SESSION_SECRET,
                resave: false,
                saveUninitialized: false,
                store: MongoStore.create({
                    mongoUrl: process.env.SESSION_MONGO_URL,
                }),
                cookie: {
                    maxAge: 7 * 24 * 60 * 60 * 1000,
                },
            }),
        );
    }

    /**
     * app routes
     */
    routes() {

        // USER ROUTES

        // create a user
        this.app.post(
            "/users/create",
            expressResponse(async (req: Request) => {
                //authenticating admin
                //@ts-ignore
                if (req.session && req.session.admin) {
                    // create joi schema
                    const schema = Joi.object({
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                        balance: Joi.number().default(0)
                    });

                    // validating req.body
                    const data = await schema.validateAsync(req.body);

                    // creating user
                    return CtrlUser.create(data);
                }
                else throw new Error("Admin not authenticated");
            }),
        );

        // authenticate a user
        this.app.post(
            "/users/auth",
            expressResponse(async (req: Request) => {
                // create joi schema
                const schema = Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                });

                // validating req.body
                await schema.validateAsync(req.body);

                // authenticate user
                const user = await CtrlUser.auth(req.body.email, req.body.password);

                // set the user session
                // @ts-ignore
                req.session.user = user;

                return { success: true, message: "user authenticated successfully" };
            }),
        );

        // authentication check
        this.app.get(
            "/users/me",
            expressResponse(async (req: Request) => {
                // check authentication
                // @ts-ignore
                if (req.session && req.session.user) {
                    // @ts-ignore
                    return req.session.user.email;
                }
                // throw error
                else throw new Error("user not authenticated");
            }),
        );

        // display all users
        this.app.get(
            "/users/findAll",
            expressResponse(async (req: Request) => {
                // check admin authentication
                //@ts-ignore
                if (req.session && req.session.admin) {

                    const schema = Joi.object({
                        page: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(5),
                    });

                    // validate
                    const data = await schema.validateAsync(req.query);

                    return CtrlUser.findAll(data.page, data.limit);
                }

                //throw error
                else throw new Error("admin not authenticated");
            }),
        );

        // display user profile
        this.app.get(
            "/users/profile",
            expressResponse(async (req: Request) => {
                // check user authentication
                //@ts-ignore
                if (req.session && req.session.user) {
                    //@ts-ignore
                    return CtrlUser.userProfile(req.session.user._id);
                }

                //throw error
                else throw new Error("user not authenticated");
            }),
        );

        // logging out user
        this.app.post(
            "/users/logout",
            expressResponse((req: Request) => {
                // destroy session
                //@ts-ignore
                req.session.destroy(() => { });

                // return success to user
                return { success: true, message: "user is logged out" };
            }),
        );

        //updating user balance/wallet
        this.app.put("/users/balanceUpdate", expressResponse(async (req: Request) => {
            // check user authentication
            //@ts-ignore
            if (req.session && req.session.user) {

                const schema = Joi.number().default(0);

                //validate
                const amt = await schema.validateAsync(req.body.amount);
                //@ts-ignore
                return CtrlUser.balanceUpdate(req.session.user._id, amt);
            }

            //throw error
            else throw new Error("user not authenticated");
        }))

        // ADMIN ROUTES

        // authenticate a admin
        this.app.post(
            "/admin/auth",
            expressResponse(async (req: Request) => {
                // create joi schema
                const schema = Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                });

                // validating req.body
                await schema.validateAsync(req.body);

                // authenticate admin
                const admin = await CtrlAdmin.auth(req.body.email, req.body.password);

                // set the admin session
                // @ts-ignore
                req.session.admin = admin;

                return { success: true, message: "Admin authenticated successfully" };
            }),
        );

        // logging out admin
        this.app.post(
            "/admin/logout",
            expressResponse((req: Request) => {
                // destroy session
                //@ts-ignore
                req.session.destroy(() => { });

                // return success to admin
                return { success: true, message: "admin is logged out" };
            }),
        );

        // SELLER ROUTES

        // create a seller
        this.app.post(
            "/sellers/create",
            expressResponse(async (req: Request) => {
                //authenticating admin
                //@ts-ignore
                if (req.session && req.session.admin) {
                    // create joi schema
                    const schema = Joi.object({
                        name: Joi.string().required(),
                        email: Joi.string().email().required(),
                        password: Joi.string().required(),
                        totalRevenue: Joi.number().default(0),
                        netProfit: Joi.number().default(0),
                        totalOrders: Joi.number().default(0)
                    });

                    // validating req.body
                    const data = await schema.validateAsync(req.body);

                    // creating seller
                    return CtrlSeller.create(data);
                }
                else throw new Error("Admin not authenticated");
            }),
        );

        // authenticate a seller
        this.app.post(
            "/sellers/auth",
            expressResponse(async (req: Request) => {
                // create joi schema
                const schema = Joi.object({
                    email: Joi.string().email().required(),
                    password: Joi.string().required(),
                });

                // validating req.body
                await schema.validateAsync(req.body);

                // authenticate seller
                const seller = await CtrlSeller.auth(req.body.email, req.body.password);

                // set the seller session
                // @ts-ignore
                req.session.seller = seller;

                return { success: true, message: "seller authenticated successfully" };
            }),
        );

        // authentication check
        this.app.get(
            "/sellers/me",
            expressResponse(async (req: Request) => {
                // check seller authentication
                // @ts-ignore
                if (req.session && req.session.seller) {
                    // @ts-ignore
                    return req.session.seller.email;
                }
                // throw error
                else throw new Error("seller not authenticated");
            }),
        );

        // display all sellers
        this.app.get(
            "/sellers/findAll",
            expressResponse(async (req: Request) => {
                // check admin authentication
                //@ts-ignore
                if (req.session && req.session.admin) {

                    const schema = Joi.object({
                        page: Joi.number().integer().default(0),
                        limit: Joi.number().integer().default(5),
                    });

                    // validate
                    const data = await schema.validateAsync(req.query);

                    return CtrlSeller.findAll(data.page, data.limit);
                }

                //throw error
                else throw new Error("admin not authenticated");
            }),
        );

        // display seller profile
        this.app.get(
            "/sellers/profile",
            expressResponse(async (req: Request) => {
                // check seller authentication
                //@ts-ignore
                if (req.session && req.session.seller) {
                    //creating Joi schema
                    const schema = Joi.string().default("none");

                    //validate
                    const filterByStock = await schema.validateAsync(req.query.filterByStock);
                    //@ts-ignore
                    return CtrlSeller.sellerProfile(req.session.seller._id,filterByStock);
                }

                //throw error
                else throw new Error("seller not authenticated");
            }),
        );

        //updating an order to deivered
        this.app.put("/sellers/updateDelivered", expressResponse(async (req: Request) => {
            // check seller authentication
            //@ts-ignore
            if (req.session && req.session.seller) {

                //create joi schema
                const schema = Joi.string().required();

                //validate
                const orderId = await schema.validateAsync(req.body.orderId);

                //@ts-ignore
                return CtrlSeller.updateOrderToDelivered(req.session.seller._id, orderId);
            }

            //throw error
            else throw new Error("seller not authenticated");
        }))

        //dispaying seller orders
        this.app.put("/sellers/findOrders", expressResponse(async (req: Request) => {
            // check seller authentication
            //@ts-ignore
            if (req.session && req.session.seller) {

                //create joi schema
                const schema = Joi.string().default("none");

                //validate
                const del = await schema.validateAsync(req.body.delivered);

                //@ts-ignore
                return CtrlSeller.sellerOrders(req.session.seller._id, del);
            }

            //throw error
            else throw new Error("seller not authenticated");
        }))
        // logging out seller
        this.app.post(
            "/sellers/logout",
            expressResponse((req: Request) => {
                // destroy session
                //@ts-ignore
                req.session.destroy(() => { });

                // return success to seller
                return { success: true, message: "seller is logged out" };
            }),
        );

        //CATEGORY ROUTES

        //Create category
        this.app.post(
            "/category/create",
            expressResponse(async (req: Request) => {
                //authenticating admin
                //@ts-ignore
                if (req.session && req.session.admin) {
                    // create joi schema
                    const schema = Joi.string().required();

                    // validating req.body
                    const data = await schema.validateAsync(req.body.name);

                    // creating category
                    return CtrlCategory.create(data);
                }
                else throw new Error("Admin not authenticated");
            }),
        );

        //displaying all categories
        this.app.get("category/findAll", expressResponse(async (req: Request) => {
            //creating joi schema
            const schema = Joi.object({
                page: Joi.number().integer().default(0),
                limit: Joi.number().integer().default(5),
            });

            // validate
            const data = await schema.validateAsync(req.query);

            return CtrlCategory.findAll(data.page, data.limit);
        })
        );

        //PRODUCT ROUTES

         // Create a product
         this.app.post(
            "/products/create",
            expressResponse(async (req: Request) => {
                //authenticating seller
                //@ts-ignore
                if (req.session && req.session.seller) {
                    // create joi schema
                    const schema = Joi.object({
                        productName: Joi.string().required(),
                        sellingPrice: Joi.number().required(),
                        costPrice: Joi.number().required(),
                        productDate: Time.current(),
                        //@ts-ignore
                        seller: req.session.seller._id,
                        category: Joi.string().required(),
                        availableQuantity: Joi.number().required()
                    });

                    // validating req.body
                    const data = await schema.validateAsync(req.body);

                    // creating seller
                    return CtrlProduct.create(data);
                }
                else throw new Error("Seller not authenticated");
            }),
        );

        //displaying all products
        this.app.get("products/findAll", expressResponse(async (req: Request) => {
            //creating joi schema
            const schema = Joi.object({
                page: Joi.number().integer().default(0),
                limit: Joi.number().integer().default(5),
                filterBy: Joi.string().default("productDate"),
                order: Joi.string().default("dsc"),
                category: Joi.string().default("none")
            });

            // validate
            const data = await schema.validateAsync(req.query);

            return CtrlProduct.findAll(data.page,data.limit,data.filterBy,data.order,data.category);
        })
        );

        //ORDER ROUTES
        // Placing an order
        this.app.post(
            "/orders/placeOrder",
            expressResponse(async (req: Request) => {
                //authenticating user
                //@ts-ignore
                if (req.session && req.session.user) {
                    // create joi schema
                    const schema = Joi.object({
                        productId : Joi.string().required(),
                        quantity: Joi.number().default(1)
                    });

                    // validating req.body
                    const data = await schema.validateAsync(req.body);

                    // Placing order
                    //@ts-ignore
                    return CtrlOrder.placeOrder(req.session.user._id,data.productId,data.quantity);
                }
                else throw new Error("User not authenticated");
            }),
        );

        //displaying all orders
        this.app.get("orders/findAll", expressResponse(async (req: Request) => {

            //authenticating admin
            //@ts-ignore
            if (req.session && req.session.admin) {
            //creating joi schema
            const schema = Joi.object({
                page: Joi.number().integer().default(0),
                limit: Joi.number().integer().default(5),
            });

            // validate
            const data = await schema.validateAsync(req.query);

            return CtrlOrder.findAll(data.page, data.limit);
        }
        else throw new Error("Admin not authenticated");
        })
        );


    }

    /**
     * default routes
     */
    defRoutes() {
        // check if server running
        this.app.all("/", (req, resp) => {
            resp.status(200).send({ success: true, message: "Server is working" });
        });

        this.app.all("*", (req, resp) => {
            resp.status(404).send({ success: false, message: `given route [${req.method}] ${req.path} not found` });
        });
    }
}
