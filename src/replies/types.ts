import { LoggedInUser } from "../users/types";
import { Comments } from "../comments/types";


export interface Replies {
    _id?: string;
    text: string;
    user: LoggedInUser;
    comments: Comments[] | string
}