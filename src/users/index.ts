import express from 'express'
import userHandler from './u-handler'
import { tokenAuth } from '../auth/tokenAuth'
import passport from 'passport'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import multer from  'multer'

process.env.TS_NODE_DEV && require("dotenv").config()

const { FE_URL, CLOUD_NAME, API_KEY, API_SECRET } = process.env

const userRouter = express.Router()

cloudinary.config({ 
  cloud_name: CLOUD_NAME, 
  api_key: API_KEY, 
  api_secret: API_SECRET,
  secure: true
});

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary, // CREDENTIALS,
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
userRouter.put('/:id/profilePic', tokenAuth, multer({ storage: cloudinaryStorage}).single('image'), userHandler.addProfilePic)
userRouter.put('/me/profilePic', tokenAuth, multer({ storage: cloudinaryStorage}).single('image'), userHandler.addProfilePic)

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
userRouter.post('/me/follow', tokenAuth, userHandler.follow)
userRouter.post('/:id/follow', tokenAuth, userHandler.followUsers)
userRouter.get('/me/followers', tokenAuth, userHandler.getFollowers)

export default userRouter