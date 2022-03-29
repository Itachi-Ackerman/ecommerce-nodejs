/**
 * @info schema for seller
 */

 import { Schema, model } from "mongoose";
 
 export interface ISeller {
     _id: string;
     name: string;
     email: string;
     password: string;
     totalRevenue: number;
     netProfit: number;
     totalOrders: number;
 }
 
 const schema = new Schema({
     name: {
         type: String,
         required: true,
     },
     email: {
         type: String,
         required: true,
         unique: true,
     },
     password: {
         type: String,
         required: true,
     },
     totalRevenue: {
         type: Number,
         required: true,
     },
     netProfit: {
         type: Number,
         required: true,
     },
     totalOrders: {
         type: Number,
         required: true,
     },
 });
 
 export default model<ISeller>("sellers", schema);