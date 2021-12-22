import express from 'express'
import userHandler from './u-handler'
import { tokenAuth } from '../auth/tokenAuth'
import passport from 'passport'

process.env.TS_NODE_DEV && require("dotenv").config()

const { FE_URL } = process.env

const userRouter = express.Router();


// AUTHENTICATED WITH JWT
userRouter.post('/register', userHandler.createUser)
userRouter.post('/login', userHandler.userLogin)
// userRouter.post('/logout', userHandler.logout)

// GOOGLE LOGIN
userRouter.get('/googleLogin', passport.authenticate('google', { scope: ["profile", "email"] }))
userRouter.get('/googleRedirect', passport.authenticate('google'), async (req, res, next) => {
    try {
        console.log('i am the request', req.user)
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


export default userRouter