import mongoose from 'mongoose';
import { Comments } from './types';


const { Schema, model } = mongoose

const CommentSchema = new Schema<Comments>({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' }
})

export default model('Comment', CommentSchema)