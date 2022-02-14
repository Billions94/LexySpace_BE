import express from "express"
import RoomModel from "./schema"
import mongoose from "mongoose"

const roomRouter = express.Router()

roomRouter
    .get("/", async (req, res) => {
        try {
            const messages = await RoomModel.find()
            if (messages) {
                res.send(messages)
            } else throw new Error("Couldn't get messages from the server")
        } catch (error) {
            console.log(error)
        }
    })

    .post("/", async (req, res) => {
        try {
            const newRoom = new RoomModel({
                members: [req.body.senderId, req.body.receiverId]
            })
            await newRoom.save()
            if (newRoom) {
                res.status(201).send(newRoom)
            } else throw new Error("Could not create room")
        } catch (error) {
            console.log(error)
        }
    })

    .get("/:userId", async (req, res) => {
        try {
            const room = await RoomModel.find({
                members: { $in : [ new mongoose.Types.ObjectId(req.params.userId)]},
            })
            .populate({ path: 'members', select: '_id userName image'})
            // .populate({ path: 'chatHistory'})
            if (!room) {
                return res.status(404).send("Room not found")
            } else {
                return res.send(room)
            }
        } catch (error) {
            console.log(error)
        }
    })



export default roomRouter