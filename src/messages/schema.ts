import mongoose from 'mongoose'
import { Message } from './interfaces'

const { Schema, model } = mongoose

export const MessageSchema = new Schema<Message>({
    roomId: { type: String },
    text: { type: String, required: true },
    image: { type: String },
    media: { type: String },
    sender: { type: String, required: true  },  
},
{
    timestamps: true
})

export default model<Message>('Message', MessageSchema)


