import PostModel from './schema'
import UserModel from '../users/schema'
import mongoose from 'mongoose'
import { RequestHandler } from 'express'
import { generatePostPDF } from './pdf/pdf'
const q2m = require('query-to-mongo')

//Create new Post
const createPost: RequestHandler = async (req, res, next) => {
    try {
        const userName = req.params.userName
        const user = await UserModel.findOne({ userName: userName })
       
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
const postPicture: RequestHandler = async (req, res, next) => {
    try {
        const postId = req.params.id
        const imgPath = req.file!.path
        const post = await PostModel.findByIdAndUpdate(postId, { $set: { media: imgPath }}, { new: true })
        if(post) {
            res.status(203).send(post)
        } else {
            res.status(404).send({message: "Media could not be uploaded"});
        }  
    } catch (error) {
        console.log(error)
        next(error);
    }
}

// Post new Video or Change existing one
const postVideo: RequestHandler = async (req, res, next) => {
    try {
        const postId = req.params.id
        const videoPath = req.file!.path
        const video = await PostModel.findByIdAndUpdate(postId, { $set: { media: videoPath }}, { new: true })
        if(video) {
            res.status(203).send(video)
        } else {
            res.status(404).send({message: "Media could not be uploaded"});
        }  
    } catch (error) {
        console.log(error)
        next(error);
    }
}

// Post Likes
const postLike: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id;
        
        let post = await PostModel.findById(id);
        if (post) {
          const liked = await PostModel.findOne({
            _id: id,
            likes: new mongoose.Types.ObjectId(req.body.userId),
          })

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
const getAllPosts: RequestHandler = async (req, res, next) => {
    try {
        const mongoQuery = q2m(req.query)
        const total = await PostModel.countDocuments(mongoQuery.criteria)
        const posts = await PostModel.find(mongoQuery.criteria)
        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
        .populate({ path: 'user'})
        .populate({ path: 'sharedPost'})
        .populate({ path: 'comments'})
        .populate({ path: 'likes'})


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
const getPostById: RequestHandler = async (req, res, next) => {
    try {
        const id = req.params.id
        const post = await PostModel.findById(id)
        .populate({ path: 'user'})
        .populate({ path: 'comments'})
        .populate({ path: 'sharedPost'})
        .populate({ path: 'likes'})
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

// Generate Post PDF by ID
const getPDF: RequestHandler = async (req, res, next) => {
    try {
        const postId = req.params.id
        const pdf = await PostModel.findById(postId)
        if(pdf) {
            const pdfStream = await generatePostPDF(pdf);
            res.setHeader("Content-Type", "application/pdf");
            pdfStream!.pipe(res);
            pdfStream!.end();
        } else throw new Error('Could not get PDF')
    } catch (error) {
        console.log(error)
        next(error)
    }
}

// Update or Modify Post by ID
const updatePost: RequestHandler = async (req, res, next) => {
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
const deletePost: RequestHandler = async (req, res, next) => {
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
    postVideo,
    postLike,
    getAllPosts,
    getPDF,
    getPostById,
    updatePost,
    deletePost
}

export default postHandler