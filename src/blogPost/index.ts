import express from 'express'
import postHandler from './p-handler'
import commentsHandler from '../comments/c-handler'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import multer from  'multer'

process.env.TS_NODE_DEV && require("dotenv").config()

const { CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_SECRET } = process.env

const postRouter = express.Router()


cloudinary.config({ 
    cloud_name: CLOUD_NAME, 
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_SECRET
});
interface params {
    folder: string
}

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS,
    params: <params>{
      folder: "capstone",
    },
  });

// Post image
postRouter.put('/:id/upload', multer({ storage: cloudinaryStorage}).single('cover'), postHandler.postPicture)  
 
postRouter.post('/:userName', postHandler.createPost)
postRouter.get('/', postHandler.getAllPosts)

postRouter.route('/:id')
.get(postHandler.getPostById)
.put(postHandler.updatePost)
.delete(postHandler.deletePost)

/********************************************** Like Crud Section **********************************/
postRouter.put('/:id/likes', postHandler.postLike)

/********************************** Comments Crud Section  ************************************/
postRouter.post('/:id/comments', commentsHandler.createComment)
postRouter.get('/:id/comments', commentsHandler.getAllComments)

postRouter.route('/:id/comments/:commentId')
.put(commentsHandler.updateComment)
.get(commentsHandler.getCommentById)
.delete(commentsHandler.deleteComment)



export default postRouter