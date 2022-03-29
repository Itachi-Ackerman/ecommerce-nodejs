/**
 * @info schema for seller
 */
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
export interface ISeller {
    _id: string;
    name: string;
    email: string;
    password: string;
    totalRevenue: number;
    netProfit: number;
    totalOrders: number;
}
declare const _default: import("mongoose").Model<ISeller, {}, {}, {}>;
export default _default;
