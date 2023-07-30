import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from 'next-auth/providers/credentials';
import connectMongo from "../../../database/conn";
import Users from "../../../model/Schema";
import { compare } from "bcryptjs";

export default NextAuth({
    providers: [
        // Google Provider
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET
        }),
        CredentialsProvider({
            name: "Credentials",
            async authorize(credentials, req){
                connectMongo().catch(error => { error: "Connection Failed...!" })
            
                // check user existence
                const result = await Users.findOne({ email: credentials.email })
                if(!result) {
                    throw new Error("No user Found with Email Please Sign Up...!")
                }

                // compare()
                const checkPassword = await compare(credentials.password, result.password);

                // incorrect password
                if(!checkPassword || result.email !== credentials.email) {
                    throw new Error("Username or Password doesn't match!")
                }

                return result;

            }
        })
    ],
    secret: "96WeZLWWKcNyRrTr44rs2a2yh0J6MdUcPFmEGkwOrI8="
})