import express from 'express'
import userHandler from './u-handler'
import { tokenAuth } from '../auth/tokenAuth'
import passport from 'passport'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import multer from  'multer'

process.env.TS_NODE_DEV && require("dotenv").config()

const { FE_URL } = process.env

const userRouter = express.Router()

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS,
    params: <Options['params']>{
      folder: "capstone",
    },
  });


// AUTHENTICATED WITH JWT
userRouter.post('/register', userHandler.createUser)
userRouter.post('/login', userHandler.userLogin)
userRouter.post('/refreshToken', userHandler.refreshToken)
// userRouter.post('/logout', userHandler.logout)

// ADD PHOTO TO PROFILE
userRouter.put('/me/profilePic', multer({ storage: cloudinaryStorage}).single('image'), userHandler.addProfilePic)

// GOOGLE LOGIN
userRouter.get('/googleLogin', passport.authenticate('google', { scope: ["profile", "email"] }))
userRouter.get('/googleRedirect', passport.authenticate('google'), async (req, res, next) => {
    try {
        res.redirect(`${FE_URL}?accessToken=${req.user?.tokens?.accessToken}&refreshToken=${req.user?.tokens?.refreshToken}`)
    } catch (error) {
        next(error)
    }
})
userRouter.route('/')
.get(tokenAuth, userHandler.getAllUsers)

userRouter.route('/me')
.get(tokenAuth, userHandler.getByID)
.put(tokenAuth, userHandler.updateUser)
.delete(tokenAuth, userHandler.deleteUser)

userRouter.route('/:id')
.get(tokenAuth, userHandler.getByID)
.put(tokenAuth, userHandler.updateUser)
.delete(tokenAuth, userHandler.deleteUser)

//********************************************Followers Section*************************************************/
userRouter.post('/:id/follow', tokenAuth, userHandler.follow)

export default userRouter