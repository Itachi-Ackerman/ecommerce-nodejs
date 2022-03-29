export default class CtrlAdmin {
    /**
    * authenticating admin
    * @param email
    * @param password
    */
    static auth(email: string, password: string): Promise<Object>;
}
