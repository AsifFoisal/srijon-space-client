import { mongodbAdapter } from "@better-auth/mongo-adapter";
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";


const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("srijonspace");

export const auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL,
    database: mongodbAdapter(db, {
        client,
    }),
    emailAndPassword: {
        enabled: true,
        autoSignIn: false,
        minPasswordLength: 6,
    },

    socialProviders: {
        google: {
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        },
    },

});