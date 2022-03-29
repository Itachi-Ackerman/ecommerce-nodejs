export default class Bcrypt {
    /**
     * hashing our password
     * @param password
     */
    static hashing(password: string): Promise<string>;
    /**
     * comparing the password to hash
     * @param password
     * @param hash
     */
    static comparing(password: string, hash: string): Promise<boolean>;
}
