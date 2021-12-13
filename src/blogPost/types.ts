import { LoggedInUser } from "../users/types";
import { Comments } from "../comments/types";
import { ObjectId } from "mongoose";

export interface Post {
    image: string;
    text: string;
    user: LoggedInUser;
    comments: Comments[];
    
}