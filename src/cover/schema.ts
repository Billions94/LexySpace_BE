import mongoose from 'mongoose';
import { Cover } from './interface'


const { Schema, model } = mongoose

const CoverSchema = new Schema<Cover>({
    cover: {type: String, required: true},
},
{
    timestamps: true
})

export default model('Cover', CoverSchema)