import mongoose, { Model } from 'mongoose'
import { RegisteredUsers } from './types'
import bcrypt from 'bcrypt'
import { Document } from "mongoose"

const { Schema, model } = mongoose

interface UserModel extends Model<RegisteredUsers> {
    verifyCredentials(email: string, password: string): Promise<RegisteredUsers & Document | null>;
  }

const UserSchema = new Schema<RegisteredUsers>(
    {   
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String, required: function (this:RegisteredUsers) { return !this.email}},
    email: { type: String, required: true },
    password: { type: String, required: function(this: RegisteredUsers) { return !this.googleId }},
    followers: [{type: Schema.Types.ObjectId, ref: 'User'}],
    refreshToken: { type: String },
    bio: { type: String },
    location: { type: String },
    image: { type: String },
    googleId: { type: String, required: function(this: RegisteredUsers) { return !this.password }}
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
    delete userObject.refreshToken

    return userObject;
};

UserSchema.statics.verifyCredentials = async function (email: string, plainPw: string) {
    const user = await this.findOne({ email });

    if (user) {
        const isMatch = await bcrypt.compare(plainPw, user.password);
        if (isMatch) {
            console.log("matched!!!!");
            return user;
        } else {
            return null;
        }
    } else {
        return null;
    }
};


export default model<RegisteredUsers, UserModel>('User', UserSchema)