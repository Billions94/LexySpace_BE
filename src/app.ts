import express from "express"
import postRouter from "./blogPost"
import replyRouter from "./replies"
import userRouter from "./users"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import passport from "passport"
import googleCloudStrategy from "./auth/googleAuth"
import { onlineUsers } from "./dm-server"
import commentsRouter from "./comments"
import messageRouter from "./messages"


const app = express();

// MIDDLEWARES
app.use(cors())
passport.use('google', googleCloudStrategy)
app.use(express.json())
app.use(passport.initialize())

// SOCKET IO ENDPOINT
app.get("/online-users", (req, res) => {
    res.send({ onlineUsers: onlineUsers });
})

// ENDPOINTS
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/comments', commentsRouter)
app.use('/replies', replyRouter)
app.use('/messages', messageRouter)

// ENDPOINTS TABLE
console.table(listEndpoints(app))




export { app }