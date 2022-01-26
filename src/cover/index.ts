import express from 'express'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import CoverModel from './schema'

const coverRouter = express.Router()

process.env.TS_NODE_DEV && require("dotenv").config()

const { CLOUD_NAME, API_KEY, API_SECRET } = process.env

cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true
});

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary, // CREDENTIALS,
    params: <Options['params']>{
        folder: "capstone",
    },
});

// Post image
coverRouter.post('/', multer({ storage: cloudinaryStorage }).single('cover'), async (req, res, next) => {
    try {
        const imgPath = req.file!.path
        const newCover = new CoverModel(req.body)
        newCover.cover = imgPath
        await newCover.save()
        // const post = await CoverModel.findByIdAndUpdate(postId, { $set: { cover: imgPath }}, { new: true })
        if (newCover) {
            res.status(203).send(newCover)
        } else {
            res.status(404).send({ message: "Cover could not be uploaded" });
        }
    } catch (error) {
        console.log(error)
        next(error);
    }
})

coverRouter.get('/', async (req, res, next) => {
    try {
        const covers = await CoverModel.find()
        if(covers) {
            res.send(covers)
        } else throw new Error('Could not get covers')
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default coverRouter