import mongoose from 'mongoose';
import { Post } from './interfaces';

const { Schema, model } = mongoose

const PostSchema = new Schema<Post>(
    {
        cover: { type: String },
        text: { type: String },
        video: { type: String },
        sharedPost: { type: Schema.Types.ObjectId, ref:'Post'},
        user: { type: Schema.Types.ObjectId, ref:'User' },
        comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
        likes: [{ type: Schema.Types.ObjectId, ref:'User' }]
    },
    {
        timestamps: true
    }
)

export default model('Post', PostSchema)