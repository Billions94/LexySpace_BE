import UserModel from './schema'
import { RequestHandler } from 'express'
import { refreshTokens, tokenGenerator } from '../auth/authTools'
import createHttpError from 'http-errors'


// Register/Create new User
const createUser: RequestHandler = async (req, res) => {
   try {
       const newUser = new UserModel(req.body)
       if(newUser) {
       const {_id} = await newUser.save()
       const { accessToken } = await tokenGenerator(newUser)
        res.status(201).send({ _id, accessToken })
       } else {
        res.status(404).send({message: "User could not be created"});
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
        if(loggedInUser) {
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
  
  // Logout
//   const logout: RequestHandler = async (req, res, next) => {
//     try {
//       req.user!.refreshToken = null;
//       await req.user!.save();
//       res.send();
//     } catch (error) {
//       next(error);
//     }
//   }

// Get all Users
const getAllUsers: RequestHandler = async (req, res) => {
    try {
        const users = await UserModel.find()
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
const getByID: RequestHandler = async (req, res) => {
    try {
        const userID = req.user?._id.toString();
        const user = await UserModel.findById(userID)
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
const updateUser: RequestHandler = async (req, res) => {
    try {
        const userID = req.user?._id.toString();
        const updatedUser = await UserModel.findByIdAndUpdate(userID, req.body, { new: true })
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
const deleteUser: RequestHandler = async (req, res) => {
    try {
        const userID = req.user?._id.toString();
        const deletedUser = await UserModel.findByIdAndDelete(userID)
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
    userLogin,
    refreshToken,
    // logout,
    getAllUsers,
    getByID,
    updateUser,
    deleteUser

}

export default userHandler