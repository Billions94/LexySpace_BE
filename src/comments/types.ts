import { Post } from "../blogPost/types";
import { Replies } from "../replies/types";
import { RegisteredUsers } from "../users/types";

export interface Comments {
    _id?: string;
    text: string;
    user: RegisteredUsers;
    postId: Post | string;
    replies: Replies[];
}