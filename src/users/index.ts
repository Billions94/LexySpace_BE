import express from 'express';
import userHandler from './u-handler';

const userRouter = express.Router();

userRouter.route('/')
.get(userHandler.getAllUsers)
.post(userHandler.createUser)


userRouter.route('/:id')
.get(userHandler.getByID)
.put(userHandler.updateUser)
.delete(userHandler.deleteUser)


export default userRouter