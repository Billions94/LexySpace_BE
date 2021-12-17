import jwt from "jsonwebtoken";
import { LoggedInUser } from "../users/types";
import { Document } from "mongoose";


const secret = process.env.JWT_SECRET!

type JWT = {
    _id: string;
}

export const tokenGenerator = async (user: LoggedInUser | Document) => {
    const accessToken = await generateJWTToken({ _id: user._id });

    return { accessToken };
};

const generateJWTToken = (payload: JWT) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "15m" }, (err, token) => {
            if (err) reject(err);
            else resolve(token!);
        });
    });
};

export const verifyJWT = (token: string) => {
    return new Promise<JWT>((resolve, reject) => {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) reject(err);
            else resolve(decodedToken as JWT);
        });
    });
};