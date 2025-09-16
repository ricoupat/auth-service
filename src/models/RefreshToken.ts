import {Document, model, Schema} from "mongoose";

export interface IRefreshToken extends Document {
    userId: string;
    token: string;
    createdAt: Date;
}

const RefreshTokenSchema = new Schema<IRefreshToken>({
    userId: { type: String, required: true },
    token: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, expires: "7d" }
});

export default model<IRefreshToken>("RefreshToken", RefreshTokenSchema)