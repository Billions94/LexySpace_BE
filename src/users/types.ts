import { Types } from "mongoose";

export interface RegisteredUsers {
    _id?: string;
    name?: string;
    lastName?: string;
    userName: string;
    email: string;
    password: string;
    followers: Types.ObjectId[]
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
    refreshToken: string | null;
    bio?: string;
    image?: string;
    googleId:string
}