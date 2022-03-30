/**
 * @info perform CRUD on category
 */
import category, { ICategory } from "../models/category";

export default class CtrlCategory {
    /**
     * creating a new category
     * @param body
     */
    static async create(body: any) {
        const data = {
            name: body
        }
        await category.create(data);
        return { success: true, message: "category created successfully" };
    }

    /**
    * displaying all categories
    * @param page - the page number (starting from 0)
    * @param limit - no of documents to be returned per page
    */
    static async findAll(page: number, limit: number): Promise<ICategory[]> {
        //skipping and limiting before showing entire category list
        return category
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
                }

            ])
            .exec()
    }
}