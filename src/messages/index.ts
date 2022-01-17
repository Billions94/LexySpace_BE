import express from "express"
import RoomModel from "./schema"

const messageRouter = express.Router()

messageRouter
    .get("/:room", async (req, res) => {
        const room = await RoomModel.findOne({ name: req.params.room })

        if (!room) {
            return res.status(404).send("Room not found")
        } else {
            return res.send(room)
        }
    })


export default messageRouter