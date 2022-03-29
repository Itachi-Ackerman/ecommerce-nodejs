/**
 * @info schema for category
 */
import { Schema, model } from "mongoose";
export interface ICategory {
    _id: string;
    name: string
}
const schema = new Schema({
    name: {
        type: String,
        required: true,
    }

});

export default model<ICategory>("category", schema);