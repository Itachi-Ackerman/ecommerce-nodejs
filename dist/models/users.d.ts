/**
 * @info schema for user
 */
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose" />
export interface IUser {
    _id: string;
    name: string;
    email: string;
    password: string;
    balance: number;
}
declare const _default: import("mongoose").Model<IUser, {}, {}, {}>;
export default _default;
