import RefreshToken, {IRefreshToken} from "../models/RefreshToken";

export class TokenRepository {
    async create(refreshToken: Partial<IRefreshToken>) {
        return await RefreshToken.create(refreshToken);
    }

    async findOne(payload: Object) {
        return RefreshToken.findOne(payload);
    }

    async deleteMany(id: string) {
        try {
            await RefreshToken.deleteMany({ userId: id });
            return true;
        } catch {
            return false;
        }
    }

    async deleteOne(id: string, token: string) {
        try {
            await RefreshToken.deleteOne({ id, token });
            return true;
        } catch {
            return false;
        }
    }
}