import mongoose from 'mongoose'
import { RegisteredUsers } from './types'
import bcrypt from 'bcrypt'


const { Schema, model } = mongoose

const UserSchema = new Schema<RegisteredUsers>(
    {   
    name: { type: String },
    lastName: { type: String },
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    refreshToken: { type: String },
    bio: { type: String },
    image: { type: String },
    },
    {
        timestamps: true
    }
)

UserSchema.pre("save", async function (next) {
    const newUser = this;

    const plainPw = newUser.password;

    console.log("=======================> plain password before hash", plainPw);
    if (newUser.isModified("password")) {
        const hash = await bcrypt.hash(plainPw, 10);
        newUser.password = hash;
        console.log("=======================> plain password after hash", hash);
    }
    next();
});

UserSchema.methods.toJSON = function () {
    const userDoc = this;
    const userObject = userDoc.toObject();
    delete userObject.password;
    delete userObject.__v;

    return userObject;
};

// UserSchema.statics.verifyCredentials = async function (email: string, plainPw: string) {
//     const user = await this.findOne({ email });

//     if (user) {
//         const isMatch = await bcrypt.compare(plainPw, user.password);
//         if (isMatch) {
//             console.log("matched!!!!");
//             return user;
//         } else {
//             return null;
//         }
//     } else {
//         return null;
//     }
// };


export default model<RegisteredUsers>('User', UserSchema)