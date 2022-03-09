import mongoose from 'mongoose';
import { Replies } from './interfaces';



const { Schema, model } = mongoose

const ReplySchema = new Schema<Replies>(
    {
        text: { type: String, required: true },
        media: { type: String },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        commentId: { type: Schema.Types.ObjectId, ref: 'Comment' },
    },
    {
        timestamps: true
    })

export default model('Reply', ReplySchema)