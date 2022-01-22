import { createServer } from "http"
import { Server } from "socket.io"
import RoomModel from "./messages/schema"
import { OnlineUser } from "./messages/interfaces"
import { app } from "./app"

process.env.TS_NODE_DEV && require("dotenv").config()

const httpServer = createServer(app)

const io = new Server(httpServer, { cors: { origin: '*'}})
// [{socketId, dbId}]
// FE => dbId
// message => db to store
// target socketId from dbId
// if (target socketId is online)emit incoming message to target socketId
export let onlineUsers: OnlineUser[] =[]


io.on("connection", (socket) => {


    socket.on("setUsername", ({ userName, image, room }) => {
        console.log({userName, image, room})
        onlineUsers.push({ userName: userName, image: image, socketId: socket.id, room: room })

        socket.join(room)
        socket.emit("loggedin")
        socket.to(room).emit("newConnection")
    })

    socket.on("sendmessage",  async ({ message, room }) => {

        await RoomModel.findOneAndUpdate({ name: room },
        {
            $push: { chatHistory: message }
        })
        socket.to(room).emit("message", message)
        // socket.broadcast.emit("message", message)
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    })
})

export { httpServer }