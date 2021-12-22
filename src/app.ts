import express from "express";
import postRouter from "./blogPost";
import replyRouter from "./replies";
import userRouter from "./users";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import passport from "passport"
import googleCloudStrategy from "./auth/googleAuth";


const app = express();
// MIDDLEWARES

app.use(cors())
passport.use('google', googleCloudStrategy)
app.use(express.json())
app.use(passport.initialize())

// ENDPOINTS
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/replies', replyRouter)

// ENDPOINTS TABLE
console.table(listEndpoints(app))




export { app }