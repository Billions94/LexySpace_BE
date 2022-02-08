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


//1. Make an endpoint so you can find users without knowing their ids
// 2. On the client get the ID of the receiver with the endpoint
// 3. Send the message on socket to the BE with sender and receiver ID
// 4. Look for their chatroom in the DB if there is one update it, if not make a new chatroom for them
// 5. If the receiver is online on socket, forward the message/tell the receiver to fetch the messages because there is a new one, on socket.
// 6. Inside the message if the sender's ID = the client's id display the message on the right, if not display it on the left