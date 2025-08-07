import express from "express";
import { Request,Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"
import auth from "./middleware";
import {CreateUserSchema }  from "@repo/common-zod/types"

const app = express();
const SALT_ROUNDS = 10;
// 
app.get("/" ,(req:Request,res:Response) => {
    res.send("Hello world");
})

// DO ZOD VALIDATION IN BOTH OF THEM
app.post("/signup", async (req:Request,res:Response) => {
    const {email,name,password} = req.body;

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    // this u store in the db


    // insert it into the db


})

app.post("/signin", async (req:Request,res:Response) => {

});

app.post("/create-room", auth, async (req:Request,res:Response) => {
    
})

app.listen(3000, () => {
    console.log("greetings u are connected now !");
})