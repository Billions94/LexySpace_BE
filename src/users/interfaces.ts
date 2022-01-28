import { Types } from "mongoose";

export interface RegisteredUsers {
    _id?: string;
    firstName?: string;
    lastName?: string;
    userName: string;
    email: string;
    password: string;
    followers: Types.ObjectId[]
    tokens: {
        accessToken: string | undefined;
        refreshToken: string | undefined;
    }
    refreshToken: string | null;
    bio?: string;
    location?: string;
    image?: string;
    cover: string
    isVerified: boolean  
    googleId:string
}