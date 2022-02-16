import { createServer } from "http"
import { Server } from "socket.io"
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

const addUser = (_id: string, userName: string, image: string, socketId: string) => {
    !onlineUsers.some(user => user._id === _id) && 
    onlineUsers.push({ _id, userName, image, socketId })
}

const getUser = (_id: string) => {
    return onlineUsers.find(user => user._id === _id)
}

io.on("connection", (socket) => {
    // New Connection Event
    socket.on("setUsername", ({ userId, userName, image }) => {
        console.log({ userName, image })
        addUser(userId, userName, image, socket.id)
        io.emit('getUsers', onlineUsers)
    })

    // Typing Event
    socket.on('typing', () => {
        socket.broadcast.emit('typing')
    })

    // Instant Message Event
    socket.on("sendmessage",  async ({ message }) => {
        const user = getUser(message.receiver)
        io.to(user!.socketId).emit('message', {
            sender: message.sender,
            message
        })
        console.log('message', message)
    })
    
    // Disconnect 
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        io.emit('getUsers', onlineUsers)
    })
})

export { httpServer }
