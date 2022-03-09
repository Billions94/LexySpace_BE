import express from 'express'
import replyHandler from './r-handler'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'


const { CLOUD_NAME, API_KEY, API_SECRET } = process.env


cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET,
    secure: true
})

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary, // CREDENTIALS,
    params: <Options['params']>{
        folder: "capstone",
        resource_type: "auto",
    },
})
// VIDEO CLOUD STORAGE
const videoUpload = multer({
    storage: cloudinaryStorage,
    limits: {
      fileSize: 100000000 // 10000000 Bytes = 100 MB
    },
    fileFilter(req, file, cb) {
      // upload only mp4 and mkv format
      if (!file.originalname.match(/\.(mp4|MPEG-4|mkv)$/)) {
        return cb(new Error('Please upload a video'))
      }
      cb(null, true)
    }
  })



const replyRouter = express.Router()

replyRouter.route('/')
    .get(replyHandler.getAll)

replyRouter.put('/:id/upload', multer({ storage: cloudinaryStorage }).single('media'), replyHandler.addMedia)

// Post Video
replyRouter.put('/:id/upload', videoUpload.single('media'), replyHandler.addMedia)

replyRouter.route('/:id')
    .post(replyHandler.postReply)
    .get(replyHandler.getById)
    .delete(replyHandler.deleteReply)

replyRouter.route('/:id/:replyId')
    .put(replyHandler.updateReply)

export default replyRouter