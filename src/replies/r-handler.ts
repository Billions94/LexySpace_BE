import { Request, Response } from 'express'
import CommentModel from '../comments/schema'
import ReplyModel from './schema'

// Post Reply in a Comment
const postReply = async (req: Request, res: Response) => {
    try {
        const id = req.params.id
        
        const reply =  new ReplyModel(req.body)
        reply.comments = id
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

// Get all replies
const getAll = async (req: Request, res: Response) => {
    try {
        const replies = await ReplyModel.find()
        if(replies) {
            res.send(replies)
        } else {
            res.status(404).send({message: "Replies not found"});
        }
    } catch (error) {
        console.error(error)
    }
}




const replyHandler = {
    postReply,
    getAll
}

export default replyHandler