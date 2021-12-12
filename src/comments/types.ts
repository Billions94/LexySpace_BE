import { Post } from "../blogPost/types";

export interface Comments {
    _id?: string;
    text: string;
    user: any;
    posts: Post[] | string
}