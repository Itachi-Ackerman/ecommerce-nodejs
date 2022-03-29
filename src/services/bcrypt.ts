/**
 * @info hashing/comparing password
 */
 import { hash, genSalt, compare } from "bcryptjs";

 export default class Bcrypt {
     /**
      * hashing our password
      * @param password
      */
     static async hashing(password: string): Promise<string> {
         const salt = await genSalt(10);
         return hash(password, salt);
     }
 
     /**
      * comparing the password to hash
      * @param password
      * @param hash
      */
     static async comparing(password: string, hash: string): Promise<boolean> {
         return compare(password, hash);
     }
 }
 