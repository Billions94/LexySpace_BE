import { RegisteredUsers } from "../users/interfaces";
import { Comments } from "../comments/interfaces";


export interface Replies {
    _id?: string
    text: string
    media?: string
    user: RegisteredUsers
    commentId: Comments | string
}