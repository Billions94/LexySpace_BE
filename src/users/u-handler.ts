import LoggedInUserSchema from './schema'
import { Request, Response } from 'express'


// Register/Create new User
const createUser = async (req: Request, res: Response) => {
   try {
       const user = new LoggedInUserSchema(req.body)
       await user.save()
       if(user) {
        res.send(user)
       } else {
        res.status(404).send({message: "User could not be created"});
       }
   } catch (error) {
    res.status(400).send(error);  
   }
}

// Get all Users
const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await LoggedInUserSchema.find()
        if(users) {
            res.send(users)
        } else {
            res.status(404).send({message: "Users not found"});
        }
    } catch (error) {
        res.status(400).send(error);  
    }
}

// Get user by ID
const getByID = async (req: Request, res: Response) => {
    try {
        const userID = req.params.id
        const user = await LoggedInUserSchema.findById(userID)
        if(user) {
            res.send(user)
        } else {
            res.status(404).send({message: `User with id ${userID} not found`});
        }
    } catch (error) {
        res.status(400).send(error);  
    }
}

// Update User by ID
const updateUser = async (req: Request, res: Response) => {
    try {
        const userID = req.params.id
        const updatedUser = await LoggedInUserSchema.findByIdAndUpdate(userID, req.body, { new: true })
        if(updatedUser) {
            res.status(203).send(updatedUser)
        } else {
            res.status(404).send({message: `User with id ${userID} not found`});
        }
    } catch (error) {
        res.status(400).send(error);  
    }
}

// Delete User by ID
const deleteUser = async (req: Request, res: Response) => {
    try {
        const userID = req.params.id
        const deletedUser = await LoggedInUserSchema.findByIdAndDelete(userID)
        if(deletedUser) {
            res.send('user deleted')
        } else {
            res.status(404).send({message: `User with id ${userID} not found`});
        }
    } catch (error) {
        res.status(400).send(error);  
    }
}

const userHandler = {
    createUser,
    getAllUsers,
    getByID,
    updateUser,
    deleteUser

}

export default userHandler