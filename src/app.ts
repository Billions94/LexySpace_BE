import express from "express";
import postRouter from "./blogPost";
import replyRouter from "./replies";
import userRouter from "./users";
import listEndpoints from "express-list-endpoints";
import cors from "cors";

const app = express();

app.use(cors())
app.use(express.json())
app.use('/users', userRouter)
app.use('/posts', postRouter)
app.use('/replies', replyRouter)

console.table(listEndpoints(app))




export { app }