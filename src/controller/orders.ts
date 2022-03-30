/**
 * @info perform CRUD on Orders
 */
import orders, { IOrder } from "../models/orders"
import products, { IProduct } from "../models/products";
import sellers from "../models/sellers";
import users from "../models/users";
import Time from "../utils/Time";

 
 export default class CtrlOrder {
     /**
     * Place order
     * @param userId - User ID
     * @param productId - productId given by user
     * @param quantity - required quantity
     */
    static async placeOrder(userId: string, productId: string, quantity1: number) {

        //accessing respective objects from collections
        const product1 : IProduct = await products.findOne({ "_id": productId }) as IProduct;
        const user1 = await users.findOne({"_id": userId});
        if(user1.balance<(quantity1*product1.sellingPrice)) throw new Error("Balance insufficient");

        //checking if product object was found, if not throw error
        if (product1) {
            //checking if products available>=0 even after subtracting required seats
            if ((product1.availableQuantity - quantity1) > -1) {

                //incrementing/decrementing in database wherever necessary
                const cp = product1.costPrice;
                const sp = product1.sellingPrice;
                await products.updateOne({ _id: productId }, { $inc: { availableQuantity: -quantity1 } });
                await users.updateOne({_id: userId},{ $inc: { balance: -(quantity1*sp) } })
                await sellers.updateOne({_id: product1.seller},{ $inc: { totalRevenue: quantity1*sp, netProfit: quantity1*(sp-cp), totalOrders: quantity1 } })
                await orders.create({
                    user: userId,
                    product: productId,
                    orderDate: Time.current(),
                    quantity: quantity1,
                    delivered: false
                });
                return { success: true, message: `Order for product ${product1.productName} placed successfully` };
            }
            else
                throw new Error("Quantity required not available");
        }
        else
            throw new Error("Product does not exist !!");

    }

     
 
     /**
      * 
      * @param page 
      * @param limit 
      * @returns 
      */
     static async findAll(page: number, limit: number): Promise<IOrder[]> {
         //skipping and limiting before showing entire category list
         return orders
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
                     $lookup:{
                         from: "users",
                         localField: "user",
                         foreignField: "_id",
                         pipeline:[
                             {
                                 $project:{
                                    "__v":0,
                                    "password":0,
                                    "balance":0,

                                 }
                             }
                         ],
                         as: "user"
                     }
                 },
                 //looking up from products
                 {
                    $lookup:{
                        from: "products",
                        localField: "product",
                        foreignField: "_id",
                        pipeline:[
                            {
                                $project:{
                                   "__v":0,
                                   "costPrice":0,

                                },
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
 
             ])
             .exec()
     }
 }