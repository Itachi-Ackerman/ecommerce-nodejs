export default class CtrlAdmin {

    /**
    * authenticating admin
    * @param email
    * @param password
    */
    static async auth(email: string, password: string): Promise<Object> {

        //initializing static admin details
        let admin = {
            email: "admin@abc.com",
            password: "123456"
        }

        // if users exists or not
        if (email === admin.email) {
            // if password is correct or not
            // if correct, return the user
            if (password === admin.password) return admin;
            // throw error
            else throw new Error("password doesn't match");
        }
        // throw error
        else throw new Error("admin email incorrect");
    }
}