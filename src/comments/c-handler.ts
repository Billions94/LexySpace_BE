
import CommentModel from './schema'
import PostModel from '../blogPost/schema'
import { RequestHandler } from 'express'
const q2m = require('query-to-mongo')

// Create new Comment
const createComment: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        
        const comment =  new CommentModel(req.body)
        comment.postId = id
        await comment.save()

        console.log(comment)
        if(comment){
            const updatedPost = await PostModel.findOneAndUpdate(
                {_id: id},
                { $push: { comments: comment._id}},
                { new: true }
            )
            res.status(201).send(updatedPost)
        } else {
            res.status(404).send(`Comment with id ${id} not found`) 
        }
    } catch (error) {
       console.error(error) 
    }
}

// Get all Comments
const getAllComments: RequestHandler = async (req, res) => {
    try {
        const mongoQuery = q2m(req.query)
        console.log(mongoQuery)
        const total = await CommentModel.countDocuments(mongoQuery.criteria)
        const comments = await CommentModel.find()

        .limit(mongoQuery.options.limit)
        .skip(mongoQuery.options.skip)
        .sort(mongoQuery.options.sort)
        .populate({ path: 'user' })
        if(comments){
            res.send({
                links: mongoQuery.links('/experience', total),
                pageTotal: Math.ceil(total / mongoQuery.options.limit),
                total,
                comments
            })
        } else {
            res.status(404).send(`Comment with id ${req.params.id} not found`)
        }
    } catch (error) {
        console.error(error)
    }
}

// Update the Comment
const updateComment: RequestHandler = async (req, res) => {
 try {
    //  const id = req.params.id
    let post = await PostModel.findOne({_id: req.params.id}) 
    console.log("here post")
    console.log(post)
     const commentId = req.params.commentId
     if (post !== null){
        const updatedComment = await CommentModel.findByIdAndUpdate(commentId, req.body, {new: true})
        console.log(updatedComment)
            if(updatedComment !== null){
              res.status(203).send(updatedComment)
     } else {
        res.status(404).send(`Comment with id ${commentId} not found`)
     }} else {
        res.status(404).send(`Comment with id ${req.params.id} not found`)
     }
 } catch (error) {
    console.error(error) 
 }
}

// GET comment by ID
const getCommentById: RequestHandler = async(req, res) => {
    try {
        const id = req.params.commentId
        const comment = await CommentModel.findById(id)
        .populate({ path: 'replies'})
        if (comment) {
            res.send(comment)
        } else {
            res.status(404).send(`Comment with id ${id} not found`)
        }
    } catch (error) {
        console.error(error) 
    }
}


// DELETE comment
const deleteComment: RequestHandler = async (req, res) => {
    try {
        const comment = await CommentModel.findByIdAndDelete(req.params.commentId)
        const post = await PostModel.findOneAndUpdate({_id: req.params.id},
            {$pull: {comments: comment?._id}})
        if (comment) {
            res.send('comment deleted')
        } else{
            res.status(404).send(`Comment with id ${req.params.commentId} not found`)
        }
    } catch (error) {
        console.error(error) 
    }
}

const commentsHandler = {
    createComment,
    getAllComments,
    updateComment,
    getCommentById,
    deleteComment
}

export default commentsHandler