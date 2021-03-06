import mongoose from 'mongoose';
import { Comments } from './interfaces';


const { Schema, model } = mongoose

const CommentSchema = new Schema<Comments>({
    text: { type: String, required: true },
    media: { type: String },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    postId: { type: Schema.Types.ObjectId, ref: 'Post' },
    replies: [{ type: Schema.Types.ObjectId, ref: 'Reply' }]
},
    {
        timestamps: true
    }
)

export default model('Comment', CommentSchema)