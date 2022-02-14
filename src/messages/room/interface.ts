import { Message } from "../interfaces"
import { Types } from "mongoose"

export interface Room {
    chatHistory: Message[]
    members: Types.ObjectId[]
}