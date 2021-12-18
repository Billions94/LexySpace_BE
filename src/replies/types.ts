import { RegisteredUsers } from "../users/types";
import { Comments } from "../comments/types";


export interface Replies {
    _id?: string;
    text: string;
    user: RegisteredUsers;
    comments: Comments[] | string
}