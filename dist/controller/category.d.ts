/**
 * @info perform CRUD on category
 */
import { ICategory } from "../models/category";
export default class CtrlCategory {
    /**
     * creating a new category
     * @param body
     */
    static create(body: any): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
    * displaying all categories
    * @param page - the page number (starting from 0)
    * @param limit - no of documents to be returned per page
    */
    static findAll(page: number, limit: number): Promise<ICategory[]>;
}
