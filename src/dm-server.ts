import { createServer } from "http"
import { Server } from "socket.io"
import RoomModel from "./messages/schema"
import { OnlineUser } from "./messages/interfaces"
import { app } from "./app"

process.env.TS_NODE_DEV && require("dotenv").config()

const httpServer = createServer(app)

const io = new Server(httpServer)

export const onlineUsers: OnlineUser[] =[]

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("setUsername", ({ userName, room }) => {
        console.log({userName, room})
        onlineUsers.push({ userName: userName, socketId: socket.id, room: room })

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
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
        // onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
    })
})

export { httpServer }