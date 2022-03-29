/**
 * @info the main entry point of express server
 */
export default class Server {
    app: import("express-serve-static-core").Express;
    start(): Promise<void>;
    /**
     * middlewares
     */
    middleware(): void;
    /**
     * app routes
     */
    routes(): void;
    /**
     * default routes
     */
    defRoutes(): void;
}
