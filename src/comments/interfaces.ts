import { Post } from "../blogPost/interfaces";
import { Replies } from "../replies/interfaces";
import { RegisteredUsers } from "../users/interfaces";

export interface Comments {
    _id?: string;
    text: string;
    user: RegisteredUsers;
    postId: Post | string;
    replies: Replies[];
}