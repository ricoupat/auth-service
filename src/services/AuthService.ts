import {UserRepository} from "../repositories/UserRepository";
import bcrypt from "bcryptjs"
import crypto from "crypto";
import jwt from "jsonwebtoken";
import {TokenRepository} from "../repositories/TokenRepository";

const ACCESS_SECRET = process.env.ACCESS_SECRET;
const REFRESH_SECRET = process.env.REFRESH_SECRET;

export class AuthService {
    private userRepository: UserRepository;
    private tokenRepository: TokenRepository;

    constructor() {
        this.userRepository = new UserRepository();
        this.tokenRepository = new TokenRepository();
    }

    async register(username: string, password: string, email: string) {
        const existing  = await this.userRepository.findByUsername(username);

        if (existing) throw new Error("Username already taken");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await this.userRepository.create({ username: username, password: hashedPassword, email: email });
        const tokens = await this.generateTokens(user._id.toString(), user!.username);

        return { user, tokens };
    }

    async login(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        return this.generateTokens(user._id.toString(), user.username)
    }

    async delete(username: string, password: string) {
        const user = await this.userRepository.findByUsername(username);
        if (!user) throw new Error("User not found");

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new Error("Invalid password");

        await this.userRepository.delete(username);
        await this.tokenRepository.deleteMany(user._id.toString())

        return true;
    }

    async logout(refreshToken: string) {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET!) as any;
        const hashed = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await this.tokenRepository.deleteOne(decoded.sub, hashed);
    }

    verifyAccess(token: string) {
        try {
            return jwt.verify(token, ACCESS_SECRET!);
        } catch {
            return null;
        }
    }

    async verifyRefresh(token: string) {
        const decoded = jwt.verify(token, REFRESH_SECRET!) as any;
        const hashed = crypto.createHash("sha256").update(token).digest("hex");
        const exists = await this.tokenRepository.findOne({ userId: decoded.sub, token: hashed });

        if (!exists) throw new Error("Invalid refresh token");

        await this.tokenRepository.deleteOne(decoded.sub, hashed);

        return this.generateTokens(decoded.sub, decoded.username);
    }

    async generateTokens(userId: string, username: string){
        const payload = { sub: userId, username };
        const accessToken = jwt.sign(payload, ACCESS_SECRET!, { expiresIn: "15m" });
        const refreshToken = jwt.sign(payload, REFRESH_SECRET!, { expiresIn: "7d" });

        const hashedToken = crypto.createHash("sha256").update(refreshToken).digest("hex");
        await this.tokenRepository.create({ userId, token: hashedToken });

        return { accessToken, refreshToken };
    }
}