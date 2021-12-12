import mongoose from 'mongoose';
import { LoggedInUser } from './types';

const { Schema, model } = mongoose

const LoggedInUserSchema = new Schema<LoggedInUser>({
    name: { type: String },
    lastName: { type: String },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    bio: { type: String },
    image: { type: String }
},
    {
        timestamps: true
    }
)

export default model('User', LoggedInUserSchema)