import { httpServer } from './dm-server';
import mongoose from "mongoose"

process.env.TS_NODE_DEV && require("dotenv").config()

const port = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_URL_CONNECTION!)
    .then(() => {
        console.log(`Connected to Mongo 🟢`);
        httpServer.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        })
    })
