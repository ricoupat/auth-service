import {Router} from "express";
import {AuthController} from "../controllers/AuthController";
import {AuthMiddleware} from "@ricoupat/common-libs";

export class AuthRoutes {
    public router: Router;
    private controller: AuthController;
    private authMiddleware: AuthMiddleware;

    constructor() {
        this.router = Router();
        this.controller = new AuthController();
        this.authMiddleware = new AuthMiddleware();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/register", this.authMiddleware.authentification, this.controller.register);
        this.router.post("/login", this.authMiddleware.authentification, this.controller.login);
        this.router.post("/logout", this.authMiddleware.authentification, this.controller.logout);
        this.router.post("/verify", this.authMiddleware.authentification, this.controller.verify);
        this.router.post("/refresh", this.authMiddleware.authentification, this.controller.refresh);
        this.router.delete("/delete", this.authMiddleware.authentification, this.controller.delete);
    }
}