import { LoggedInUser } from "../users/types";
import { Comments } from "../comments/types";

export interface Post {
    image: string;
    text: string;
    user: LoggedInUser;
    comments: Comments[];
    
}