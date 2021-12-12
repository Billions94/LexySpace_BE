import express from "express";
import postRouter from "./blogPost";
import userRouter from "./users";

const app = express();

app.use(express.json())
app.use('/users', userRouter)
app.use('/posts', postRouter)




export { app }