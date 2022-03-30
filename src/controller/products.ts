import products, { IProduct } from "../models/products";
import category from "../models/category";

export default class CtrlProduct {
    /**
     * create new product
     */
    static async create(body: IProduct) {

        //fetching the category
        const category1 = await category.findOne({ "_id": body.category })

        //if category exists success, else category not in database
        if (category1) {
            await products.create(body);
            return { success: true, message: "Product listed successfully" };
        }
        else
            throw new Error("Category does not exist in the database");
    }


    /**
     * find all products 
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     * @param filterBy - field can be filtered by
     * @param order - execute in order
     * 
     */
    static async findAll(page: number, limit: number, filterBy: string, order: string, category: string): Promise<IProduct[]> {
        //setting order value depending on user preference
        const ord = (order.toLowerCase() == "asc") ? 1 : -1;
        if (filterBy.toLowerCase() == "price") filterBy = "sellingPrice";
        else filterBy = "productDate";
        let sort1 = { $sort: {} };
        sort1["$sort"][filterBy] = ord;
        let match1;
        if (category == "none") {
            match1 = {
                //matching to check if products stock is empty
                $match: {
                    $expr: {
                        $gt: ["$availableQuantity", 0]
                    }
                }
            }
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
            }
        }
        return products
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
                sort1,
            ])

            .exec()
    }

}