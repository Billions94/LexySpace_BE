import express from 'express'
import replyHandler from './r-handler'

const replyRouter = express.Router()

replyRouter.route('/')
.get(replyHandler.getAll)

replyRouter.route('/:id')
.post(replyHandler.postReply)

replyRouter.route('/:id/:replyId')
.put(replyHandler.updateReply)

export default replyRouter