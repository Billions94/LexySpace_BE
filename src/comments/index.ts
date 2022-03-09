import express from 'express'
import commentsHandler from './c-handler'
import { CloudinaryStorage, Options } from 'multer-storage-cloudinary'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'


const { CLOUD_NAME, API_KEY, API_SECRET } = process.env


cloudinary.config({
  cloud_name: CLOUD_NAME,
  api_key: API_KEY,
  api_secret: API_SECRET,
  secure: true
});

// IMAGE CLOUD STORAGE
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary: cloudinary, // CREDENTIALS,
  params: <Options['params']>{
    folder: "capstone",
    resource_type: "auto",
  },
});

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


const commentsRouter = express.Router()
commentsRouter.put('/:id/upload', multer({ storage: cloudinaryStorage }).single('media'), commentsHandler.addMedia)

// Post Video
commentsRouter.put('/:id/upload', videoUpload.single('media'), commentsHandler.addMedia)

commentsRouter.post('/:id', commentsHandler.createComment)
commentsRouter.get('/', commentsHandler.getAllComments)

commentsRouter.route('/:commentId')
  .put(commentsHandler.updateComment)
  .get(commentsHandler.getCommentById)
  .delete(commentsHandler.deleteComment)

export default commentsRouter