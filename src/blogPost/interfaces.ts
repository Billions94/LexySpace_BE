import { RegisteredUsers } from "../users/interfaces"
import { Comments } from "../comments/interfaces"
import { Types } from "mongoose"

export interface Post {
    cover: string;
    text: string;
    user: RegisteredUsers;
    comments: Comments[];
    likes: Types.ObjectId[]
}

