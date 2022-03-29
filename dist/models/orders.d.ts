/**
 * @info schema for orders
 */
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
import { IProduct } from "./products";
import { IUser } from "./users";
export interface IOrder {
    _id: string;
    user: string | IUser;
    product: string | IProduct;
    orderDate: string;
    delivered: boolean;
}
declare const _default: import("mongoose").Model<IOrder, {}, {}, {}>;
export default _default;
