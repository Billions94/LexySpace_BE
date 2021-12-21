import express from 'express'
import userHandler from './u-handler'
import { tokenAuth } from '../auth/tokenAuth';

const userRouter = express.Router();



userRouter.post('/register', userHandler.createUser)
userRouter.post('/login', userHandler.userLogin)


userRouter.route('/')
.get(userHandler.getAllUsers)


userRouter.route('/:id')
.get(userHandler.getByID)
.put(userHandler.updateUser)
.delete(userHandler.deleteUser)


export default userRouter