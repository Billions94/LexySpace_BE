import mongoose from 'mongoose'
import { MessageSchema } from '../schema'
import { Room } from './interface'

const { Schema, model } = mongoose

const RoomSchema = new Schema<Room>({
    // chatHistory: { type: [MessageSchema], required: true },
    members: [{ type: Schema.Types.ObjectId, ref: 'User' }]
},
{
    timestamps: true
})

export default model<Room>('Room', RoomSchema)