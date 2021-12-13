import mongoose from 'mongoose';
import { Replies } from './types';



const { Schema, model } = mongoose

const ReplySchema = new Schema<Replies>({
    text: { type: String, required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
})

export default model('Reply', ReplySchema)