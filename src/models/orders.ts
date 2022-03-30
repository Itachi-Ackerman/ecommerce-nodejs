/**
 * @info schema for orders
 */
import { Schema, model } from "mongoose";
import { IProduct } from "./products";
import { IUser } from "./users";

export interface IOrder {
    _id: string;
    user: string | IUser;
    product: string | IProduct;
    orderDate: string;
    quantity: number;
    delivered: boolean;
}

const schema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    product: {
        type: Schema.Types.ObjectId,
        ref: "products",
        required: true
    },
    orderDate: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    delivered: {
        type: Boolean,
        required: true
    },
});

export default model<IOrder>("orders", schema);