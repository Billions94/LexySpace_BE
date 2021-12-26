import UserModel from './schema'
import { RequestHandler } from 'express'
import { refreshTokens, tokenGenerator } from '../auth/authTools'
import createHttpError from 'http-errors'
import mongoose from 'mongoose'


// Register/Create new User
const createUser: RequestHandler = async (req, res) => {
    try {
        const newUser = new UserModel(req.body)
        if (newUser) {
            const { _id } = await newUser.save()
            
            res.status(201).send({ _id })
        } else {
            res.status(404).send({ message: "User could not be created" });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

// User Login
const userLogin: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const loggedInUser = await UserModel.verifyCredentials(email, password)
        if (loggedInUser) {
            const { accessToken, refreshToken } = await tokenGenerator(loggedInUser)
            res.send({ accessToken, refreshToken })
        } else {
            next(createHttpError(401, "Credentials not ok!"));
        }
    } catch (error) {
        next(error)
    }
}

// Refresh Token
const refreshToken: RequestHandler = async (req, res, next) => {
    try {
        const { currentRefreshToken } = req.body;

        if (!currentRefreshToken) {
            res.status(401).send({ message: "No refresh token provided!" });
        } else {
            const { accessToken, refreshToken } = await refreshTokens(
                currentRefreshToken
            );
            res.send({ accessToken, refreshToken });
        }
    } catch (error) {
        next(error);
    }
}

// Add Profile Picture
const addProfilePic: RequestHandler = async (req, res, next) => {
    try {
        const userId = req.params.id
        const imgPath = req.file!.path
        console.log('----------------> i am the path', imgPath)
        const user = await UserModel.findByIdAndUpdate(userId, { $set: {image: imgPath}}, {new: true})
        if(user) {
            res.status(203).send(user)
        } else {
            next(createHttpError(404, `User with id ${userId} not found`))
        }
    } catch (error) {
        next(error)
    }
}


// Follow Request
const follow: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log('==================>', id)
        let followRequest = await UserModel.findById(id);
        if (followRequest) {
            const follow = await UserModel.findOne({
                _id: id,
                followers: new mongoose.Types.ObjectId(req.body.followerId),
            });
            console.log('now following', follow)

            const followerId = req.body.followerId
            if (!follow) {
                followRequest = await UserModel.findByIdAndUpdate(id, {
                    $push: { followers: followerId }
                }, { new: true })
            } else {
                followRequest = await UserModel.findByIdAndUpdate(id, {
                    $pull: { followers: followerId },
                }, { new: true })
            }
            res.status(201).send(followRequest)
        } else {
            next(createHttpError(404, `User with id ${id} not found`))
        }
    } catch (error) {
        next(error);
    }
}


// Get all Users
const getAllUsers: RequestHandler = async (req, res) => {
    try {
        const users = await UserModel.find()
        if (users) {
            res.send(users)
        } else {
            res.status(404).send({ message: "Users not found" });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

// Get user by ID
const getByID: RequestHandler = async (req, res) => {
    try {
        const userID = req.user?._id.toString();
        const user = await UserModel.findById(userID)
        if (user) {
            res.send(user)
        } else {
            res.status(404).send({ message: `User with id ${userID} not found` });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

// Update User by ID
const updateUser: RequestHandler = async (req, res) => {
    try {
        const userID = req.user?._id.toString();
        const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body, { new: true })
        if (updatedUser) {
            res.status(203).send(updatedUser)
        } else {
            res.status(404).send({ message: `User with id ${userID} not found` });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}

// Delete User by ID
const deleteUser: RequestHandler = async (req, res) => {
    try {
        const userID = req.user?._id.toString();
        const deletedUser = await UserModel.findByIdAndDelete(userID)
        if (deletedUser) {
            res.send('user deleted')
        } else {
            res.status(404).send({ message: `User with id ${userID} not found` });
        }
    } catch (error) {
        res.status(400).send(error);
    }
}



const userHandler = {
    createUser,
    userLogin,
    refreshToken,
    addProfilePic,
    follow,
    getAllUsers,
    getByID,
    updateUser,
    deleteUser
}

export default userHandler