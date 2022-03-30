/**
 * @info perform CRUD on user
 */
import users, { IUser } from "../models/users";
import Bcrypt from "../services/bcrypt";
import mongoose from "mongoose";

export default class CtrlUser {
    /**
     * creating a new user
     * @param body
     */
    static async create(body: any) {
        //generating hashed password
        const hash = await Bcrypt.hashing(body.password);
        const data = {
            ...body,
            password: hash,
        };
        await users.create(data);
        return { success: true, message: "user created successfully" };
    }

    /**
     * authenticating a user
     * @param email
     * @param password
     */
    static async auth(email: string, password: string) {
        // fetch user from database
        const user = await users.findOne({ email }, { balance: 0 }).lean();

        // if users exists or not
        if (user) {
            // verify the password
            const result = await Bcrypt.comparing(password, user.password);

            // if password is correct or not
            // if correct, return the user
            if (result) return user;
            // throw error
            else throw new Error("password doesn't match");
        }
        // throw error
        else throw new Error("user doesn't exists");
    }

    /**
     * displaying all users
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static async findAll(page: number, limit: number): Promise<IUser[]> {
        //skipping and limiting before showing entire users list
        return users
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
     * find profile of user
     * @param userId 
     */
    static async userProfile(userId: string): Promise<IUser[]> {
        return users
            .aggregate([
                {
                    //matching userID with userId from users collection
                    $match: {
                        _id: new mongoose.Types.ObjectId(userId)
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
                                $match:
                                {
                                    $expr:
                                    {

                                        $eq: ["$user", "$$userId"]

                                    }
                                }
                            },
                            //ignoring unnecessary fields before displaying
                            {
                                $project: {
                                    "user": 0,
                                    "__v": 0,
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
                                                "__v": 0,
                                                "costPrice": 0,
                                                "availableQuantity": 0
                                            }
                                        },
                                        {
                                            $lookup:{
                                                from: "sellers",
                                                localField: "seller",
                                                foreignField: "_id",
                                                pipeline:[
                                                    {
                                                        $project: {
                                                            "__v":0,
                                                            "password": 0,
                                                            "totalRevenue" : 0,
                                                            "netProfit": 0,
                                                            "totalOrders": 0
                                                        }
                                                    }
                                                ],
                                                as: "seller"
                                            }
                                        },
                                        {
                                            $lookup: {
                                                from: "categories",
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
                                    ],
                                    as: "product"
                                }
                            },
                        ],
                        as: "orders"
                    },
                },

            ])
            .exec();
    }
     /**
      * find profile of user
      * @param userId
      * @param amount 
      */
      static async balanceUpdate(userId: string, amount: number) {
        await users.updateOne({ _id: userId }, { $inc: { balance: amount } });
        return {success: true, message: "balance updated successfully"};
      }
}