/**
 * @info - use to generalize responses (mainly errors)
 */
 import { Request, Response } from "express";

 /**
  * default exported function
  * @public
  */
 export default function (fn) {
     return async function (req: Request, resp: Response, next) {
         try {
             const response = await fn(req, resp, next);
             resp.status(200).send(response);
         } catch (e) {
             resp.status(500).send({ success: false, message: e.message });
         }
     };
 }
 