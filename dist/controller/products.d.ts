import { IProduct } from "../models/products";
export default class CtrlProduct {
    /**
     * create new product
     */
    static create(body: IProduct): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * find all products
     * @param page - the page number (starting from 0)
     * @param limit - no of documents to be returned per page
     * @param filterBy - field can be filtered by
     * @param order - execute in order
     *
     */
    static findAll(page: number, limit: number, filterBy: string, order: string, category: string): Promise<IProduct[]>;
}
