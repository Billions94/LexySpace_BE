import express from 'express'
import commentsHandler from './c-handler'


const commentsRouter = express.Router()

commentsRouter.post('/:id', commentsHandler.createComment)
commentsRouter.get('/', commentsHandler.getAllComments)

commentsRouter.route('/:commentId')
.put(commentsHandler.updateComment)
.get(commentsHandler.getCommentById)
.delete(commentsHandler.deleteComment)

export default commentsRouter