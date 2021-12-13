import { Post } from "../blogPost/types";
import { Replies } from "../replies/types";
import { LoggedInUser } from "../users/types";

export interface Comments {
    _id?: string;
    text: string;
    user: LoggedInUser;
    posts: Post[] | string;
    replies: Replies[];
}