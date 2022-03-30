/**
 * @info perform CRUD on seller
 */
import sellers, { ISeller } from "../models/sellers";
import Bcrypt from "../services/bcrypt";
import mongoose from "mongoose";
import orders, { IOrder } from "../models/orders";
import products from "../models/products";

export default class CtrlSeller {
    /**
     * creating a new seller
     * @param body
     */
    static async create(body: any) {
        //generating hashed password
        const hash = await Bcrypt.hashing(body.password);
        const data = {
            ...body,
            password: hash,
        };
        await sellers.create(data);
        return { success: true, message: "seller created successfully" };
    }

    /**
     * authenticating a seller
     * @param email
     * @param password
     */
    static async auth(email: string, password: string) {
        // fetch seller from database
        const seller = await sellers.findOne({ email }, { totalRevenue: 0, netProfit: 0, totalOrders: 0 }).lean();

        // if seller exists or not
        if (seller) {
            // verify the password
            const result = await Bcrypt.comparing(password, seller.password);

            // if password is correct or not
            // if correct, return the seller
            if (result) return seller;
            // throw error
            else throw new Error("password doesn't match");
        }
        // throw error
        else throw new Error("seller doesn't exists");
    }

    /**
     * displaying all sellers
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static async findAll(page: number, limit: number): Promise<ISeller[]> {
        //skipping and limiting before showing entire sellers list
        return sellers
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
            .exec()
    }

    /**
     * find profile of seller
     * @param sellerId 
     * @param fiterByStock - filtering by availibility
     */
    static async sellerProfile(sellerId: string, filterByStock: string): Promise<ISeller[]> {

        let match1;
        //filtering by stock
        if (filterByStock.toLowerCase() == "no") {
            match1 = {
                //matching sellerId from sellers with seller Id in products collection
                $match:
                {
                    $expr:
                    {

                        $eq: ["$seller", "$$sellerId"]

                    }
                }
            }
        }
        else {
            match1 = {
                //matching sellerId from sellers with seller Id in products collection
                $match:
                {
                    $expr:
                    {
                        $and:
                            [
                                {
                                    $eq: ["$seller", "$$sellerId"]
                                },
                                {
                                    $gt: ["$availableQuantity", 0]
                                }
                            ]

                    }
                }
            }

        }
        return sellers
            .aggregate([
                {
                    //matching sellerID with sellerId from seller collection
                    $match: {
                        _id: new mongoose.Types.ObjectId(sellerId)
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
                                    from: "categories",
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
            .exec();
    }

    /**
     * update order to delivered
     * @param sellerId 
     * @param orderId 
     * @param delivered 
     */

    static async updateOrderToDelivered(sellerId: string, orderId: string) {
        const order1 = await orders.findOne({ _id: orderId });
        if (order1) {
            const prod = await products.findOne({ _id: order1.product })
            if (prod.seller == sellerId) {
                await orders.updateOne({ _id: orderId }, { $set: { delivered: true } });
                return { success: true, message: "order updated to delivered successfully" };
            }
            else throw new Error("Seller ID does not match!")
        }
        else throw new Error("Order not found");
    }

    /**
     * find all orders of seller
     * @param sellerId 
     * @param delivered - filtered on the basis of delivery
     */
    static async sellerOrders(sellerId: string, delivered: string): Promise<IOrder[]> {

        //assigning conditional values depending on seller filter preference
        let flag = null, match1;
        if (delivered.toLowerCase() == "no") flag = false;

        if (delivered.toLowerCase() == "yes") flag = true;
        //filtering by delivery completion
        if (flag==false || flag==true) {
            match1 = {
                //matching sellerID with sellerId from orders collection
                $match: {
                    "product.seller": new mongoose.Types.ObjectId(sellerId),
                    delivered: flag
                },
            }
        }
        else {
            match1 = {
                //matching sellerID with sellerId from orders collection
                $match: {
                    "product.seller": new mongoose.Types.ObjectId(sellerId)
                },
            }
        }
        return orders
            .aggregate([
                {
                    $lookup: {
                        from: "products",
                        localField: "product",
                        foreignField: "_id",
                        pipeline: [
                            {
                                //looking up form category collection
                                $lookup: {
                                    from: "categories",
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
                                }
                            }

                        ],
                        as: "product"
                    }
                },
                {
                    $unwind: "$product"
                },
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

            ])
            .exec()
    }
}