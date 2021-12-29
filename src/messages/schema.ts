import mongoose from 'mongoose'

const { Schema, model } = mongoose

const MessageSchema = new Schema({
    text: { type: String },
    sender: { type: String },
    timestamp: { type: Date, default: Date.now() }
})

export default model('Message', MessageSchema)