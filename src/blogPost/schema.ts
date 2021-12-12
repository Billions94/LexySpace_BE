import mongoose from 'mongoose';
import { Post } from './types';

const { Schema, model } = mongoose

const PostSchema = new Schema<Post>(
    {
        image: { type: String },
        text: { type: String, required: true },
        user: { type: Schema.Types.ObjectId, ref:'User' },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        // likes: [{ type: Schema.Types.ObjectId, ref:'User' }]
    },
    {
        timestamps: true
    }
)

export default model('Post', PostSchema)