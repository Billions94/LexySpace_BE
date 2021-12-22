import passport from "passport"
import  { Strategy as GoogleStrategy } from "passport-google-oauth20"
import UserModel from "../users/schema"
import { tokenGenerator } from "./authTools"

process.env.TS_NODE_DEV && require("dotenv").config()

const { CLIENT_ID, CLIENT_SECRET, API_URL } = process.env

interface Profile {
    id: string;
    name: {
        givenName: string;
        familyName: string;
    }
    emails: Emails[]
}

interface Emails {
    value: string
}

const googleCloudStrategy = new GoogleStrategy({
    clientID: CLIENT_ID!,
    clientSecret: CLIENT_SECRET!,
    callbackURL: `${API_URL}/users/googleRedirect`
},
async (accessToken, refreshToken, profile, passportNext) => {
    try {
        // throw new Error("Random error test")
        
        console.log('===================>', profile)
        const user = await UserModel.findOne({ googleId: profile.id })

        if(user) {
            const tokens = await tokenGenerator(user)
            passportNext(null, { tokens })
            
        } else {
            const newUser = new UserModel({
                firstName: profile?.name?.givenName || profile.id,
                lastName: profile?.name?.familyName || "",
                email:  profile!.emails![0].value,
                googleId: profile.id
            })

            const savedUser = await newUser.save()
            const tokens = await tokenGenerator(savedUser)
            passportNext(null, { tokens })
        }
    } catch (error: unknown) {
        // console.log(error)
        passportNext(error as Error)
    }
})

passport.serializeUser(function (data, passportNext) {
    passportNext(null, data)
})

export default googleCloudStrategy