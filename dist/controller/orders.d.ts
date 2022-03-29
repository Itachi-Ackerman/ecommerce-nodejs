/**
 * @info perform CRUD on Orders
 */
import { IOrder } from "../models/orders";
export default class CtrlOrder {
    /**
    * Place order
    * @param userId - User ID
    * @param productId - productId given by user
    * @param quantity - required quantity
    */
    static placeOrder(userId: string, productId: string, quantity: number): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     *
     * @param page
     * @param limit
     * @returns
     */
    static findAll(page: number, limit: number): Promise<IOrder[]>;
}
