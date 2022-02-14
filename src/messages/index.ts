import express from "express"
import MessageModel from "./schema"
import RoomModel from "./room/schema"

const messageRouter = express.Router()

messageRouter
    .post("/:roomId", async (req, res) => {
        try {
            const newMessage = new MessageModel(req.body)
            newMessage.roomId = req.params.roomId
            await newMessage.save()
            if(newMessage) {
                const updatedRoom = await RoomModel.findOneAndUpdate(
                    {_id: req.params.roomId},
                    { $push: { chatHistory: newMessage}}
                    )
                res.status(201).send(updatedRoom)
            } else throw new Error("Message could not be created")
        } catch (error) {
            console.log(error)
        }
    })

    .post("/", async (req, res) => {
        try {
            const newMessage = new MessageModel(req.body)
            await newMessage.save()
            if(newMessage) {
                res.status(201).send(newMessage)
            } else throw new Error("Message could not be created")
        } catch (error) {
            console.log(error)
        }
    })

    .get("/:roomId", async (req, res) => {
        try {
            const messages = await MessageModel.find({
                roomId: req.params.roomId
            })
            if(messages) {
                res.send(messages)
            } else throw new Error("Something went wrong, could not get messages")
        } catch (error) {
            console.log(error)
        }
    })


export default messageRouter