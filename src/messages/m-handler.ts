import { RequestHandler } from "express"
import UserModel from "../users/schema"
import RoomModel from "./schema"

//1. Make an endpoint so you can find users without knowing their ids
// 2. On the client get the ID of the receiver with the endpoint
// 3. Send the message on socket to the BE with sender and receiver ID
// 4. Look for their chatroom in the DB if there is one update it, if not make a new chatroom for them
// 5. If the receiver is online on socket, forward the message/tell the receiver to fetch the messages because there is a new one, on socket.
// 6. Inside the message if the sender's ID = the client's id display the message on the right, if not display it on the left


// Send new message to DB
const createDm: RequestHandler = async (req, res, next) => {
    try {
        const senderId = req.params.id
        const newDm = await RoomModel.findById(senderId)
        if(newDm) {
            res.status(201).send(newDm)
        } else throw new Error("Couldn't find room")
    } catch (error) {
        next(error)
    }
}

const messageHandler = {
    createDm,
}

export default messageHandler
