import jwt from "jsonwebtoken"
import { RegisteredUsers } from "../users/types"
import UserModel from "../users/schema"
import { Document } from "mongoose"

process.env.TS_NODE_DEV && require("dotenv").config()

declare global {
    namespace Express {
        interface Request {
            user?: RegisteredUsers & Document;
        }
    }
}

const secret = process.env.JWT_SECRET!

type JWT = {
    _id: string;
}

export const tokenGenerator = async (user: RegisteredUsers & Document) => {
    const accessToken = await generateAccessToken({ _id: user._id })
    const refreshToken = await generateRefreshToken({ _id: user._id })

    user.refreshToken = refreshToken

    await user.save()

    return { accessToken, refreshToken };
};

const generateAccessToken = (payload: JWT) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "15m" }, (err, token) => {
            if (err) reject(err);
            else resolve(token!);
        });
    });
};

const generateRefreshToken = (payload: JWT) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign(payload, secret, { expiresIn: "1 week" }, (err, token) => {
            if(err) reject(err)
            else resolve(token!)
        })
    })
}

export const verifyAccessToken = (token: string) => {
    return new Promise<JWT>((resolve, reject) => {
        jwt.verify(token, secret, (err, decodedToken) => {
            if (err) reject(err);
            else resolve(decodedToken as JWT);
        });
    });
};

export const verifyRefreshToken = (token: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decodedToken) => {
            if(err) reject(err)
            else resolve(decodedToken)
        })
    })
}

export const refreshTokens = async (currentRefreshToken: string) => {

    const decodedRefreshToken: any = await verifyRefreshToken(currentRefreshToken)

    const user = await UserModel.findById(decodedRefreshToken._id)
    if(!user) throw new Error('User not found')

    if(user.refreshToken === currentRefreshToken) {
        const { accessToken, refreshToken } = await tokenGenerator(user)
        return { accessToken, refreshToken }
    } else {
        throw new Error('Token is invalid')
    }

}