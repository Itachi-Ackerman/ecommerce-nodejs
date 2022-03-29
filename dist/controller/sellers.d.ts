/**
 * @info perform CRUD on seller
 */
import { ISeller } from "../models/sellers";
import { IOrder } from "../models/orders";
export default class CtrlSeller {
    /**
     * creating a new seller
     * @param body
     */
    static create(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * authenticating a seller
     * @param email
     * @param password
     */
    static auth(email: string, password: string): Promise<ISeller & {
        _id: string;
    }>;
    /**
     * displaying all sellers
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     */
    static findAll(page: number, limit: number): Promise<ISeller[]>;
    /**
     * find profile of seller
     * @param sellerId
     * @param fiterByStock - filtering by availibility
     */
    static sellerProfile(sellerId: string, fiterByStock: string): Promise<ISeller[]>;
    /**
     * update order to delivered
     * @param sellerId
     * @param orderId
     * @param delivered
     */
    static updateOrderToDelivered(sellerId: string, orderId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * find all orders of seller
     * @param sellerId
     * @param delivered - filtered on the basis of delivery
     */
    static sellerOrders(sellerId: string, delivered: string): Promise<IOrder[]>;
}
