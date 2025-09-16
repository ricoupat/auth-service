import { Request, Response } from "express";
import {AuthService} from "../services/AuthService";

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    register = async (req: Request, res: Response) => {
        const { username, password, email } = req.body;
        try {
            const { user, tokens } = await this.service.register(username, password, email);
            res.status(201).json({ message: "User created", user: user.username, tokens });
        } catch (err: any) {
            res.status(400).json({ error: err.message });
        }
    }

    login = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            const tokens = await this.service.login(username, password);
            res.status(200).json(tokens);
        } catch (err) {
            res.status(401).json({ error: "Wrong Credentials" });
        }
    }

    delete = async (req: Request, res: Response) => {
        const { username, password } = req.body;
        try {
            await this.service.delete(username, password);
            res.status(200).json({ message: "User deleted", user: username });
        } catch (err) {
            res.status(401).json({ error: "Wrong Credentials" });
        }
    }

    logout = async (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        try {
            await this.service.logout(refreshToken);
            res.status(200).json({ message: "Logged out" });
        } catch {
            res.status(400).json({ error: "Logout failed" });
        }
    };

    verify = (req: Request, res: Response) => {
        const { token } = req.body;
        const decoded = this.service.verifyAccess(token);

        if (!decoded) return res.json({ valid: false });

        res.status(200).json({ valid: true });
    }

    refresh = (req: Request, res: Response) => {
        const { refreshToken } = req.body;
        const tokens  = this.service.verifyRefresh(refreshToken);
        if (!tokens) return res.status(401).json({ error: "Invalid refresh token" });

        res.status(200).json(tokens);
    }
}