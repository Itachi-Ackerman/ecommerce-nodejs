/**
 * @info schema for products
 */
import { ISeller } from "./sellers";
import { ICategory } from "./category";
import { Schema, model } from "mongoose";

export interface IProduct {
    _id: string;
    productName: string;
    sellingPrice: number;
    costPrice: number;
    productDate: string;
    seller: ISeller | string;
    category: ICategory | string;
    availableQuantity: number;
}

const schema = new Schema({

    productName: {
        type: String,
        required: true
    },
    sellingPrice: {
        type: Number,
        required: true
    },
    costPrice: {
        type: Number,
        required: true
    },
    productDate: {
        type: String,
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: "sellers",
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "category",
        required: true
    },
    availableQuantity: {
        type: Number,
        required: true
    },
});

export default model<IProduct>("products", schema);