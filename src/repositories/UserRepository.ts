import User, {IUser} from "../models/User";

export class UserRepository {
    async create(user: Partial<IUser>): Promise<IUser> {
        return await User.create(user);
    }

    async findByUsername(username: string){
        return User.findOne({ username })
    }

    async delete(username: string): Promise<boolean>{
        try {
            await User.deleteOne({ username });
            return true;
        } catch {
            return false;
        }
    }
}