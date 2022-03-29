/**
 * @info - use to generalize responses (mainly errors)
 */
import { Request, Response } from "express";
/**
 * default exported function
 * @public
 */
export default function (fn: any): (req: Request, resp: Response, next: any) => Promise<void>;
