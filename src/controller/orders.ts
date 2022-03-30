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
    static async placeOrder(userId: string, productId: string, quantity: number) {

        //accessing respective objects from collections
        const product1 : IProduct = await products.findOne({ "_id": productId }) as IProduct;

        //checking if product object was found, if not throw error
        if (product1) {
            //checking if products available>=0 even after subtracting required seats
            if ((product1.availableQuantity - quantity) > -1) {
                //incrementing/decrementing in database wherever necessary
                const cp = product1.costPrice;
                const sp = product1.sellingPrice;
                await products.updateOne({ _id: productId }, { $inc: { availableQuantity: -quantity } });
                await users.updateOne({_id: userId},{ $inc: { balance: -(quantity*sp) } })
                await sellers.updateOne({_id: userId},{ $inc: { totalRevenue: quantity*sp, netProfit: quantity*(cp-sp), totalOrders: quantity } })
                await orders.create({
                    user: userId,
                    product: productId,
                    orderDate: Time.current(),
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
                            }
                        ],
                        as: "product"
                    }
                },
 
             ])
             .exec()
     }
 }