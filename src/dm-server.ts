import { createServer } from "http"
import { Server } from "socket.io"
import MessageModel from "./messages/schema"
import { app } from "./app"

process.env.TS_NODE_DEV && require("dotenv").config()

const httpServer = createServer(app)

const io = new Server(httpServer)

io.on("connection", (socket) => {
    console.log(socket.id)

    socket.on("sendmessage", (message) => {
        io.emit('sendmessage', message)
    })

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
    })
})

export { httpServer }