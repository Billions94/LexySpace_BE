import PostModel from './schema'
import UserModel from '../users/schema'
import mongoose from 'mongoose'
import { Request, Response, NextFunction } from 'express'
const q2m = require('query-to-mongo')

//Create new Post
const createPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userName = req.params.userName
        const user = await UserModel.findOne({ userName: userName })
        console.log('=============================>', user?._id)
        const newPost = new PostModel(req.body)
        newPost.user = user?._id
        await newPost.save()
        if (newPost){
            res.status(201).send(newPost)
        } else {
            res.status(404).send({message: "Post could not be created"});
        }
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// Post new Picture or Change existing one
const postPicture = async (req: any, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const imgPath = req.file.path
        const user = await PostModel.findByIdAndUpdate(id, { $set: { image: imgPath }})
        res.status(203).send(user)
    } catch (error) {
        console.log(error)
        next(error);
    }
}

// Post Likes
const postLike = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id;
        console.log('==================>',id)
        let post = await PostModel.findById(id);
        if (post) {
          const liked = await PostModel.findOne({
            _id: id,
            likes: new mongoose.Types.ObjectId(req.body.userId),
          });
          console.log('i am liked', liked)
    
          if (!liked) {
           post =  await PostModel.findByIdAndUpdate(id, {
              $push: { likes: req.body.userId }
            }, {new: true});
          } else {
           post  =  await PostModel.findByIdAndUpdate(id, {
              $pull: { likes: req.body.userId },
            },{new:true});
          }
        } else {
            res.status(404).send({message: `User with id ${id} not found`});
        }
          
        res.status(201).send(post);
      } catch (error) {
        next(error);
      }
}

// Get all Posts
const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const mongoQuery = q2m(req.query)
        const total = await PostModel.countDocuments(mongoQuery.criteria)
        const posts = await PostModel.find(mongoQuery.criteria)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
        .populate({ path: 'user'})
        .populate({ path: 'comments'})


        res.send({
            links: mongoQuery.links('/posts', total),
            pageTotal: Math.ceil(total / mongoQuery.options.limit),
            total,
            posts
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// Get specify Post by ID
const getPostById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const post = await PostModel.findById(id)
        .populate({ path: 'user'})
        .populate({ path: 'comments'})
        if(post){
            res.send(post)
        } else {
            res.status(404).send({message: `User with id ${id} not found`});
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// Update or Modify Post by ID
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const post = await PostModel.findByIdAndUpdate(id, req.body, {new: true})
        if (post){
            res.status(203).send(post)
        } else {
            res.status(404).send({message: `User with id ${id} not found`});
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

// Delete Post by ID
const deletePost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id
        const deletedPost = await PostModel.findByIdAndDelete(id)
        if (deletedPost){
            res.send('blogPost deleted')
        } else {
            res.status(404).send({message: `User with id ${id} not found`});
        }
    } catch (error) {
        console.error(error)
        next(error)
    }
}

const postHandler = {
    createPost,
    postPicture,
    postLike,
    getAllPosts,
    getPostById,
    updatePost,
    deletePost
}

export default postHandler