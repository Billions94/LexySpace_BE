import { RegisteredUsers } from "../users/interfaces"
import { Comments } from "../comments/types"
import { Types } from "mongoose"

export interface Post {
    cover: string;
    title: string;
    text: string;
    user: RegisteredUsers;
    comments: Comments[];
    likes: Types.ObjectId[]
}

