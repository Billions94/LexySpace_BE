export interface RegisteredUsers {
    _id?: string;
    name?: string;
    lastName?: string;
    userName: string;
    email: string;
    password: string;
    tokens: {
        accessToken: string;
        refreshToken: string;
    }
    refreshToken: string | null;
    bio?: string;
    image?: string;
    googleId:string
}