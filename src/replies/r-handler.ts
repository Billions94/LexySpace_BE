import { Request, RequestHandler, Response } from 'express'
import CommentModel from '../comments/schema'
import ReplyModel from './schema'
const q2m = require('query-to-mongo')

// Post Reply in a Comment
const postReply = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        
        const reply =  new ReplyModel(req.body)
        reply.commentId = id
        await reply.save()

        console.log(reply)
        if(reply){
            const updatedPost = await CommentModel.findOneAndUpdate(
                {_id: id},
                { $push: { replies: reply._id}},
                { new: true }
            )
            res.status(201).send(updatedPost)
        } else {
            res.status(404).send({message: "Reply could not be created"});
        }
    } catch (error) {
       console.error(error) 
    }
}

// Post Video/Photos as a comment
const addMedia: RequestHandler = async (req, res) => {
    try {
        const replyId = req.params.id
        const mediaPath = req.file!.path
        const newMedia = await ReplyModel.findByIdAndUpdate(replyId, { $set: { media: mediaPath }}, { new: true } )
        if(newMedia) {
            res.send(newMedia)
        } else {
            res.status(404).send(`Comment with id ${replyId} not found`) 
        }
    } catch (error) {
        console.error(error)
    }
}

// Get all replies
const getAll: RequestHandler = async (req, res) => {
    try {
        const replies = await ReplyModel.find()
        .populate({ path: 'user' })
        if(replies) {
            res.send(replies)
        } else {
            res.status(404).send({message: "Replies not found"});
        }
    } catch (error) {
        console.error(error)
    }
}


// Get reply by ID
const getById: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const reply = await ReplyModel.findById(id)
        .populate({ path: 'user' })
        if(reply) {
            res.send(reply)
        } else {
            res.status(404).send({message: `Reply with id ${id} not found`});
        }
    } catch (error) {
        console.error(error)
    }
}


// Update or Edit reply
const updateReply: RequestHandler = async (req, res) => {
    try {
        let comment = await CommentModel.findOne({_id: req.params.id}) 
        console.log(comment)
         const replyId = req.params.replyId
         if (comment !== null){
            const updatedReply = await ReplyModel.findByIdAndUpdate(replyId, req.body, {new: true})
            console.log(updatedReply)
                if(updatedReply !== null){
                  res.status(203).send(updatedReply)
         } else {
            res.status(404).send({message: `Reply with id ${replyId} not found`});
         }} else {
            res.status(404).send(`Comment with id ${req.params.id} not found!`)
         }
     } catch (error) {
        console.error(error)
     }
}

// Delete reply
const deleteReply: RequestHandler = async (req, res) => {
    try {
        const id = req.params.id
        const deleted = await ReplyModel.findByIdAndDelete(id)
        if(deleted) {
            res.send('reply deleted')
        } else {
            res.status(404).send({message: `Reply with id ${id} not found`});
        }
    } catch (error) {
        console.error(error)
    }
}




const replyHandler = {
    postReply,
    addMedia,
    getAll,
    getById,
    updateReply,
    deleteReply
}

export default replyHandler