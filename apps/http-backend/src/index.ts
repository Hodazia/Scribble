import express from "express";
import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import auth from "./middleware";
import {CreateUserSchema }  from "@repo/common-zod/types"
import { prismaclient} from "@repo/db/client"

const app = express();
const SALT_ROUNDS = 10;
// 
app.get("/" ,(req:Request,res:Response) => {
    res.send("Hello world");
})

// DO ZOD VALIDATION IN BOTH OF THEM
app.post("/signup", async (req:Request,res:Response) => {
    const parsedData = CreateUserSchema.safeParse(req.body);
    if (!parsedData.success) {
        console.log(parsedData.error);
        res.json({
            message: "Incorrect inputs"
        })
        return;
    }
    const {email,name,password} = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // this u store in the db
    try {
        const user = await prismaclient.user.create({
            data: {
                email: email,
                // TODO: Hash the pw
                password: hashedPassword,
                name: name
            }
        })
        res.json({
            userId: user.id
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists with this username"
        })
    }


    // insert it into the db


})

app.post("/signin", async (req:Request,res:Response) => {

});

app.post("/create-room", auth, async (req:Request,res:Response) => {
    
})

app.listen(3000, () => {
    console.log("greetings u are connected now !");
})