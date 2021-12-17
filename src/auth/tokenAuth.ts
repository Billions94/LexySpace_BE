import createHttpError from "http-errors"
import UserModel from "../users/schema"
import { LoggedInUser } from "../users/types"
import { RequestHandler } from "express"
import { verifyJWT } from "./authTools"


declare global {
    namespace Express {
        interface Request {
            user?: LoggedInUser;
        }
    }
}

export const tokenAuth: RequestHandler = async (req, res, next) => {
    if(!req.headers.authorization) {
        next(createHttpError(404, "Please provide token in Authorization header!"))
    } else {
        try {
            const token = req.headers.authorization.replace("Bearer ", "")

            const decodedToken  = await verifyJWT(token)

            const user = await UserModel.findById(decodedToken._id)
            if(user) {
                req.user = user
                next()
            } else {
                next(createHttpError(404, "User not found"))
            }
        } catch (error) {
            next(createHttpError(401, "Token not valid!"))
        }
    }
}