import express from 'express'
import replyHandler from './r-handler'

const replyRouter = express.Router()

replyRouter.route('/')
.get(replyHandler.getAll)

replyRouter.route('/:id')
.post(replyHandler.postReply)

export default replyRouter