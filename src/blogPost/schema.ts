import mongoose from 'mongoose';
import { Post } from './types';

const { Schema, model } = mongoose

const PostSchema = new Schema<Post>(
    {
        cover: { type: String },
        title: { type: String },
        text: { type: String },
        user: { type: Schema.Types.ObjectId, ref:'User' },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        likes: [{ type: Schema.Types.ObjectId, ref:'User' }]
    },
    {
        timestamps: true
    }
)

export default model('Post', PostSchema)