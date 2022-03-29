/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
/**
 * @info schema for products
 */
import { ISeller } from "./sellers";
import { ICategory } from "./category";
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
declare const _default: import("mongoose").Model<IProduct, {}, {}, {}>;
export default _default;
