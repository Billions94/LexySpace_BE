import mongoose from 'mongoose'

const { Schema, model } = mongoose

const MessageSchema = new Schema({
    text: { type: String },
    image: { type: String },
    sender: { type: String },
    timestamp: { type: Date, default: Date.now() }
})

const RoomSchema = new Schema({
    name: { type: String, required: true },
    chatHistory: { type: [MessageSchema], required: true }
})

export default model('Room', RoomSchema)