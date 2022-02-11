import express from "express"
import RoomModel from "./schema"

const messageRouter = express.Router()

messageRouter
    .get("/", async (req, res) => {
        try {
            const messages = await RoomModel.find()
            if(messages) {
                res.send(messages)
            } else throw new Error("Couldn't get messages from the server")
        } catch (error) {
            console.log(error)
        }
    })
    .get("/:id", async (req, res) => {
        const roomId = req.params.id
        const room = await RoomModel.findById(roomId)

        if (!room) {
            return res.status(404).send("Room not found")
        } else {
            return res.send(room)
        } //
    })


export default messageRouter