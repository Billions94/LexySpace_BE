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

const addUser = (_id: string, userName: string, image: string, socketId: string) => {
    !onlineUsers.some(user => user._id === _id) && 
    onlineUsers.push({ _id, userName, image, socketId })
}

const getUser = (_id: string) => {
    return onlineUsers.find(user => user._id === _id)
}


io.on("connection", (socket) => {


    socket.on("setUsername", ({ userId, userName, image }) => {
        console.log({ userName, image })
        addUser(userId, userName, image, socket.id)
        io.emit('getUsers', onlineUsers)
    })


    socket.on('typing', (data) => {
        io.emit("typing", {userName: data.userName})
    })
    

    socket.on("sendmessage",  async ({ message }) => {

        const user = getUser(message.receiver)
        io.to(user!.socketId).emit('getMessage', {
            sender: message.sender,
            message
        })
        console.log(user, message, message.sender)
        // const conversation = await RoomModel.find({
        // //     $and: [
        // //       { members: { $in: [message.sender] } },
        // //       { members: { $in: [message.receiver] } }
        // //     ]
        // // })

        // // if(conversation) {
        // //     conversation.findOne({})
        // // }
         

        // // await RoomModel.findOneAndUpdate({ name: room },
        // // {
        // //     $push: { chatHistory: message }
        // // })
        // // socket.to(room).emit("message", message)
        // // socket.broadcast.emit("message", message)
        // console.log(message)
    })
    

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
        onlineUsers = onlineUsers.filter(user => user.socketId !== socket.id)
        io.emit('getUsers', onlineUsers)
    })
})

export { httpServer }


//1. Make an endpoint so you can find users without knowing their ids
// 2. On the client get the ID of the receiver with the endpoint
// 3. Send the message on socket to the BE with sender and receiver ID
// 4. Look for their chatroom in the DB if there is one update it, if not make a new chatroom for them
// 5. If the receiver is online on socket, forward the message/tell the receiver to fetch the messages because there is a new one, on socket.
// 6. Inside the message if the sender's ID = the client's id display the message on the right, if not display it on the left