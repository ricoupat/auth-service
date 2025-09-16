import {Document, model, Schema} from "mongoose";

export interface IUser extends Document {
    _id: string;
    username: string;
    email: string;
    password: string;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

export default model<IUser>("User", UserSchema);